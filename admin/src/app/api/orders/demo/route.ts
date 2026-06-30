import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/api-guard";
import { createStorefrontOrder } from "@/lib/store/orders-repo";
import { getStoreProducts } from "@/lib/store/repository";

const DEMO_CUSTOMERS = [
  { name: "Ayşe Yılmaz", email: "ayse.yilmaz@email.com", phone: "+90 532 400 1122" },
  { name: "Can Öztürk", email: "can.ozturk@email.com", phone: "+90 533 500 2233" },
  { name: "Selin Akın", email: "selin.akin@email.com", phone: "+90 534 600 3344" },
  { name: "Burak Demir", email: "burak.demir@email.com", phone: "+90 535 700 4455" },
  { name: "Deniz Korkmaz", email: "deniz.k@email.com", phone: "+90 536 800 5566" },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(req: NextRequest) {
  const guard = requirePermission(req, "orders.view");
  if (guard.error) return guard.error;

  const { products } = await getStoreProducts();
  const active = products.filter((p) => p.active !== false);
  if (!active.length) {
    return NextResponse.json({ error: "Demo için ürün bulunamadı" }, { status: 400 });
  }

  const count = 1 + Math.floor(Math.random() * 2);
  const picked = [...active].sort(() => Math.random() - 0.5).slice(0, count);
  const items = picked.map((p) => ({
    productId: p.id,
    name: p.name,
    brand: p.brand,
    price: p.price,
    quantity: 1,
  }));
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = subtotal >= 750 ? 0 : 49.9;
  const customer = pick(DEMO_CUSTOMERS);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  const id = `RVN-DEMO-${suffix}`;

  const order = await createStorefrontOrder({
    id,
    userId: "demo",
    userEmail: customer.email,
    status: "Hazırlanıyor",
    items,
    subtotal,
    discount: 0,
    shippingCost,
    total: subtotal + shippingCost,
    payment: "Kredi Kartı",
    shippingAddress: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: "Demo Mah. RAVANON Cad. No:1",
      city: "İstanbul",
      method: "standard",
    },
    createdAt: Date.now(),
  });

  return NextResponse.json({ order, demo: true }, { status: 201 });
}