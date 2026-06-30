import { NextRequest, NextResponse } from "next/server";
import { bulkBanUsers, getUsers, inviteStoreUser, registerStoreUser } from "@/lib/store/users-repo";
import { requirePermission } from "@/lib/auth/api-guard";
import { verifyImpersonateToken } from "@/lib/auth/session";
import { getStoreUserRecord } from "@/lib/store/users-repo";
import { addAuditLog, addActivity } from "@/lib/store/audit-repo";

export async function GET() {
  const users = await getUsers();
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.action === "register") {
    const result = await registerStoreUser(body);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ user: result.user }, { status: 201 });
  }
  if (body.action === "login") {
    const { loginStoreUser } = await import("@/lib/store/users-repo");
    const result = await loginStoreUser(body.identifier, body.password);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 401 });
    const { password, ...safe } = result.user!;
    return NextResponse.json({ user: safe });
  }
  if (body.action === "sync") {
    const { upsertStoreUser } = await import("@/lib/store/users-repo");
    const user = await upsertStoreUser(body);
    return NextResponse.json({ user });
  }
  if (body.action === "accept-invite") {
    const { acceptInviteStoreUser } = await import("@/lib/store/users-repo");
    const result = await acceptInviteStoreUser(body);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ user: result.user });
  }
  if (body.action === "impersonate-login") {
    const { userId, email, token } = body;
    if (!userId || !email || !token || !verifyImpersonateToken(token, userId, email)) {
      return NextResponse.json({ error: "Geçersiz impersonation oturumu" }, { status: 401 });
    }
    const record = await getStoreUserRecord(String(userId));
    if (!record || record.status === "banned") {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }
    const { password: _pw, inviteToken: _it, ...safe } = record;
    return NextResponse.json({ user: safe });
  }
  if (body.action === "invite") {
    const guard = requirePermission(req, "users.edit");
    if (guard.error) return guard.error;
    const session = guard.session!;
    const result = await inviteStoreUser(body);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
    const inviteLink = `http://localhost:8765/account.html?invite=${result.inviteToken}`;
    await addAuditLog({
      userId: result.user!.id,
      actorId: session.sub,
      actorName: session.name,
      action: "users.invite",
      details: `${body.email} davet edildi`,
    });
    return NextResponse.json({ user: result.user, inviteLink }, { status: 201 });
  }
  if (body.action === "bulk-ban" && Array.isArray(body.ids)) {
    const guard = requirePermission(req, "users.ban");
    if (guard.error) return guard.error;
    const session = guard.session!;
    const users = await bulkBanUsers(body.ids.map(String));
    await addAuditLog({
      userId: session.sub,
      actorId: session.sub,
      actorName: session.name,
      action: "users.bulk_ban",
      details: `${body.ids.length} kullanıcı banlandı`,
    });
    return NextResponse.json({ users });
  }
  return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
}