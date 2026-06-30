import crypto from "crypto";
import type { AdminRole } from "@/types/admin";
import { getDefaultPermissionsForRole } from "@/lib/permissions";
import type { AdminSession } from "./session-edge";

const SECRET = process.env.ADMIN_SESSION_SECRET || "ravanon-admin-session-secret-2026";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + SECRET).digest("hex");
}

export function signSession(payload: Omit<AdminSession, "exp">, hours = 8): string {
  const session: AdminSession = {
    ...payload,
    exp: Date.now() + hours * 3600000,
  };
  const data = Buffer.from(JSON.stringify(session)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): AdminSession | null {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  if (sig !== expected) return null;
  try {
    const session = JSON.parse(Buffer.from(data, "base64url").toString()) as AdminSession;
    if (session.exp && Date.now() > session.exp) return null;
    return session;
  } catch {
    return null;
  }
}

export function resolvePermissions(roles: AdminRole[], explicit: string[] = []): string[] {
  if (explicit.length) return explicit;
  const set = new Set<string>();
  for (const role of roles) {
    getDefaultPermissionsForRole(role).forEach((p) => set.add(p));
  }
  return [...set];
}

export function hasPermission(session: AdminSession | null, permission: string): boolean {
  if (!session) return false;
  if (session.roles.includes("super_admin")) return true;
  return session.permissions.includes(permission);
}

export function signImpersonateToken(userId: string, email: string, minutes = 15): string {
  const payload = { userId, email, exp: Date.now() + minutes * 60000 };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyImpersonateToken(token: string, userId: string, email: string): boolean {
  const [data, sig] = token.split(".");
  if (!data || !sig) return false;
  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  if (sig !== expected) return false;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as {
      userId: string;
      email: string;
      exp: number;
    };
    if (Date.now() > payload.exp) return false;
    return payload.userId === userId && payload.email.toLowerCase() === email.toLowerCase();
  } catch {
    return false;
  }
}

export { SESSION_COOKIE } from "./session-edge";
export type { AdminSession } from "./session-edge";