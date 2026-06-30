import type { AdminRole } from "@/types/admin";

export function clientHasPermission(
  admin: { roles: AdminRole[]; permissions: string[] } | null,
  permission: string
): boolean {
  if (!admin) return false;
  if (admin.roles.includes("super_admin")) return true;
  return admin.permissions.includes(permission);
}