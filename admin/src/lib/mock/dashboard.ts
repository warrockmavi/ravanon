import type { ClubGrowthPoint, DashboardStats, SalesDataPoint, TopProduct } from "@/types/admin";

export const DASHBOARD_STATS: DashboardStats = {
  revenue: 284750,
  revenueChange: 12.4,
  orders: 342,
  ordersChange: 8.2,
  users: 1847,
  usersChange: 15.6,
  clubMembers: 1203,
  clubChange: 22.1,
  shipmentsInTransit: 3,
  pendingPayments: 1,
};

export const SALES_DATA: SalesDataPoint[] = [
  { date: "24 Haz", revenue: 18200, orders: 24 },
  { date: "25 Haz", revenue: 22400, orders: 31 },
  { date: "26 Haz", revenue: 19800, orders: 27 },
  { date: "27 Haz", revenue: 31200, orders: 42 },
  { date: "28 Haz", revenue: 28900, orders: 38 },
  { date: "29 Haz", revenue: 35600, orders: 48 },
  { date: "30 Haz", revenue: 42100, orders: 55 },
];

export const TOP_PRODUCTS: TopProduct[] = [
  { id: 6, name: "Soft Pinch Liquid Blush", brand: "Rare Beauty", sales: 89, revenue: 97411 },
  { id: 2, name: "Hyaluronic Acid Serum", brand: "The Inkey List", sales: 76, revenue: 29564 },
  { id: 48, name: "Relief Sun SPF50+", brand: "Beauty of Joseon", sales: 68, revenue: 44132 },
  { id: 7, name: "Brazilian Bum Bum Cream", brand: "Sol de Janeiro", sales: 54, revenue: 48546 },
  { id: 17, name: "Pillow Talk Lipstick", brand: "Charlotte Tilbury", sales: 47, revenue: 79903 },
];

export const CLUB_GROWTH: ClubGrowthPoint[] = [
  { month: "Oca", members: 820 },
  { month: "Şub", members: 890 },
  { month: "Mar", members: 945 },
  { month: "Nis", members: 1010 },
  { month: "May", members: 1080 },
  { month: "Haz", members: 1203 },
];