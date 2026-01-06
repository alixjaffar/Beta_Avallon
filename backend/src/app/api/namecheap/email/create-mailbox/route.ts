import { NextRequest, NextResponse } from "next/server";
import { isMockMode, namecheapRequest } from "@/lib/namecheap";

export async function POST(req: NextRequest) {
  try {
    const { domain, mailbox, password } = await req.json();
    if (!domain || !mailbox) {
      return NextResponse.json({ error: "domain and mailbox are required" }, { status: 400 });
    }

    if (isMockMode()) {
      return NextResponse.json({ success: true, mock: true, mailbox: `${mailbox}@${domain}` });
    }

    // Private Email API commands vary; for MVP we call a placeholder and return XML.
    const result = await namecheapRequest("namecheap.privateemail.mailbox.create", {
      DomainName: domain,
      Mailbox: mailbox,
      Password: password || "TempPassword123!",
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
    return NextResponse.json({ success: true, xml: result.xml });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create mailbox" }, { status: 500 });
  }
}


