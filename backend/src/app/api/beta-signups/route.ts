import { NextRequest, NextResponse } from "next/server";
import { signupStorage } from "@/lib/signupStorage";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type');

    switch (type) {
      case 'stats':
        const stats = await signupStorage.getStats();
        return NextResponse.json({ stats });

      case 'all':
        const allSignups = await signupStorage.getAllSignups();
        return NextResponse.json({ signups: allSignups });

      case 'subscribers':
        const subscribers = await signupStorage.getEmailSubscribers();
        return NextResponse.json({ subscribers });

      default:
        const defaultStats = await signupStorage.getStats();
        return NextResponse.json({ stats: defaultStats });
    }
  } catch (error) {
    console.error("Error fetching signup data:", error);
    return NextResponse.json(
      { error: "Failed to fetch signup data" },
      { status: 500 }
    );
  }
}
