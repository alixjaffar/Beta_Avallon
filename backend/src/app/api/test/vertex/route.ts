import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const hasJson = !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    const hasServiceEmail = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const hasPrivateKey = !!process.env.GOOGLE_PRIVATE_KEY;

    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();

    return NextResponse.json({
      ok: true,
      projectId,
      env: {
        hasJson,
        hasServiceEmail,
        hasPrivateKey,
      },
      tokenPreview: tokenResponse.token
        ? tokenResponse.token.substring(0, 20) + "..."
        : null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Vertex auth test failed",
      },
      { status: 500 }
    );
  }
}

