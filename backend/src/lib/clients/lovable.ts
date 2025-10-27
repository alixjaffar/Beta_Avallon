import axios from "axios";

const base = process.env.LOVABLE_BASE_URL!;
const key = process.env.LOVABLE_API_KEY!;

export async function lovableGenerateSite(input: { name: string; mode: "lovable"|"template" }) {
  // Placeholder — replace with real Lovable endpoint once you have docs/keys
  const res = await axios.post(
    `${base}/v1/sites/generate`,
    { name: input.name, mode: input.mode },
    { headers: { Authorization: `Bearer ${key}` } }
  ).catch((e)=>({ data: { error: e.message } } as any));
  return res.data;
}
