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
  const isProduction = process.env.NODE_ENV === 'production';
  
  cookieStore.set({ 
    name: COOKIE_NAME, 
    value: JSON.stringify(value), 
    // SECURITY: httpOnly prevents XSS attacks from stealing session cookies
    httpOnly: true,
    // SECURITY: secure ensures cookies are only sent over HTTPS in production
    secure: isProduction,
    // SECURITY: sameSite='strict' provides stronger CSRF protection
    sameSite: 'strict',
    path: '/', 
    maxAge: maxAgeSeconds 
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set({ name: COOKIE_NAME, value: '', maxAge: 0, path: '/' });
}



