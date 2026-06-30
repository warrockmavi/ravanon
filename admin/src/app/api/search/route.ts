import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "@/lib/store/users-repo";
import { getOrders } from "@/lib/store/orders-repo";
import { getStoreProducts } from "@/lib/store/repository";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").toLowerCase().trim();
  if (q.length < 2) return NextResponse.json({ results: [] });

  const [users, orders, { products }] = await Promise.all([
    getUsers(),
    getOrders(),
    getStoreProducts(),
  ]);

  const results: { type: string; id: string; title: string; subtitle: string; href: string }[] = [];

  for (const u of users) {
    if (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone?.includes(q)) {
      results.push({ type: "user", id: u.id, title: u.name, subtitle: u.email, href: `/admin/users` });
    }
  }
  for (const o of orders) {
    if (o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q)) {
      results.push({ type: "order", id: o.id, title: o.id, subtitle: o.customerName, href: `/admin/orders` });
    }
  }
  for (const p of products) {
    if (p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)) {
      results.push({ type: "product", id: String(p.id), title: p.name, subtitle: p.brand, href: `/admin/products/${p.id}/edit` });
    }
  }

  return NextResponse.json({ results: results.slice(0, 12) });
}