// CHANGELOG: 2025-01-26 - Add n8n user account creation
import axios from 'axios';
import nodemailer from 'nodemailer';
import { logError, logInfo } from '@/lib/log';

const N8N = (process.env.N8N_BASE_URL || '').trim().replace(/\/$/, '');
const N8N_KEY = (process.env.N8N_API_KEY || '').trim().replace(/^["']|["']$/g, '');
const N8N_ADMIN_EMAIL = process.env.N8N_ADMIN_EMAIL || '';
const N8N_ADMIN_PASSWORD = process.env.N8N_ADMIN_PASSWORD || '';

export interface CreateN8nUserInput {
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export interface N8nUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  globalRole: string;
  apiKey?: string;
  password?: string; // Only returned when creating a new user, for storage
}

/**
 * Create a new n8n user account
 * Requires admin credentials or API key with user management permissions
 */
export async function createN8nUser(input: CreateN8nUserInput): Promise<N8nUser> {
  if (!N8N) {
    throw new Error('N8N_BASE_URL is not configured. Please set N8N_BASE_URL in your .env file.');
  }

  // Test n8n connection first
  try {
    const testResponse = await axios.get(`${N8N}/api/v1/users`, {
      headers: { 'X-N8N-API-KEY': N8N_KEY },
      timeout: 5000,
    });
  } catch (connError: any) {
    if (connError.response?.status === 401) {
      logError('n8n API key is invalid or expired', connError, { baseUrl: N8N });
      throw new Error('n8n API key is invalid or expired. Please generate a new API key from n8n Settings → API and update N8N_API_KEY in your .env file.');
    }
    // Continue if it's not an auth error (might be able to use admin login)
  }

  try {
    // Generate a secure password if not provided
    const password = input.password || generateSecurePassword();
    
    // Try to create user via API (requires admin API key)
    if (N8N_KEY) {
      try {
        logInfo('Creating n8n user via API', { email: input.email, baseUrl: N8N });
        
        // n8n API v1 expects an array of users, not a single object
        // If invitations are enabled, set emailSent: true to send invitation during creation
        const shouldSendInvite = process.env.N8N_SEND_INVITATIONS === 'true';
        const response = await axios.post(
          `${N8N}/api/v1/users`,
          [{
            email: input.email,
            firstName: input.firstName || input.email.split('@')[0],
            lastName: input.lastName || '',
            password: password,
            emailSent: shouldSendInvite, // Send invitation email if enabled
            signupUrl: `${N8N}/signup`, // Provide signup URL for auto-activation
            // Don't specify role - n8n will assign default role
          }],
          {
            headers: {
              'X-N8N-API-KEY': N8N_KEY,
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout for user creation (reduced for faster response)
          }
        );

        // Response is an array with user objects wrapped in {user: {...}, error: ""}
        const users = Array.isArray(response.data) ? response.data : [response.data];
        const userResponse = users[0];
        
        // Extract user from response (n8n wraps it)
        const user = userResponse.user || userResponse;
        
        if (userResponse.error) {
          throw new Error(`n8n API error: ${userResponse.error}`);
        }
        
        logInfo('n8n user created via API', { userId: user.id, email: user.email, isPending: user.isPending });
        
        // If user is pending, try to activate them using password change method
        if (user.isPending) {
          logInfo('User is pending, attempting activation via password change', { userId: user.id, email: user.email });
          
          // Method 1: Try to change password via admin session (this activates the user)
          if (N8N_ADMIN_EMAIL && N8N_ADMIN_PASSWORD) {
            try {
              // Login as admin
              const loginResponse = await axios.post(
                `${N8N}/rest/login`,
                {
                  emailOrLdapLoginId: N8N_ADMIN_EMAIL,
                  password: N8N_ADMIN_PASSWORD,
                },
                {
                  headers: { 'Content-Type': 'application/json' },
                  timeout: 10000,
                }
              );
              
              const sessionCookie = loginResponse.headers['set-cookie']?.[0];
              
              if (sessionCookie) {
                // Change user's password via admin - this also activates them
                await axios.patch(
                  `${N8N}/rest/users/${user.id}/password`,
                  { newPassword: password },
                  {
                    headers: {
                      'Cookie': sessionCookie,
                      'Content-Type': 'application/json',
                    },
                  }
                );
                
                logInfo('User activated via admin password change', { userId: user.id, email: user.email });
                user.isPending = false;
              }
            } catch (adminError: any) {
              logInfo('Admin password change failed, trying API method', { 
                userId: user.id, 
                email: user.email,
                error: adminError.message 
              });
            }
          }
          
          // Method 2: Try direct API activation if admin method failed
          if (user.isPending) {
            try {
              const cleanApiKey = N8N_KEY.trim().replace(/^["']|["']$/g, '');
              await axios.patch(
                `${N8N}/api/v1/users/${user.id}`,
                { isPending: false },
                {
                  headers: {
                    'X-N8N-API-KEY': cleanApiKey,
                    'Content-Type': 'application/json',
                  },
                }
              );
              logInfo('User activated via API patch', { userId: user.id, email: user.email });
              user.isPending = false;
            } catch (apiError: any) {
              logInfo('API activation failed (non-critical)', { 
                userId: user.id, 
                email: user.email,
                error: apiError.message
              });
            }
          }
          
          // If still pending, log warning
          if (user.isPending) {
            console.warn(`⚠️ n8n user ${user.email} created but pending. User may need to use "Forgot Password" to activate.`);
          }
        }
        
        const createdUser = {
          id: user.id,
          email: user.email,
          firstName: user.firstName || input.firstName || input.email.split('@')[0],
          lastName: user.lastName || input.lastName || '',
          globalRole: user.role || user.globalRole || 'global:member',
          apiKey: user.apiKey,
          password: password, // Return password for storage
          isPending: user.isPending || false, // Include pending status
        };
        
        // Send invitation email if enabled (and not already sent during creation)
        // If emailSent was false during creation, try to send invitation now
        if (process.env.N8N_SEND_INVITATIONS === 'true' && !shouldSendInvite) {
          try {
            await sendN8nInvitation(createdUser.id, createdUser.email);
            logInfo('Invitation email sent successfully', { userId: createdUser.id, email: createdUser.email });
          } catch (inviteError: any) {
            // Don't fail user creation if invitation fails
            logError('Failed to send invitation email (non-critical)', inviteError, { 
              userId: createdUser.id, 
              email: createdUser.email 
            });
          }
        } else if (shouldSendInvite) {
          logInfo('Invitation email should have been sent during user creation', { 
            userId: createdUser.id, 
            email: createdUser.email 
          });
          // Also try to manually send invitation to ensure it's sent
          // Sometimes n8n doesn't send automatically even with emailSent: true
          try {
            await sendN8nInvitation(createdUser.id, createdUser.email);
            logInfo('Invitation email sent manually as backup', { userId: createdUser.id, email: createdUser.email });
          } catch (inviteError: any) {
            // Don't fail user creation if invitation fails
            logError('Failed to send invitation email manually (non-critical)', inviteError, { 
              userId: createdUser.id, 
              email: createdUser.email 
            });
          }
        }
        
        return createdUser;
      } catch (apiError: any) {
        // If API key doesn't have user management permissions, try admin login
        if (apiError.response?.status === 403 || apiError.response?.status === 401) {
          logInfo('API key lacks user management permissions, trying admin login', { email: input.email });
          return await createN8nUserViaAdminLogin(input, password);
        }
        throw apiError;
      }
    }

    // Fallback: Try admin login method
    if (N8N_ADMIN_EMAIL && N8N_ADMIN_PASSWORD) {
      return await createN8nUserViaAdminLogin(input, password);
    }

    throw new Error('No n8n admin credentials configured. Set N8N_ADMIN_EMAIL and N8N_ADMIN_PASSWORD or use N8N_API_KEY with user management permissions.');
  } catch (error: any) {
    logError('Failed to create n8n user', error, { email: input.email });
    const message = error.response?.data?.message || error.message || 'Unknown error';
    throw new Error(`Failed to create n8n user: ${message}`);
  }
}

/**
 * Send invitation email to n8n user
 * Sends email directly from backend using nodemailer (bypasses n8n SMTP firewall issues)
 */
async function sendN8nInvitation(userId: string, userEmail: string): Promise<void> {
  if (!N8N) {
    throw new Error('N8N_BASE_URL is not configured');
  }

  try {
    logInfo('Sending n8n account info email directly from backend', { userId, email: userEmail });
    
    // Check if user is pending or already activated
    let isPending = false;
    let invitationUrl = null;
    
    if (N8N_KEY) {
      try {
        const cleanApiKey = N8N_KEY.trim().replace(/^["']|["']$/g, '');
        const userResponse = await axios.get(
          `${N8N}/api/v1/users/${userId}`,
          {
            headers: {
              'X-N8N-API-KEY': cleanApiKey,
              'Content-Type': 'application/json',
            },
          }
        );
        
        const user = userResponse.data?.data || userResponse.data;
        isPending = user?.isPending || false;
        
        // Only get invitation URL if user is pending
        if (isPending && user?.inviteAcceptUrl) {
          let rawUrl = user.inviteAcceptUrl.startsWith('http') 
            ? user.inviteAcceptUrl 
            : `${N8N}${user.inviteAcceptUrl}`;
          
          // FIX: n8n often stores localhost:5678 instead of actual server URL
          // Replace localhost URLs with actual N8N_BASE_URL
          if (rawUrl.includes('localhost:5678') || rawUrl.includes('localhost')) {
            rawUrl = rawUrl.replace(/http:\/\/localhost:5678/g, N8N);
            rawUrl = rawUrl.replace(/http:\/\/localhost/g, N8N);
            logInfo('Fixed localhost URL in invitation', { originalUrl: user.inviteAcceptUrl, fixedUrl: rawUrl });
          }
          
          // Validate and fix invitation URL - ensure it has proper token format
          try {
            const urlObj = new URL(rawUrl);
            // Check if URL has token in path or query params
            const pathParts = urlObj.pathname.split('/').filter(p => p);
            const tokenFromPath = pathParts[pathParts.length - 1];
            const tokenFromQuery = urlObj.searchParams.get('inviterId') || 
                                  urlObj.searchParams.get('token') ||
                                  urlObj.searchParams.get('inviteToken');
            
            // If no token found, try to get invitation ID from n8n API
            if (!tokenFromQuery && (!tokenFromPath || tokenFromPath === 'signup')) {
              // Try to get invitation details from n8n
              try {
                const invitationsResponse = await axios.get(
                  `${N8N}/api/v1/invitations`,
                  {
                    headers: {
                      'X-N8N-API-KEY': cleanApiKey,
                      'Content-Type': 'application/json',
                    },
                  }
                );
                
                const invitations = invitationsResponse.data?.data || invitationsResponse.data || [];
                const userInvitation = invitations.find((inv: any) => inv.email === userEmail);
                
                if (userInvitation?.id) {
                  // Construct proper invitation URL with token
                  rawUrl = `${N8N}/signup/${userInvitation.id}`;
                  logInfo('Fixed invitation URL with token from API', { 
                    userId, 
                    email: userEmail,
                    token: userInvitation.id 
                  });
                }
              } catch (inviteApiError) {
                logInfo('Could not fetch invitation token from API', { userId, email: userEmail });
              }
            }
            
            invitationUrl = rawUrl;
          } catch (urlError) {
            // If URL parsing fails, use original URL
            invitationUrl = rawUrl;
            logInfo('Could not parse invitation URL, using original', { 
              userId, 
              email: userEmail,
              url: rawUrl 
            });
          }
        }
      } catch (error) {
        logInfo('Could not get user status from n8n', { userId, email: userEmail });
      }
    }
    
    // Send email directly using nodemailer (same config as emailService)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'Hello@avallon.ca',
        pass: 'oagqtgpxwcldyibn', // App password (no spaces)
      },
    });
    
    // Always send direct login instructions - more reliable than invitation tokens
    // The invitation URL flow is unreliable, so we just provide login URL and instructions
    const loginUrl = `${N8N}/signin`;
    const signupUrl = `${N8N}/signup`;
    
    // Log the invitation URL for debugging
    logInfo('Invitation email setup', { 
      userId, 
      email: userEmail, 
      isPending, 
      invitationUrl,
      loginUrl,
      signupUrl 
    });
    
    const subject = isPending 
      ? 'Invitation to join n8n - Avallon'
      : 'Your n8n Account is Ready - Avallon';
    
    // Use a more reliable email approach - always include login URL
    // The invitation URL flow is often unreliable across n8n versions
    const primaryUrl = isPending ? signupUrl : loginUrl;
    
    const mailOptions = {
      from: 'Hello@avallon.ca',
      to: userEmail,
      subject: subject,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6366F1; margin: 0; font-size: 28px;">n8n</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Workflow Automation by Avallon</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; color: white; text-align: center; margin-bottom: 25px;">
            <h2 style="margin: 0 0 10px 0; font-size: 24px;">${isPending ? 'Welcome to n8n! 🚀' : 'Your Account is Ready! ✅'}</h2>
            <p style="margin: 0; opacity: 0.9;">${isPending ? 'Complete your registration to start automating' : 'Log in to start building workflows'}</p>
          </div>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">Hello,</p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            ${isPending 
              ? 'Your n8n account has been created. Click the button below to complete your registration and set up your password.'
              : 'Your n8n account is ready to use. Click the button below to log in and start building powerful automation workflows.'
            }
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${primaryUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
              ${isPending ? 'Complete Registration →' : 'Log In to n8n →'}
            </a>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; color: #333; font-weight: 600;">Quick Links:</p>
            <ul style="margin: 0; padding-left: 20px; color: #666;">
              <li style="margin-bottom: 8px;">Sign Up: <a href="${signupUrl}" style="color: #6366F1;">${signupUrl}</a></li>
              <li>Sign In: <a href="${loginUrl}" style="color: #6366F1;">${loginUrl}</a></li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            <strong>Your Email:</strong> ${userEmail}
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This email was sent by Avallon. If you didn't request this, you can safely ignore it.
          </p>
        </div>
      `,
      text: `
${isPending ? 'Welcome to n8n! 🚀' : 'Your n8n Account is Ready! ✅'}

Hello,

${isPending 
  ? 'Your n8n account has been created. Visit the link below to complete your registration and set up your password.'
  : 'Your n8n account is ready to use. Visit the link below to log in and start building automation workflows.'
}

${isPending ? 'Complete Registration' : 'Log In'}: ${primaryUrl}

Quick Links:
- Sign Up: ${signupUrl}
- Sign In: ${loginUrl}

Your Email: ${userEmail}

This email was sent by Avallon. If you didn't request this, you can safely ignore it.
      `,
    };
    
    await transporter.sendMail(mailOptions);
    logInfo('Account info email sent successfully from backend', { 
      userId, 
      email: userEmail, 
      isPending,
      url: invitationUrl || loginUrl 
    });
    
  } catch (error: any) {
    logError('Failed to send n8n account info email from backend', error, { userId, email: userEmail });
    throw new Error(`Failed to send account info email: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Create n8n user via admin login (fallback method)
 */
async function createN8nUserViaAdminLogin(input: CreateN8nUserInput, password: string): Promise<N8nUser> {
  if (!N8N_ADMIN_EMAIL || !N8N_ADMIN_PASSWORD) {
    throw new Error('Admin credentials not configured. Please set N8N_ADMIN_EMAIL and N8N_ADMIN_PASSWORD in your .env file.');
  }

  try {
    logInfo('Attempting n8n admin login', { email: N8N_ADMIN_EMAIL, baseUrl: N8N });
    
    // Step 1: Login as admin to get session cookie
    const loginResponse = await axios.post(
      `${N8N}/rest/login`,
      {
        emailOrLdapLoginId: N8N_ADMIN_EMAIL,
        password: N8N_ADMIN_PASSWORD,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        timeout: 10000,
      }
    );

    const sessionCookie = loginResponse.headers['set-cookie']?.[0];
    if (!sessionCookie) {
      throw new Error('Failed to get admin session cookie');
    }
    
    logInfo('Admin login successful', { email: N8N_ADMIN_EMAIL });

    // Step 2: Create user with admin session
    // n8n API v1 expects an array of users
    const createResponse = await axios.post(
      `${N8N}/api/v1/users`,
      [{
        email: input.email,
        firstName: input.firstName || input.email.split('@')[0],
        lastName: input.lastName || '',
        password: password,
        // Don't specify role - n8n will assign default
      }],
      {
        headers: {
          'Cookie': sessionCookie,
          'Content-Type': 'application/json',
        },
      }
    );

    // Response is an array with user objects wrapped in {user: {...}, error: ""}
    const users = Array.isArray(createResponse.data) ? createResponse.data : [createResponse.data];
    const userResponse = users[0];
    const user = userResponse.user || userResponse;
    
    if (userResponse.error) {
      throw new Error(`n8n API error: ${userResponse.error}`);
    }
    
    logInfo('n8n user created via admin login', { userId: user.id, email: user.email, isPending: user.isPending });
    
    // If user is pending, try to activate them
    if (user.isPending) {
      try {
        logInfo('User is pending, attempting to activate via admin session', { userId: user.id, email: user.email });
        // Try to update user to activate them
        await axios.patch(
          `${N8N}/api/v1/users/${user.id}`,
          { isPending: false },
          {
            headers: {
              'Cookie': sessionCookie,
              'Content-Type': 'application/json',
            },
          }
        );
        logInfo('User activated successfully via admin session', { userId: user.id, email: user.email });
      } catch (activateError: any) {
        logError('Failed to activate user via admin session (non-critical)', activateError, { 
          userId: user.id, 
          email: user.email 
        });
        // Don't throw - user was created, just activation failed
      }
    }
    
    const createdUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName || input.firstName || input.email.split('@')[0],
      lastName: user.lastName || input.lastName || '',
      globalRole: user.role || user.globalRole || 'global:member',
      apiKey: user.apiKey,
      password: password, // Return password for storage
    };
    
    // Send invitation email if enabled
    if (process.env.N8N_SEND_INVITATIONS === 'true') {
      try {
        await sendN8nInvitation(createdUser.id, createdUser.email);
        logInfo('Invitation email sent successfully via admin login', { userId: createdUser.id, email: createdUser.email });
      } catch (inviteError: any) {
        // Don't fail user creation if invitation fails
        logError('Failed to send invitation email (non-critical)', inviteError, { 
          userId: createdUser.id, 
          email: createdUser.email 
        });
      }
    }
    
    return createdUser;
  } catch (error: any) {
    logError('Failed to create n8n user via admin login', error, { 
      adminEmail: N8N_ADMIN_EMAIL,
      status: error.response?.status,
      message: error.response?.data?.message
    });
    
    // Provide specific error messages
    if (error.response?.status === 401) {
      throw new Error(`n8n admin login failed: Wrong email or password. Please verify N8N_ADMIN_EMAIL (${N8N_ADMIN_EMAIL}) and N8N_ADMIN_PASSWORD in your .env file match your n8n admin account.`);
    }
    
    throw error;
  }
}

/**
 * Login to n8n and get a session cookie for automatic login
 * Returns the session cookie that can be used to authenticate requests
 */
export async function loginN8nUser(email: string, password: string): Promise<{ sessionCookie: string; cookieName: string }> {
  if (!N8N) {
    throw new Error('N8N_BASE_URL is not configured');
  }

  try {
    logInfo('Logging in n8n user', { email, baseUrl: N8N });
    
    const loginResponse = await axios.post(
      `${N8N}/rest/login`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        maxRedirects: 0,
        validateStatus: (status) => status < 400, // Accept redirects
      }
    );

    // Extract session cookie from response
    const setCookieHeaders = loginResponse.headers['set-cookie'];
    if (!setCookieHeaders || setCookieHeaders.length === 0) {
      throw new Error('No session cookie received from n8n');
    }

    // Find the session cookie (usually named 'n8n-auth' or similar)
    const sessionCookie = setCookieHeaders.find((cookie: string) => 
      cookie.includes('n8n-auth') || cookie.includes('session')
    ) || setCookieHeaders[0];

    // Extract cookie name and value
    const cookieMatch = sessionCookie.match(/^([^=]+)=([^;]+)/);
    if (!cookieMatch) {
      throw new Error('Invalid session cookie format');
    }

    const cookieName = cookieMatch[1];
    const cookieValue = cookieMatch[2];

    logInfo('n8n user logged in successfully', { email, cookieName });
    
    return {
      sessionCookie: `${cookieName}=${cookieValue}`,
      cookieName: cookieName,
    };
  } catch (error: any) {
    logError('Failed to login n8n user', error, { email });
    const message = error.response?.data?.message || error.message || 'Unknown error';
    throw new Error(`Failed to login to n8n: ${message}`);
  }
}

/**
 * Generate a secure random password for n8n users
 */
function generateSecurePassword(): string {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

/**
 * Get n8n user API key (if user already exists)
 */
export async function getN8nUserApiKey(userEmail: string): Promise<string | null> {
  if (!N8N || !N8N_KEY) {
    return null;
  }

  try {
    // List all users and find the one matching the email
    const response = await axios.get(
      `${N8N}/api/v1/users`,
      {
        headers: {
          'X-N8N-API-KEY': N8N_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const users = response.data?.data || response.data || [];
    const user = users.find((u: any) => u.email === userEmail);
    
    if (user?.apiKey) {
      return user.apiKey;
    }

    return null;
  } catch (error: any) {
    logError('Failed to get n8n user API key', error, { email: userEmail });
    return null;
  }
}


