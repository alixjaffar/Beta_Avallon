import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    // Very small, safe DSL generator (static) for preview
    const dsl = {
      version: 1,
      nodes: [
        { id: "trigger", type: "webhook", params: { path: "form-submitted", method: "POST" } },
        { id: "http", type: "httpRequest", params: { url: "https://api.example.com", method: "GET" } },
        { id: "if", type: "if", params: { condition: "{{ $json.status }} === 'ok'" } },
        { id: "email", type: "emailSend", params: { to: "{{ $json.email }}", subject: "Update", text: "Hello from Avallon" } },
      ],
      connections: [
        ["trigger", "http"],
        ["http", "if"],
        ["if", "email"],
      ],
      meta: { prompt }
    };

    return NextResponse.json({ dsl });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to plan automation" }, { status: 500 });
  }
}


