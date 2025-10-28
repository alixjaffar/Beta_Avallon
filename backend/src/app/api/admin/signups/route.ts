import { NextResponse } from "next/server";
import { signupStorage } from "@/lib/signupStorage";

export async function GET() {
  try {
    // Get signups from the same source as the beta signups API
    const signups = await signupStorage.getAllSignups();

    return NextResponse.json({ 
      signups: signups.reverse() // Show newest first
    });
  } catch (error) {
    console.error('Error reading signup data:', error);
    return NextResponse.json({ error: 'Failed to read signup data' }, { status: 500 });
  }
}
