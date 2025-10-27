import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/emailService";
import { signupStorage } from "@/lib/signupStorage";
import { z } from "zod";

const BulkEmailSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = BulkEmailSchema.parse(body);

    // Get all email subscribers from file storage
    const subscribers = await signupStorage.getEmailSubscribers();
    
    if (subscribers.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No email subscribers found",
        sent: 0,
        failed: 0,
      });
    }

    // Send bulk email to all subscribers
    const result = await emailService.sendBulkUpdateEmail(
      subscribers,
      validatedData.subject,
      validatedData.content
    );

    return NextResponse.json({
      success: true,
      message: `Bulk email sent to ${result.sent} subscribers`,
      sent: result.sent,
      failed: result.failed,
      totalSubscribers: subscribers.length,
    });

  } catch (error) {
    console.error("Bulk email error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send bulk email" },
      { status: 500 }
    );
  }
}
