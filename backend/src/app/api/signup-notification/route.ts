import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/emailService";
import { signupStorage } from "@/lib/signupStorage";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { getCorsHeaders } from "@/lib/cors";

const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  birthday: z.string().optional(),
  emailSubscription: z.boolean().default(false),
  firebaseUid: z.string().optional(),
});

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req),
});
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const body = await req.json();
    const validatedData = SignupSchema.parse(body);

    // Check for duplicate accounts in database FIRST
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please log in instead." },
          { status: 409, headers: corsHeaders }
        );
      }
    } catch (dbError) {
      // If database check fails, still check signups.json as fallback
      console.warn("Database check failed, falling back to signups.json check:", dbError);
    }

    // Check for duplicate in signups.json
    try {
      const existingSignups = await signupStorage.getAllSignups();
      const existingSignup = existingSignups.find(s => s.email === validatedData.email);
      
      if (existingSignup) {
        return NextResponse.json(
          { error: "This email is already registered. Please log in instead." },
          { status: 409, headers: corsHeaders }
        );
      }
    } catch (signupError) {
      console.warn("Signups.json check failed:", signupError);
    }

    // Store signup in file-based storage
    const signup = await signupStorage.createSignup({
      name: validatedData.name,
      email: validatedData.email,
      birthday: validatedData.birthday,
      emailSubscription: validatedData.emailSubscription,
    });

    // Send notification to your business email
    const notificationData = {
      name: validatedData.name,
      email: validatedData.email,
      birthday: validatedData.birthday,
      emailSubscription: validatedData.emailSubscription,
      signupDate: new Date().toLocaleString(),
    };

    const notificationSent = await emailService.sendSignupNotification(notificationData);

    // If user subscribed to email notifications, send them a welcome email
    if (validatedData.emailSubscription) {
      await emailService.sendWelcomeEmail(validatedData.email, validatedData.name);
    }

    return NextResponse.json({
      success: true,
      message: "Signup processed successfully",
      signupId: signup.id,
      notificationSent,
    }, { headers: corsHeaders });

  } catch (error) {
    console.error("Signup notification error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400, headers: corsHeaders }
      );
    }

    if (error instanceof Error && error.message.includes('already registered')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: "Failed to process signup notification" },
      { status: 500, headers: corsHeaders }
    );
  }
}
