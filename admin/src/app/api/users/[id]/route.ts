import { NextRequest, NextResponse } from "next/server";
import { getUserById, getUserOrders, updateUserAdmin } from "@/lib/store/users-repo";
import { getActivities, getAuditLogs } from "@/lib/store/audit-repo";
import fs from "fs/promises";
import { USERS_JSON } from "@/lib/store/paths";
import { requirePermission } from "@/lib/auth/api-guard";
import { addAuditLog } from "@/lib/store/audit-repo";
import type { AdminUser } from "@/types/admin";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserById(id);
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
  const orders = await getUserOrders(id, user.email);
  let pointHistory: unknown[] = [];
  let tierHistory: unknown[] = [];
  try {
    const file = JSON.parse(await fs.readFile(USERS_JSON, "utf8"));
    const raw = file.users?.find((u: { id: string }) => u.id === id);
    pointHistory = raw?.pointHistory ?? [];
    tierHistory = raw?.tierHistory ?? [];
  } catch { /* optional */ }
  const [activities, auditLogs] = await Promise.all([
    getActivities(id, 20),
    getAuditLogs(20, id),
  ]);

  const orderActivities = orders.slice(0, 5).map((o) => ({
    id: `ord-act-${o.id}`,
    userId: id,
    type: "order" as const,
    title: `Sipariş ${o.id}`,
    description: `${o.total.toLocaleString("tr-TR")} TL · ${o.items.length} ürün`,
    createdAt: o.createdAt,
  }));

  return NextResponse.json({
    user,
    orders,
    pointHistory,
    tierHistory,
    activities: [...orderActivities, ...activities].slice(0, 15),
    auditLogs,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json()) as Partial<AdminUser>;
  const perm =
    body.status === "banned" ? requirePermission(req, "users.ban") : requirePermission(req, "users.edit");
  if (perm.error) return perm.error;
  const session = perm.session;
  const updated = await updateUserAdmin(id, body);
  if (!updated) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
  if (session) {
    await addAuditLog({
      userId: id,
      actorId: session.sub,
      actorName: session.name,
      action: body.status === "banned" ? "users.ban" : "users.update",
      details: `Kullanıcı güncellendi: ${updated.name}`,
    });
  }
  return NextResponse.json({ user: updated });
}