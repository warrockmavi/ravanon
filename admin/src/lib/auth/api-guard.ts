import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, hasPermission } from "./session";
import { SESSION_COOKIE } from "./session-edge";
import type { AdminSession } from "./session-edge";

export { isPublicApiRoute, isStoreOrigin } from "./api-routes";

export function getSessionFromRequest(req: NextRequest) {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
}

export function requirePermission(req: NextRequest, permission: string) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return { error: NextResponse.json({ error: "Oturum gerekli" }, { status: 401 }), session: null };
  }
  if (!hasPermission(session, permission)) {
    return { error: NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 }), session: null };
  }
  return { error: null, session };
}

export function requireAdmin(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return { error: NextResponse.json({ error: "Oturum gerekli" }, { status: 401 }), session: null };
  }
  return { error: null, session };
}