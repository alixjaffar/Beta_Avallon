import { cookies } from "next/headers";

const COOKIE_NAME = "avallon_session";

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const c = cookieStore.get(COOKIE_NAME)?.value;
    if (!c) return null;
    const obj = JSON.parse(c);
    return obj && typeof obj === 'object' ? obj : null;
  } catch {
    return null;
  }
}

export async function setSession(value: any, maxAgeSeconds = 60 * 60 * 24 * 7) {
  const cookieStore = await cookies();
  cookieStore.set({ name: COOKIE_NAME, value: JSON.stringify(value), httpOnly: false, sameSite: 'lax', path: '/', maxAge: maxAgeSeconds });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set({ name: COOKIE_NAME, value: '', maxAge: 0, path: '/' });
}



