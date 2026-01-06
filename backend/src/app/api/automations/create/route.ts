import { NextRequest, NextResponse } from "next/server";

function dslToN8n(dsl: any) {
  // Minimal transformation: map few node types to n8n equivalents
  const nodes = (dsl?.nodes || []).map((n: any, idx: number) => {
    const base: any = { id: idx + 1, name: n.id || `${n.type}_${idx}`, typeVersion: 1 };
    switch (n.type) {
      case 'webhook':
        return { ...base, type: 'n8n-nodes-base.webhook', parameters: { path: n.params?.path || 'hook', httpMethod: (n.params?.method || 'POST').toUpperCase() } };
      case 'httpRequest':
        return { ...base, type: 'n8n-nodes-base.httpRequest', parameters: { url: n.params?.url, method: (n.params?.method || 'GET').toUpperCase() } };
      case 'if':
        return { ...base, type: 'n8n-nodes-base.if', parameters: { conditions: { string: [{ value1: n.params?.condition || '' }] } } };
      case 'emailSend':
        return { ...base, type: 'n8n-nodes-base.emailSend', parameters: { toEmail: n.params?.to, subject: n.params?.subject, text: n.params?.text } };
      case 'set':
        return { ...base, type: 'n8n-nodes-base.set', parameters: { } };
      default:
        return { ...base, type: 'n8n-nodes-base.noOp' };
    }
  });

  const connections: any = {};
  (dsl?.connections || []).forEach((pair: any) => {
    const [fromId, toId] = pair;
    const fromIdx = nodes.findIndex((n: any) => n.name === fromId || n.id === fromId);
    const toIdx = nodes.findIndex((n: any) => n.name === toId || n.id === toId);
    if (fromIdx >= 0 && toIdx >= 0) {
      const key = `${nodes[fromIdx].name || nodes[fromIdx].id}`;
      connections[key] = connections[key] || { main: [[]] };
      connections[key].main[0].push({ node: nodes[toIdx].name || nodes[toIdx].id, type: 'main', index: 0 });
    }
  });

  return {
    name: dsl?.meta?.prompt?.slice(0, 50) || 'Avallon Workflow',
    nodes,
    connections,
    active: false,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { dsl } = await req.json();
    if (!dsl) return NextResponse.json({ error: "dsl is required" }, { status: 400 });

    const workflow = dslToN8n(dsl);

    const baseUrl = process.env.N8N_BASE_URL;
    const apiKey = process.env.N8N_API_KEY;

    if (!baseUrl || !apiKey) {
      return NextResponse.json({ success: true, id: `stub-${Date.now()}`, url: 'https://n8n.example.com/workflows/stub', workflow, mock: true });
    }

    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/rest/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-N8N-API-KEY': apiKey },
      body: JSON.stringify(workflow),
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `n8n error ${res.status}`, details: text }, { status: 502 });
    }
    const data = await res.json();
    const id = data?.id || data?.data?.id || `wf-${Date.now()}`;
    const url = `${baseUrl.replace(/\/$/, '')}/workflow/${id}`;
    return NextResponse.json({ success: true, id, url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create workflow" }, { status: 500 });
  }
}


