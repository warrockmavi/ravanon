"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Tag,
  Crown,
  BarChart3,
  Settings,
  Sparkles,
  Bot,
  Truck,
  CreditCard,
  Layers,
  Plus,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/admin/auth-provider";
import { getRoleLabel } from "@/lib/roles";
import { Button } from "@/components/ui/button";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  permission?: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Genel",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, permission: "reports.view" },
      { href: "/admin/reports", label: "Raporlar", icon: BarChart3, permission: "reports.view" },
    ],
  },
  {
    title: "Mağaza",
    items: [
      { href: "/admin/products", label: "Ürünler", icon: Package, permission: "products.view" },
      { href: "/admin/products/new", label: "Ürün Yükle", icon: Plus, permission: "products.create" },
      { href: "/admin/catalog", label: "Katalog", icon: Layers, permission: "products.view" },
      { href: "/admin/campaigns", label: "Kampanyalar", icon: Tag, permission: "campaigns.view" },
    ],
  },
  {
    title: "Operasyon",
    items: [
      { href: "/admin/orders", label: "Siparişler", icon: ShoppingCart, permission: "orders.view" },
      { href: "/admin/shipping", label: "Kargo Takibi", icon: Truck, permission: "orders.view" },
      { href: "/admin/payments", label: "Ödeme Altyapısı", icon: CreditCard, permission: "orders.view" },
    ],
  },
  {
    title: "Üyelik & AI",
    items: [
      { href: "/admin/users", label: "Kullanıcılar", icon: Users, permission: "users.view" },
      { href: "/admin/club", label: "RAVANON Club", icon: Crown, permission: "club.view" },
      { href: "/admin/ai", label: "AI Danışman", icon: Bot, permission: "settings.view" },
    ],
  },
  {
    title: "Sistem",
    items: [
      { href: "/admin/settings", label: "Ayarlar", icon: Settings, permission: "settings.view" },
    ],
  },
];

function isNavActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  if (item.href === "/admin/products/new") return pathname === "/admin/products/new";
  if (item.href === "/admin/products") {
    return pathname === "/admin/products" || /^\/admin\/products\/\d+/.test(pathname);
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { admin, logout, hasPermission } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-rose-gold">
          <Sparkles className="h-5 w-5 text-navy" />
        </div>
        <div>
          <p className="font-display text-sm font-semibold tracking-[0.2em] text-cream">RAVANON</p>
          <p className="text-[10px] uppercase tracking-widest text-cream/40">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {NAV_SECTIONS.map((section) => {
          const visibleItems = section.items.filter(
            (item) => !item.permission || hasPermission(item.permission)
          );
          if (!visibleItems.length) return null;
          return (
            <div key={section.title}>
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-cream/25">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const active = isNavActive(pathname, item);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        active
                          ? "bg-gold/15 text-gold border border-gold/20"
                          : "text-cream/60 hover:bg-white/5 hover:text-cream border border-transparent"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-2">
        <div className="rounded-lg bg-surface-elevated border border-gold/10 p-3">
          <p className="text-xs text-cream/50">Oturum açan</p>
          <p className="text-sm font-medium text-cream mt-0.5">{admin?.name || "—"}</p>
          <p className="text-[10px] text-gold mt-1">
            {admin?.roles?.[0] ? getRoleLabel(admin.roles[0]) : "Admin"}
          </p>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-cream/50" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </Button>
        <p className="text-[10px] text-center leading-relaxed text-cream/25 px-1 pt-1">
          Site tasarımı ve admin paneli{" "}
          <span className="font-medium text-gold/80">Bafralı Oğuzhan</span>
          &apos;a aittir.
        </p>
      </div>
    </aside>
  );
}