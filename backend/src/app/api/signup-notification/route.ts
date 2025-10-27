import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/emailService";
import { signupStorage } from "@/lib/signupStorage";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  birthday: z.string().min(1, "Birthday is required"),
  emailSubscription: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = SignupSchema.parse(body);

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
    });

  } catch (error) {
    console.error("Signup notification error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('already registered')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process signup notification" },
      { status: 500 }
    );
  }
}
