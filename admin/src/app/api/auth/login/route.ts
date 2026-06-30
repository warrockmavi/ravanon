import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/store/admins-repo";
import { addAuditLog } from "@/lib/store/audit-repo";
import { resolvePermissions, SESSION_COOKIE, signSession } from "@/lib/auth/session";
import { getSettings } from "@/lib/store/settings-repo";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "E-posta ve şifre gerekli" }, { status: 400 });
  }

  const admin = await authenticateAdmin(email, password);
  if (!admin) {
    return NextResponse.json({ error: "Geçersiz kimlik bilgileri" }, { status: 401 });
  }

  const settings = await getSettings();
  const permissions = resolvePermissions(admin.roles, admin.permissions);
  const token = signSession(
    { sub: admin.id, email: admin.email, name: admin.name, roles: admin.roles, permissions },
    settings.sessionHours || 8
  );

  await addAuditLog({
    userId: admin.id,
    actorId: admin.id,
    actorName: admin.name,
    action: "admin.login",
    details: `${admin.email} admin paneline giriş yaptı`,
  });

  const res = NextResponse.json({
    admin: { id: admin.id, email: admin.email, name: admin.name, roles: admin.roles, permissions },
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: (settings.sessionHours || 8) * 3600,
  });
  return res;
}