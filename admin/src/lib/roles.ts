import type { AdminRole } from "@/types/admin";

export const ADMIN_ROLES: { id: AdminRole; label: string; description: string; color: string }[] = [
  { id: "super_admin", label: "Super Admin", description: "Tam sistem erişimi", color: "bg-rose-gold/20 text-rose-gold border-rose-gold/30" },
  { id: "platform_admin", label: "Platform Admin", description: "Genel platform yönetimi", color: "bg-gold/20 text-gold border-gold/30" },
  { id: "support_agent", label: "Support Agent", description: "Müşteri destek ve impersonation", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { id: "content_manager", label: "Content Manager", description: "Ürün ve kampanya yönetimi", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "finance", label: "Finance", description: "Finans, iade ve raporlar", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
];

export function getRoleLabel(role: AdminRole) {
  return ADMIN_ROLES.find((r) => r.id === role)?.label ?? role;
}

export function getRoleColor(role: AdminRole) {
  return ADMIN_ROLES.find((r) => r.id === role)?.color ?? "bg-white/10 text-white/70";
}