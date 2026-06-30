import type { AdminRole } from "@/types/admin";

const SECRET = process.env.ADMIN_SESSION_SECRET || "ravanon-admin-session-secret-2026";

export interface AdminSession {
  sub: string;
  email: string;
  name: string;
  roles: AdminRole[];
  permissions: string[];
  exp: number;
}

export const SESSION_COOKIE = "ravanon_admin_session";

function base64UrlDecode(s: string) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const raw = atob(b64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export async function verifySessionTokenEdge(token: string | undefined | null): Promise<AdminSession | null> {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecode(sig),
    new TextEncoder().encode(data)
  );
  if (!valid) return null;

  try {
    const json = new TextDecoder().decode(base64UrlDecode(data));
    const session = JSON.parse(json) as AdminSession;
    if (session.exp && Date.now() > session.exp) return null;
    return session;
  } catch {
    return null;
  }
}