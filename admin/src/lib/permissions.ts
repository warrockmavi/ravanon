import type { Permission } from "@/types/admin";

export const PERMISSIONS: Permission[] = [
  { id: "users.view", label: "Kullanıcıları görüntüle", group: "Kullanıcılar" },
  { id: "users.create", label: "Kullanıcı oluştur / davet et", group: "Kullanıcılar" },
  { id: "users.edit", label: "Kullanıcı düzenle", group: "Kullanıcılar" },
  { id: "users.ban", label: "Kullanıcı banla / ban kaldır", group: "Kullanıcılar" },
  { id: "users.impersonate", label: "Kullanıcı olarak giriş (impersonation)", group: "Kullanıcılar" },
  { id: "users.export", label: "Kullanıcı dışa aktar", group: "Kullanıcılar" },
  { id: "roles.manage", label: "Rol ve izin yönetimi", group: "Kullanıcılar" },

  { id: "orders.view", label: "Siparişleri görüntüle", group: "Siparişler" },
  { id: "orders.edit", label: "Sipariş durumu güncelle", group: "Siparişler" },
  { id: "orders.refund", label: "İade işlemi başlat", group: "Siparişler" },
  { id: "orders.export", label: "Sipariş dışa aktar", group: "Siparişler" },

  { id: "products.view", label: "Ürünleri görüntüle", group: "Ürünler" },
  { id: "products.create", label: "Ürün oluştur", group: "Ürünler" },
  { id: "products.edit", label: "Ürün düzenle", group: "Ürünler" },
  { id: "products.delete", label: "Ürün sil", group: "Ürünler" },
  { id: "products.stock", label: "Stok yönetimi", group: "Ürünler" },

  { id: "campaigns.view", label: "Kampanyaları görüntüle", group: "Kampanyalar" },
  { id: "campaigns.create", label: "Kampanya oluştur", group: "Kampanyalar" },
  { id: "campaigns.edit", label: "Kampanya düzenle", group: "Kampanyalar" },

  { id: "club.view", label: "Club verilerini görüntüle", group: "RAVANON Club" },
  { id: "club.edit", label: "Club kurallarını düzenle", group: "RAVANON Club" },
  { id: "club.points", label: "Puan ayarla / düzenle", group: "RAVANON Club" },

  { id: "reports.view", label: "Raporları görüntüle", group: "Raporlar" },
  { id: "reports.export", label: "Rapor dışa aktar", group: "Raporlar" },

  { id: "settings.view", label: "Ayarları görüntüle", group: "Ayarlar" },
  { id: "settings.edit", label: "Ayarları düzenle", group: "Ayarlar" },
  { id: "audit.view", label: "Audit log görüntüle", group: "Güvenlik" },
];

export const PERMISSION_GROUPS = [...new Set(PERMISSIONS.map((p) => p.group))];

export function getPermissionsByGroup() {
  return PERMISSION_GROUPS.map((group) => ({
    group,
    permissions: PERMISSIONS.filter((p) => p.group === group),
  }));
}

export function getDefaultPermissionsForRole(role: string): string[] {
  const all = PERMISSIONS.map((p) => p.id);
  switch (role) {
    case "super_admin":
      return all;
    case "platform_admin":
      return all.filter((id) => !id.includes("settings.edit") && id !== "users.impersonate");
    case "support_agent":
      return ["users.view", "users.edit", "users.impersonate", "orders.view", "orders.edit", "club.view", "audit.view"];
    case "content_manager":
      return ["products.view", "products.create", "products.edit", "products.stock", "campaigns.view", "campaigns.create", "campaigns.edit"];
    case "finance":
      return ["orders.view", "orders.refund", "orders.export", "reports.view", "reports.export", "club.view"];
    default:
      return ["users.view"];
  }
}