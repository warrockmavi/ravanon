import type { AdminOrder, AdminUser } from "@/types/admin";

export async function fetchUsers(): Promise<AdminUser[]> {
  const res = await fetch("/api/users", { cache: "no-store" });
  if (!res.ok) throw new Error("Kullanıcılar yüklenemedi");
  return (await res.json()).users;
}

export async function fetchUserDetail(id: string): Promise<{
  user: AdminUser;
  orders: AdminOrder[];
  pointHistory?: { id: number; type: string; amount: number; description: string; createdAt: number }[];
  tierHistory?: import("@/types/admin").ClubTierHistory[];
  activities?: import("@/types/admin").ActivityEvent[];
  auditLogs?: import("@/types/admin").AuditLogEntry[];
}> {
  const res = await fetch(`/api/users/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Kullanıcı yüklenemedi");
  return res.json();
}

export async function updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
  const res = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Kullanıcı güncellenemedi");
  return (await res.json()).user;
}

export async function inviteUser(data: { email: string; name: string; roles: string[] }): Promise<{ success: boolean; user?: AdminUser; inviteLink?: string }> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "invite", ...data }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Davet gönderilemedi");
  }
  const json = await res.json();
  return { success: true, user: json.user, inviteLink: json.inviteLink };
}

export async function bulkBanUsers(ids: string[]): Promise<AdminUser[]> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "bulk-ban", ids }),
  });
  if (!res.ok) throw new Error("Toplu ban uygulanamadı");
  return (await res.json()).users;
}

export async function impersonateUser(userId: string): Promise<{ url: string }> {
  const res = await fetch(`/api/users/${userId}/impersonate`, { method: "POST" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Impersonation başlatılamadı");
  }
  return res.json();
}

export async function exportUsersCsv(userIds?: string[]): Promise<string> {
  const users = await fetchUsers();
  const filtered = userIds ? users.filter((u) => userIds.includes(u.id)) : users;
  const header = "id,name,email,phone,status,clubTier,clubPoints,totalOrders,lifetimeSpend\n";
  const rows = filtered
    .map((u) => `${u.id},${u.name},${u.email},${u.phone ?? ""},${u.status},${u.clubTier},${u.clubPoints},${u.totalOrders},${u.lifetimeSpend}`)
    .join("\n");
  return header + rows;
}