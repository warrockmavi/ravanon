import { NextResponse } from "next/server";
import { getOrders } from "@/lib/store/orders-repo";
import { getStoreProducts } from "@/lib/store/repository";
import { getSettings } from "@/lib/store/settings-repo";

export async function GET() {
  const [orders, { products }, settings] = await Promise.all([
    getOrders(),
    getStoreProducts(),
    getSettings(),
  ]);

  const dayAgo = Date.now() - 86400000;
  const recentOrders = orders.filter((o) => new Date(o.createdAt).getTime() > dayAgo);
  const lowStock = settings.lowStockAlerts
    ? products.filter((p) => p.active && (p.stock ?? 0) > 0 && (p.stock ?? 0) < 15)
    : [];

  const items = [
    ...recentOrders.slice(0, 5).map((o) => ({
      id: `ord-${o.id}`,
      type: "order" as const,
      title: "Yeni sipariş",
      message: `${o.customerName} — ${o.total.toLocaleString("tr-TR")} TL`,
      href: "/admin/orders",
      createdAt: o.createdAt,
    })),
    ...lowStock.slice(0, 5).map((p) => ({
      id: `stk-${p.id}`,
      type: "stock" as const,
      title: "Düşük stok",
      message: `${p.name} — ${p.stock} adet kaldı`,
      href: `/admin/products/${p.id}/edit`,
      createdAt: p.updatedAt ?? new Date().toISOString(),
    })),
  ].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());

  return NextResponse.json({ items, unread: items.length });
}