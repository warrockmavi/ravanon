import fs from "fs/promises";
import type { AdminOrder, OrderShippingMethod, OrderStatus } from "@/types/admin";
import { ORDERS_JSON } from "./paths";
import { MOCK_ORDERS } from "@/lib/mock/orders";
import { getCarriers } from "./shipping-repo";
import { getSettings } from "./settings-repo";

interface OrdersFile {
  version: number;
  updatedAt: string;
  orders: AdminOrder[];
}

async function read(): Promise<OrdersFile> {
  try {
    const data = JSON.parse(await fs.readFile(ORDERS_JSON, "utf8")) as OrdersFile;
    if (!data.orders?.length) {
      data.orders = MOCK_ORDERS;
      await write(data);
    }
    return data;
  } catch {
    const seed: OrdersFile = { version: 1, updatedAt: new Date().toISOString(), orders: MOCK_ORDERS };
    await write(seed);
    return seed;
  }
}

async function write(data: OrdersFile) {
  data.updatedAt = new Date().toISOString();
  await fs.mkdir(ORDERS_JSON.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
  await fs.writeFile(ORDERS_JSON, JSON.stringify(data, null, 2), "utf8");
}

export async function getOrders(): Promise<AdminOrder[]> {
  return (await read()).orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderById(id: string): Promise<AdminOrder | null> {
  return (await read()).orders.find((o) => o.id === id) ?? null;
}

export async function saveOrder(order: AdminOrder): Promise<AdminOrder> {
  const file = await read();
  const idx = file.orders.findIndex((o) => o.id === order.id);
  const updated = { ...order, updatedAt: new Date().toISOString() };
  if (idx >= 0) file.orders[idx] = updated;
  else file.orders.unshift(updated);
  await write(file);
  return updated;
}

const STATUS_MAP: Record<string, OrderStatus> = {
  "Hazırlanıyor": "processing",
  "Onaylandı": "confirmed",
  "Kargoda": "shipped",
  "Teslim Edildi": "delivered",
  "İptal": "cancelled",
  "İade": "refunded",
};

export async function storefrontToAdminOrder(raw: Record<string, unknown>): Promise<AdminOrder> {
  const ship = (raw.shippingAddress ?? raw.shipping) as Record<string, string> | undefined;
  const items = (raw.items as AdminOrder["items"]) ?? [];
  const now = new Date().toISOString();
  const payMeta = raw.paymentResult as Record<string, unknown> | undefined;
  const payStatus = String(payMeta?.status ?? (raw.paymentPending ? "pending" : "paid"));
  const orderStatus =
    payStatus === "pending" ? "pending" : STATUS_MAP[String(raw.status)] ?? "processing";
  const shippingCost = Number((raw as { shippingCost?: number }).shippingCost ?? (typeof raw.shipping === "number" ? raw.shipping : 0));
  const providerName = String(payMeta?.providerName ?? raw.payment ?? "iyzico");
  const providerId = String(payMeta?.providerId ?? raw.payment ?? "iyzico");
  const txId = String(payMeta?.transactionId ?? `TX-${raw.id}`);

  const sm = raw.shippingMethod as OrderShippingMethod | undefined;
  const [carriers, settings] = await Promise.all([getCarriers(), getSettings()]);
  const carrier = sm
    ? carriers.find((c) => c.id === sm.carrierId)
    : carriers.find((c) => c.id === settings.defaultCarrier) || carriers.find((c) => c.active);
  const isPickup = sm?.type === "pickup" || ship?.method === "pickup";
  const carrierName = isPickup ? "Mağazadan Teslim" : carrier?.name || "HepsiJet";
  const carrierId = isPickup ? "pickup" : carrier?.id || "hepsijet";
  const carrierCode = isPickup ? "PU" : carrier?.code || "HJ";
  const etaDays = sm?.etaDays ?? carrier?.avgDeliveryDays ?? 3;

  return {
    id: String(raw.id),
    userId: raw.userId ? String(raw.userId) : "guest",
    customerName: ship?.name ?? "Misafir",
    customerEmail: String(raw.userEmail ?? ship?.email ?? ""),
    customerPhone: ship?.phone,
    items: items.map((i) => ({
      productId: i.productId,
      name: i.name,
      brand: i.brand ?? "",
      quantity: i.quantity,
      price: i.price,
    })),
    subtotal: Number(raw.subtotal ?? 0),
    shipping: shippingCost,
    discount: Number(raw.discount ?? 0),
    total: Number(raw.total ?? 0),
    status: orderStatus,
    paymentMethod: providerName,
    payment: {
      provider: providerName,
      providerId,
      transactionId: txId,
      status: payStatus === "pending" ? "pending" : payStatus === "failed" ? "failed" : "paid",
      amount: Number(raw.total ?? 0),
      installment: payMeta?.installment as number | undefined,
      paidAt: payStatus === "paid" ? now : undefined,
      authCode: payMeta?.authCode as string | undefined,
    },
    shippingMethod: sm,
    shippingInfo: {
      carrier: carrierName,
      carrierId,
      carrierCode,
      serviceId: sm?.serviceId,
      trackingNumber: "—",
      status: "preparing",
      estimatedDelivery: new Date(Date.now() + etaDays * 86400000).toISOString().slice(0, 10),
      events: [{ id: "e1", status: "preparing", title: "Sipariş alındı", location: "RAVANON Depo", createdAt: now }],
    },
    shippingAddress: ship ? `${ship.address}, ${ship.city}` : "",
    pointsEarned: Number((raw as { pointsEarned?: number }).pointsEarned ?? 0),
    createdAt: raw.createdAt ? new Date(Number(raw.createdAt)).toISOString() : now,
    updatedAt: now,
  };
}

export async function createStorefrontOrder(raw: Record<string, unknown>): Promise<AdminOrder> {
  const order = await storefrontToAdminOrder(raw);
  return saveOrder(order);
}

export async function confirmPendingPayment(orderId: string): Promise<AdminOrder | null> {
  const order = await getOrderById(orderId);
  if (!order || order.payment.status !== "pending") return null;
  const now = new Date().toISOString();
  order.payment = { ...order.payment, status: "paid", paidAt: now };
  order.status = "processing";
  order.updatedAt = now;
  return saveOrder(order);
}