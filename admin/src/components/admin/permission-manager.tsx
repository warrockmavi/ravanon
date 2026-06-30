"use client";

import { Switch } from "@/components/ui/switch";
import { getPermissionsByGroup } from "@/lib/permissions";
import { getDefaultPermissionsForRole } from "@/lib/permissions";
import { ADMIN_ROLES } from "@/lib/roles";
import type { AdminRole } from "@/types/admin";
import { cn } from "@/lib/utils";

interface PermissionManagerProps {
  roles: AdminRole[];
  permissions: string[];
  onRolesChange: (roles: AdminRole[]) => void;
  onPermissionsChange: (permissions: string[]) => void;
  readOnly?: boolean;
}

export function PermissionManager({
  roles,
  permissions,
  onRolesChange,
  onPermissionsChange,
  readOnly = false,
}: PermissionManagerProps) {
  const groups = getPermissionsByGroup();

  const toggleRole = (role: AdminRole) => {
    if (readOnly) return;
    const has = roles.includes(role);
    const next = has ? roles.filter((r) => r !== role) : [...roles, role];
    onRolesChange(next);
    if (!has) {
      const rolePerms = getDefaultPermissionsForRole(role);
      const merged = [...new Set([...permissions, ...rolePerms])];
      onPermissionsChange(merged);
    }
  };

  const togglePermission = (permId: string) => {
    if (readOnly) return;
    const has = permissions.includes(permId);
    onPermissionsChange(has ? permissions.filter((p) => p !== permId) : [...permissions, permId]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-cream mb-3">Roller</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ADMIN_ROLES.map((role) => {
            const active = roles.includes(role.id);
            return (
              <button
                key={role.id}
                type="button"
                disabled={readOnly}
                onClick={() => toggleRole(role.id)}
                className={cn(
                  "rounded-lg border p-3 text-left transition-all",
                  active
                    ? "border-gold/40 bg-gold/10"
                    : "border-border bg-surface hover:border-gold/20",
                  readOnly && "opacity-60 cursor-not-allowed"
                )}
              >
                <p className="text-sm font-medium text-cream">{role.label}</p>
                <p className="text-xs text-cream/40 mt-0.5">{role.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-cream mb-1">Granular İzinler</h4>
        <p className="text-xs text-cream/40 mb-4">
          Rol seçimi varsayılan izinleri ekler; tek tek açıp kapatabilirsiniz.
        </p>
        {groups.map(({ group, permissions: perms }) => (
          <div key={group} className="mb-5">
            <p className="text-xs uppercase tracking-wider text-gold mb-2">{group}</p>
            <div className="space-y-2 rounded-lg border border-border bg-surface p-3">
              {perms.map((perm) => (
                <div key={perm.id} className="flex items-center justify-between gap-3 py-1">
                  <div>
                    <p className="text-sm text-cream">{perm.label}</p>
                    <p className="text-[10px] text-cream/30 font-mono">{perm.id}</p>
                  </div>
                  <Switch
                    checked={permissions.includes(perm.id)}
                    onCheckedChange={() => togglePermission(perm.id)}
                    disabled={readOnly}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}