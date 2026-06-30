import type {
  AdminOrder,
  ClubGrowthPoint,
  DashboardStats,
  PaymentTransaction,
  SalesDataPoint,
  Shipment,
  TopProduct,
} from "@/types/admin";
import { getOrders } from "./orders-repo";
import { getUsers } from "./users-repo";
import { getStoreProducts } from "./repository";

const CATEGORY_META: Record<string, { name: string; icon: string }> = {
  makyaj: { name: "Makyaj", icon: "💄" },
  "cilt-bakimi": { name: "Cilt Bakımı", icon: "✨" },
  "sac-bakimi": { name: "Saç Bakımı", icon: "💇" },
  parfum: { name: "Parfüm & Koku", icon: "🌸" },
  "vucut-bakimi": { name: "Vücut Bakımı", icon: "🧴" },
  tirnak: { name: "Tırnak", icon: "💅" },
  "erkek-bakim": { name: "Erkek Bakım", icon: "🧔" },
  aksesuar: { name: "Aksesuar & Araç", icon: "🪞" },
};

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function isInMonth(iso: string, year: number, month: number) {
  const d = new Date(iso);
  return d.getFullYear() === year && d.getMonth() === month;
}

export function ordersToShipments(orders: AdminOrder[]): Shipment[] {
  return orders
    .filter((o) => !["cancelled", "refunded"].includes(o.status))
    .map((o) => ({
      id: `sh-${o.id}`,
      orderId: o.id,
      customerName: o.customerName,
      carrier: o.shippingInfo.carrier,
      carrierCode: o.shippingInfo.carrierCode,
      trackingNumber: o.shippingInfo.trackingNumber,
      status: o.shippingInfo.status,
      city: o.shippingAddress?.split(",").pop()?.trim() || "—",
      itemCount: o.items.reduce((s, i) => s + i.quantity, 0),
      estimatedDelivery: o.shippingInfo.estimatedDelivery || o.createdAt.slice(0, 10),
      events: o.shippingInfo.events,
      createdAt: o.createdAt,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function ordersToTransactions(orders: AdminOrder[]): PaymentTransaction[] {
  return orders
    .map((o) => ({
      id: o.payment.transactionId,
      orderId: o.id,
      provider: o.payment.provider,
      amount: o.payment.amount,
      status: o.payment.status,
      customerName: o.customerName,
      installment: o.payment.installment,
      createdAt: o.payment.paidAt || o.createdAt,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getDashboardAnalytics() {
  const [orders, users, { products }] = await Promise.all([
    getOrders(),
    getUsers(),
    getStoreProducts(),
  ]);

  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();
  const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);
  const lastYear = lastMonthDate.getFullYear();
  const lastMonth = lastMonthDate.getMonth();

  const thisMonthOrders = orders.filter((o) => isInMonth(o.createdAt, thisYear, thisMonth));
  const lastMonthOrders = orders.filter((o) => isInMonth(o.createdAt, lastYear, lastMonth));

  const revenue = thisMonthOrders.reduce((s, o) => s + o.total, 0);
  const prevRevenue = lastMonthOrders.reduce((s, o) => s + o.total, 0);

  const usersThisMonth = users.filter((u) => isInMonth(u.createdAt, thisYear, thisMonth)).length;
  const usersLastMonth = users.filter((u) => isInMonth(u.createdAt, lastYear, lastMonth)).length;

  const clubMembers = users.filter((u) => u.isClubMember).length;

  const stats: DashboardStats = {
    revenue,
    revenueChange: pctChange(revenue, prevRevenue),
    orders: thisMonthOrders.length,
    ordersChange: pctChange(thisMonthOrders.length, lastMonthOrders.length),
    users: users.length,
    usersChange: pctChange(usersThisMonth, usersLastMonth),
    clubMembers,
    clubChange: pctChange(usersThisMonth, usersLastMonth),
    shipmentsInTransit: orders.filter(
      (o) =>
        ["processing", "confirmed", "shipped"].includes(o.status) &&
        !["delivered", "returned"].includes(o.shippingInfo.status)
    ).length,
    pendingPayments: orders.filter((o) => o.payment.status === "pending").length,
  };

  const salesData: SalesDataPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayOrders = orders.filter((o) => o.createdAt.slice(0, 10) === key);
    salesData.push({
      date: d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    });
  }

  const productSales = new Map<number, { name: string; brand: string; sales: number; revenue: number }>();
  for (const order of thisMonthOrders) {
    for (const item of order.items) {
      const cur = productSales.get(item.productId) || {
        name: item.name,
        brand: item.brand,
        sales: 0,
        revenue: 0,
      };
      cur.sales += item.quantity;
      cur.revenue += item.price * item.quantity;
      productSales.set(item.productId, cur);
    }
  }
  const topProducts: TopProduct[] = [...productSales.entries()]
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  const clubGrowth: ClubGrowthPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(thisYear, thisMonth - i, 1);
    const count = users.filter((u) => {
      const created = new Date(u.createdAt);
      return created <= new Date(d.getFullYear(), d.getMonth() + 1, 0);
    }).length;
    clubGrowth.push({ month: monthNames[d.getMonth()], members: count });
  }

  const catCounts = new Map<string, number>();
  for (const p of products) {
    catCounts.set(p.category, (catCounts.get(p.category) || 0) + 1);
  }
  const categoryStats = [...catCounts.entries()].map(([id, productCount]) => ({
    id,
    name: CATEGORY_META[id]?.name || id,
    icon: CATEGORY_META[id]?.icon || "📦",
    productCount,
  }));

  return { stats, salesData, topProducts, clubGrowth, categoryStats, shipments: ordersToShipments(orders), transactions: ordersToTransactions(orders) };
}