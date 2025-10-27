import axios from "axios";

const MAIL = process.env.EMAIL_BASE_URL!;
const MAIL_KEY = process.env.EMAIL_API_KEY!;

export async function emailCreateInbox(domain: string, inbox: string) {
  const res = await axios.post(`${MAIL}/v1/inboxes`, { domain, inbox }, { headers: { Authorization: `Bearer ${MAIL_KEY}` } })
    .catch((e)=>({ data: { error: e.message } } as any));
  return res.data;
}
