import axios from "axios";

const REG = process.env.REGISTRAR_BASE_URL!;
const REG_KEY = process.env.REGISTRAR_API_KEY!;

export async function registrarBuyDomain(domain: string) {
  const res = await axios.post(`${REG}/v1/domains/purchase`, { domain }, { headers: { Authorization: `Bearer ${REG_KEY}` } })
    .catch((e)=>({ data: { error: e.message } } as any));
  return res.data;
}

export async function registrarSetRecords(domain: string, records: Array<{ type: string; name: string; value: string; ttl?: number }>) {
  const res = await axios.post(`${REG}/v1/dns/records`, { domain, records }, { headers: { Authorization: `Bearer ${REG_KEY}` } })
    .catch((e)=>({ data: { error: e.message } } as any));
  return res.data;
}
