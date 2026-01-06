import { NextRequest, NextResponse } from "next/server";
import { isMockMode, namecheapRequest } from "@/lib/namecheap";

// MX/SPF/DKIM presets for Namecheap Private Email
const PRESETS = {
  mx: [
    { host: "@", value: "mx1.privateemail.com.", priority: 10 },
    { host: "@", value: "mx2.privateemail.com.", priority: 10 },
  ],
  spf: { host: "@", value: "v=spf1 include:spf.privateemail.com ~all" },
  dkim: { host: "default._domainkey", value: "dkim.privateemail.com." },
};

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();
    if (!domain) return NextResponse.json({ error: "domain is required" }, { status: 400 });

    if (isMockMode()) {
      return NextResponse.json({ success: true, applied: false, instructions: PRESETS, mock: true });
    }

    // Set default DNS (so Namecheap controls DNS)
    await namecheapRequest("namecheap.domains.dns.setDefault", { SLD: domain.split(".")[0], TLD: domain.split(".").slice(1).join(".") });

    // Note: Namecheap XML API doesn't provide a direct "set MX/SPF/DKIM" single call.
    // Many setups require setHosts or UI actions. For safety, return instructions for manual confirmation.
    return NextResponse.json({ success: true, applied: false, instructions: PRESETS });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to setup email DNS" }, { status: 500 });
  }
}












