// CHANGELOG: 2025-01-26 - Auto-create n8n agent for new users
// CHANGELOG: 2025-01-26 - Auto-create n8n user account for new Avallon users
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getAgentProvider } from "@/lib/providers";
import { createAgent, listAgentsByUser } from "@/data/agents";
import { logInfo, logError } from "@/lib/log";
import { trackEvent } from "@/lib/monitoring";
import { createN8nUser } from "@/lib/n8n/users";
import { encrypt } from "@/lib/crypto";
import { prisma } from "@/lib/db";
import { getCorsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req),
  });
}

/**
 * Onboard a new user by creating their default n8n agent
 * This ensures each user has their own private n8n workflow
 */
export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    // Try to get user email and password from request body first (for explicit onboarding)
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body might be empty
    }
    let userEmail = body.email;
    let userPassword = body.password; // Password from signup form (optional - will use for n8n if provided)
    
    // Get user (will use email from session/headers if available)
    let user = await getUser();
    
    // If email provided in body, use it to create user-specific ID for proper isolation
    if (userEmail && userEmail !== 'test@example.com' && userEmail !== 'user@example.com') {
      const userId = `user_${Buffer.from(userEmail).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}`;
      user = {
        ...user,
        id: userId,
        email: userEmail,
      };
    }
    
    // Check if user already has an agent
    const existingAgents = await listAgentsByUser(user.id);
    
    // Check if user has n8n credentials stored
    let dbUser: any = null;
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      logInfo('Found user in database', { email: user.email, userId: dbUser?.id, credits: dbUser?.credits });
    } catch (e) {
      // Try raw SQL if Prisma fails
      try {
        const result = await prisma.$queryRaw`
          SELECT * FROM "User" WHERE email = ${user.email} LIMIT 1
        `;
        if (Array.isArray(result) && result.length > 0) {
          dbUser = result[0];
          logInfo('Found user via raw SQL', { email: user.email, credits: dbUser?.credits });
        }
      } catch (rawError) {
        logError('Failed to find user', rawError, { email: user.email });
      }
    }
    
    // Ensure user has at least 20 credits if they exist
    if (dbUser && (dbUser.credits === null || dbUser.credits === undefined || dbUser.credits < 20)) {
      try {
        const { getPlanCredits } = await import("@/lib/billing/credits");
        await prisma.user.update({
          where: { email: user.email },
          data: { credits: getPlanCredits('free') },
        });
        logInfo('Updated user credits to 20', { email: user.email, userId: dbUser.id });
        // Refresh dbUser
        dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
      } catch (creditError) {
        logError('Failed to update user credits', creditError, { email: user.email });
      }
    }
    
    const hasN8nCredentials = dbUser && dbUser.n8nPassword;
    
    // If user has agents AND n8n credentials, skip onboarding
    if (existingAgents.length > 0 && hasN8nCredentials) {
      logInfo('User already has agents and n8n credentials, skipping onboarding', { 
        userId: user.id, 
        agentCount: existingAgents.length 
      });
      return NextResponse.json({ 
        message: "User already onboarded",
        agentId: existingAgents[0].id,
        n8nId: existingAgents[0].n8nId,
        skip: true
      }, { headers: corsHeaders });
    }
    
    // If user has agents but no n8n credentials, still create n8n account
    if (existingAgents.length > 0 && !hasN8nCredentials) {
      logInfo('User has agents but no n8n credentials, creating n8n account', { 
        userId: user.id, 
        agentCount: existingAgents.length 
      });
    }

    // Create default agent for the user (only if they don't have one)
    const skipAgentCreation = existingAgents.length > 0;
    const defaultName = `${user.email?.split('@')[0] || 'User'}'s AI Agent`;
    const defaultPrompt = `You are a helpful AI assistant for ${user.email || 'the user'}. 
You help users with their questions, tasks, and website generation needs.
Be professional, friendly, and always aim to provide accurate and helpful responses.`;

    if (!skipAgentCreation) {
      logInfo('Creating default n8n agent for new user', { 
        userId: user.id, 
        email: user.email,
        name: defaultName 
      });
    } else {
      logInfo('Skipping agent creation, user already has agents', { 
        userId: user.id, 
        email: user.email,
        agentCount: existingAgents.length 
      });
    }

    // Step 1: Create n8n user account (if configured)
    let n8nUserAccount = null;
    try {
      const hasN8nConfig = process.env.N8N_BASE_URL && (process.env.N8N_API_KEY || (process.env.N8N_ADMIN_EMAIL && process.env.N8N_ADMIN_PASSWORD));
      logInfo('n8n configuration check', { 
        hasBaseUrl: !!process.env.N8N_BASE_URL,
        hasApiKey: !!process.env.N8N_API_KEY,
        hasAdminEmail: !!process.env.N8N_ADMIN_EMAIL,
        hasAdminPassword: !!process.env.N8N_ADMIN_PASSWORD,
        willCreate: hasN8nConfig
      });
      
      if (hasN8nConfig) {
        logInfo('Creating n8n user account', { email: user.email, useCustomPassword: !!userPassword });
        // Use the password from signup if provided, otherwise auto-generate
        n8nUserAccount = await createN8nUser({
          email: user.email,
          firstName: user.email.split('@')[0],
          password: userPassword || undefined, // Use signup password if available, otherwise auto-generate
        });
        logInfo('n8n user account created', { 
          n8nUserId: n8nUserAccount?.id, 
          email: n8nUserAccount?.email,
          hasApiKey: !!n8nUserAccount?.apiKey,
          hasPassword: !!n8nUserAccount?.password
        });

        // Store encrypted password and n8n user ID in database
        // CRITICAL: We must store this immediately - password is only available during creation
        if (n8nUserAccount.password && n8nUserAccount.id) {
          const encryptedPassword = encrypt(n8nUserAccount.password);
          let userStored = false;
          
          try {
            // First, try to find existing user using raw SQL (most reliable)
            let dbUser: any = null;
            try {
              const existingUsers = await prisma.$queryRaw`
                SELECT id, email FROM "User" WHERE email = ${user.email} LIMIT 1
              `;
              if (Array.isArray(existingUsers) && existingUsers.length > 0) {
                dbUser = existingUsers[0];
              }
            } catch (e) {
              // Ignore - will try Prisma next
            }
            
            if (!dbUser) {
              // Try Prisma findUnique
              try {
                dbUser = await prisma.user.findUnique({
                  where: { email: user.email },
                });
              } catch (e) {
                // Ignore
              }
            }

            if (dbUser) {
              // Update existing user - try multiple methods
              try {
                await prisma.user.update({
                  where: { id: dbUser.id },
                  data: {
                    n8nPassword: encryptedPassword,
                    n8nUserId: n8nUserAccount.id,
                    email: user.email,
                  },
                });
                logInfo('Updated existing user with n8n credentials', { userId: dbUser.id, email: user.email });
                userStored = true;
              } catch (updateError: any) {
                logError('Prisma update failed, trying raw SQL', updateError, { email: user.email });
                // Try raw SQL update
                await prisma.$executeRaw`
                  UPDATE "User" 
                  SET "n8nPassword" = ${encryptedPassword}, "n8nUserId" = ${n8nUserAccount.id}
                  WHERE email = ${user.email}
                `;
                logInfo('Updated user via raw SQL', { email: user.email });
                userStored = true;
              }
            } else {
              // Create new user - this is the critical path
              // Create new user record if it doesn't exist
              // Check if clerkId column exists first
              let clerkIdColumnExists = false;
              try {
                const columnCheck = await prisma.$queryRaw`
                  SELECT column_name 
                  FROM information_schema.columns 
                  WHERE table_name = 'User' AND column_name = 'clerkId'
                `;
                clerkIdColumnExists = Array.isArray(columnCheck) && columnCheck.length > 0;
              } catch (e) {
                // Column check failed, assume it doesn't exist
                clerkIdColumnExists = false;
              }
              
              try {
                if (clerkIdColumnExists) {
                  // Use Prisma upsert if clerkId column exists
                  const clerkId = user.clerkId || `email_${Buffer.from(user.email).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}_${Date.now()}`;
                  
                  const newUser = await prisma.user.upsert({
                    where: { email: user.email },
                    update: {
                      n8nPassword: encrypt(n8nUserAccount.password),
                      n8nUserId: n8nUserAccount.id,
                      clerkId: user.clerkId || clerkId,
                    },
                    create: {
                      clerkId: clerkId,
                      email: user.email,
                      n8nPassword: encrypt(n8nUserAccount.password),
                      n8nUserId: n8nUserAccount.id,
                    },
                  });
                  logInfo('Created/updated user with n8n credentials', { userId: newUser.id, email: user.email });
                } else {
                  // Create new user record - try multiple approaches
                  const encryptedPassword = encrypt(n8nUserAccount.password);
                  const dummyClerkId = `email_${Buffer.from(user.email).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}_${Date.now()}`;
                  const clerkId = user.clerkId || dummyClerkId;
                  
                  let userCreated = false;
                  
                  // Approach 1: Try Prisma upsert (works if schema matches)
                  try {
                    logInfo('Attempting Prisma upsert', { email: user.email });
                    // First check if user exists
                    const existingUser = await prisma.user.findUnique({
                      where: { email: user.email },
                    });
                    
                    if (existingUser) {
                      // Update existing user - ensure they have at least 20 credits
                      const creditsToSet = existingUser.credits === null || existingUser.credits < 20 ? 20 : existingUser.credits;
                      const updatedUser = await prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                          n8nPassword: encryptedPassword,
                          n8nUserId: n8nUserAccount.id,
                          clerkId: clerkId,
                          credits: creditsToSet,
                        },
                      });
                      logInfo('User updated via Prisma', { userId: updatedUser.id, email: user.email, credits: updatedUser.credits });
                      userCreated = true;
                    } else {
                      // Create new user with 20 free credits
                      const { getPlanCredits } = await import("@/lib/billing/credits");
                      const newUser = await prisma.user.create({
                        data: {
                          clerkId: clerkId,
                          email: user.email,
                          n8nPassword: encryptedPassword,
                          n8nUserId: n8nUserAccount.id,
                          credits: getPlanCredits('free'), // Give free plan users 20 credits
                        },
                      });
                      logInfo('User created via Prisma create', { userId: newUser.id, email: user.email, credits: newUser.credits });
                      userCreated = true;
                    }
                  } catch (prismaError: any) {
                    logError('Prisma upsert/create failed', prismaError, { 
                      email: user.email,
                      error: prismaError.message,
                      code: prismaError.code,
                      meta: prismaError.meta
                    });
                    
                      // Approach 2: Try raw SQL with clerkId (use cuid-like ID)
                      try {
                        logInfo('Attempting raw SQL insert with clerkId', { email: user.email });
                        // Generate a cuid-like ID (Prisma format)
                        const cuid = `c${Date.now().toString(36)}${Math.random().toString(36).substring(2, 11)}`;
                        const { getPlanCredits } = await import("@/lib/billing/credits");
                        const freeCredits = getPlanCredits('free');
                        await prisma.$executeRaw`
                          INSERT INTO "User" (id, "clerkId", email, "n8nPassword", "n8nUserId", credits, "createdAt", "updatedAt")
                          VALUES (${cuid}, ${clerkId}, ${user.email}, ${encryptedPassword}, ${n8nUserAccount.id}, ${freeCredits}, NOW(), NOW())
                          ON CONFLICT (email) 
                          DO UPDATE SET 
                            "n8nPassword" = EXCLUDED."n8nPassword",
                            "n8nUserId" = EXCLUDED."n8nUserId",
                            "updatedAt" = NOW()
                        `;
                        logInfo('User created via raw SQL with clerkId', { email: user.email, userId: cuid });
                        userCreated = true;
                      } catch (sqlError1: any) {
                        logError('Raw SQL with clerkId failed', sqlError1, { 
                          email: user.email,
                          error: sqlError1.message,
                          code: sqlError1.code,
                          detail: sqlError1.detail
                        });
                        
                        // Approach 3: Try raw SQL - check table structure first, then insert/update
                        try {
                          logInfo('Attempting raw SQL with table structure check', { email: user.email });
                          
                          // Check what columns exist in User table
                          const columns = await prisma.$queryRaw<Array<{column_name: string, is_nullable: string}>>`
                            SELECT column_name, is_nullable
                            FROM information_schema.columns 
                            WHERE table_name = 'User'
                            ORDER BY ordinal_position
                          `;
                          
                          const columnNames = columns.map(c => c.column_name);
                          const hasClerkId = columnNames.includes('clerkId');
                          const hasN8nPassword = columnNames.includes('n8nPassword');
                          const hasN8nUserId = columnNames.includes('n8nUserId');
                          
                          logInfo('User table structure', { 
                            email: user.email,
                            columns: columnNames,
                            hasClerkId,
                            hasN8nPassword,
                            hasN8nUserId
                          });
                          
                          if (!hasN8nPassword || !hasN8nUserId) {
                            throw new Error(`Required columns missing: n8nPassword=${hasN8nPassword}, n8nUserId=${hasN8nUserId}`);
                          }
                          
                          const cuid2 = `c${Date.now().toString(36)}${Math.random().toString(36).substring(2, 11)}`;
                          
                          // First try to update if exists
                          const updateResult = await prisma.$executeRaw`
                            UPDATE "User" 
                            SET "n8nPassword" = ${encryptedPassword},
                                "n8nUserId" = ${n8nUserAccount.id}
                            WHERE email = ${user.email}
                          `;
                          
                          if (updateResult === 0) {
                            // No rows updated, try insert - use simplest possible INSERT
                            // Give new users 20 free credits
                            const { getPlanCredits } = await import("@/lib/billing/credits");
                            const freeCredits = getPlanCredits('free');
                            const insertSql = hasClerkId
                              ? prisma.$executeRaw`INSERT INTO "User" (id, "clerkId", email, "n8nPassword", "n8nUserId", credits) VALUES (${cuid2}, ${clerkId}, ${user.email}, ${encryptedPassword}, ${n8nUserAccount.id}, ${freeCredits})`
                              : prisma.$executeRaw`INSERT INTO "User" (id, email, "n8nPassword", "n8nUserId", credits) VALUES (${cuid2}, ${user.email}, ${encryptedPassword}, ${n8nUserAccount.id}, ${freeCredits})`;
                            
                            await insertSql;
                            logInfo('User created via raw SQL INSERT', { email: user.email, userId: cuid2, hasClerkId, credits: freeCredits });
                          } else {
                            logInfo('User updated via raw SQL UPDATE', { email: user.email });
                          }
                          userCreated = true;
                          
                          // Verify it was created
                          const verify = await prisma.$queryRaw`
                            SELECT id FROM "User" WHERE email = ${user.email} AND "n8nPassword" IS NOT NULL LIMIT 1
                          `;
                          if (Array.isArray(verify) && verify.length > 0) {
                            logInfo('User record verified after creation', { email: user.email });
                          } else {
                            throw new Error('User record not found after insert');
                          }
                        } catch (sqlError2: any) {
                          logError('Raw SQL without clerkId also failed', sqlError2, { 
                            email: user.email,
                            error: sqlError2.message,
                            code: sqlError2.code,
                            detail: sqlError2.detail,
                            constraint: sqlError2.constraint
                          });
                          
                          // Log critical error with full details
                          const criticalError = {
                            email: user.email,
                            n8nUserId: n8nUserAccount.id,
                            prismaError: prismaError.message,
                            prismaCode: prismaError.code,
                            sqlError1: sqlError1.message,
                            sqlError1Code: sqlError1.code,
                            sqlError1Detail: sqlError1.detail,
                            sqlError2: sqlError2.message,
                            sqlError2Code: sqlError2.code,
                            sqlError2Detail: sqlError2.detail,
                            sqlError2Constraint: sqlError2.constraint
                          };
                          console.error('CRITICAL: All User creation methods failed', criticalError);
                          logError('CRITICAL: All User creation methods failed', new Error('User creation failed'), criticalError);
                        }
                      }
                  }
                  
                  // Verify user was created
                  if (userCreated) {
                    try {
                      const verifyUser = await prisma.user.findUnique({
                        where: { email: user.email },
                      });
                      if (verifyUser && verifyUser.n8nPassword) {
                        logInfo('User record verified successfully', { 
                          email: verifyUser.email,
                          userId: verifyUser.id
                        });
                      } else {
                        logError('User record verification failed - no password', new Error('Password missing'), { 
                          email: user.email 
                        });
                      }
                    } catch (verifyError: any) {
                      logError('User record verification error', verifyError, { email: user.email });
                    }
                  }
                }
              } catch (createError: any) {
                logError('Failed to create user record', createError, { email: user.email });
                // Don't throw - n8n account was created, just DB record failed
              }
            }
          } catch (dbError: unknown) {
            // Don't fail onboarding if storing credentials fails
            logError('Failed to store n8n credentials (non-blocking)', dbError, { email: user.email });
          }
        }
      } else {
        logInfo('n8n user creation skipped - not configured', { email: user.email });
      }
    } catch (n8nUserError: unknown) {
      // Don't fail onboarding if n8n user creation fails - workflows can still be created with API key
      logError('Failed to create n8n user account (non-blocking)', n8nUserError, { email: user.email });
    }

    // Create agent in database first (only if user doesn't have one)
    let agent = existingAgents.length > 0 ? existingAgents[0] : null;
    
    if (!skipAgentCreation) {
      try {
        agent = await createAgent({
          ownerId: user.id,
          name: defaultName,
          n8nId: null,
          status: "inactive",
        });
      } catch (createError: unknown) {
        logError('Failed to create agent record during onboarding', createError);
        const errorMessage = createError instanceof Error ? createError.message : 'Unknown error';
        return NextResponse.json({
          error: `Failed to create agent: ${errorMessage}`,
          details: errorMessage
        }, { status: 500, headers: corsHeaders });
      }

      try {
        // Create n8n workflow (use user's API key if available, otherwise use global API key)
        const provider = getAgentProvider();
        const result = await provider.createAgent({ 
          name: defaultName, 
          prompt: defaultPrompt,
          activate: false // Keep inactive until user explicitly activates it
        });

        // Update agent with n8n workflow ID
        const { updateAgent } = await import("@/data/agents");
        agent = await updateAgent(agent.id, {
          n8nId: result.externalId || null,
          status: "inactive",
        });

        if (agent) {
          logInfo('Default n8n agent created for user', { 
            userId: user.id,
            agentId: agent.id,
            n8nId: agent.n8nId 
          });

          trackEvent("user.onboarded", {
            userId: user.id,
            agentId: agent.id,
            n8nId: agent.n8nId,
          });
        }
      } catch (apiError: unknown) {
        // If n8n creation fails, still keep the agent record but mark as inactive
        // Don't fail onboarding - user can create agents later when API key is fixed
        logError('Failed to create n8n agent during onboarding (non-blocking)', apiError);
        
        // Try to update agent status
        if (agent) {
          try {
            const { updateAgent } = await import("@/data/agents");
            await updateAgent(agent.id, { status: "inactive" });
          } catch (updateError) {
            logError('Failed to update agent status', updateError);
          }

          // Log warning but don't fail - signup should still succeed
          const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
          logError('n8n agent creation failed - continuing onboarding', apiError, {
            agentId: agent.id,
            error: errorMessage,
            note: 'User can create agents later when API key is configured'
          });
        }
        // Continue execution - don't return error
      }
    }

    // Send welcome email from hello@avallon.ca when user successfully joins
    try {
      const { emailService } = await import("@/lib/emailService");
      const userName = user.email.split('@')[0] || 'User';
      await emailService.sendNewUserWelcomeEmail(user.email, userName);
      logInfo('Welcome email sent to new user', { email: user.email });
    } catch (emailError: any) {
      // Don't fail onboarding if email fails
      logError('Failed to send welcome email (non-critical)', emailError, { email: user.email });
    }

    // Return success response (with or without agent creation)
    const message = n8nUserAccount 
      ? (skipAgentCreation ? "n8n account created successfully" : "User onboarded successfully")
      : (skipAgentCreation ? "Onboarding completed (n8n account creation skipped - check configuration)" : "User onboarded (n8n account creation skipped - check configuration)");
    
    // Check if User record was created successfully
    let userRecordExists = false;
    if (n8nUserAccount) {
      try {
        const checkUser = await prisma.$queryRaw`
          SELECT id FROM "User" WHERE email = ${user.email} AND "n8nPassword" IS NOT NULL LIMIT 1
        `;
        userRecordExists = Array.isArray(checkUser) && checkUser.length > 0;
      } catch (e) {
        // Ignore check error
      }
    }
    
    return NextResponse.json({
      message,
      agent: agent ? {
        id: agent.id,
        name: agent.name,
        n8nId: agent.n8nId,
        status: agent.status,
      } : null,
      n8nAccount: n8nUserAccount ? {
        id: n8nUserAccount.id,
        email: n8nUserAccount.email,
        hasApiKey: !!n8nUserAccount.apiKey,
      } : null,
      // IMPORTANT: Return password if User record creation failed (so user can still log in)
      n8nPassword: n8nUserAccount && !userRecordExists ? n8nUserAccount.password : undefined,
      warning: !n8nUserAccount 
        ? "n8n account was not created. Please check N8N_BASE_URL and N8N_API_KEY or N8N_ADMIN_EMAIL/N8N_ADMIN_PASSWORD environment variables."
        : !userRecordExists 
        ? "n8n account created but database record failed. Password provided below - please save it."
        : undefined,
    }, { headers: corsHeaders });

  } catch (error: unknown) {
    logError('User onboarding failed', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });
    }
    return NextResponse.json({
      error: errorMessage || "Internal server error",
      details: errorMessage
    }, { status: 500, headers: corsHeaders });
  }
}

/**
 * Check if user is onboarded (has an agent)
 */
export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const user = await getUser();
    const agents = await listAgentsByUser(user.id);
    
    return NextResponse.json({
      onboarded: agents.length > 0,
      agentCount: agents.length,
      agents: agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        n8nId: agent.n8nId,
        status: agent.status,
      }))
    }, { headers: corsHeaders });
  } catch (error: unknown) {
    logError('Check onboarding status failed', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}

