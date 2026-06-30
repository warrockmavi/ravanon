import type {
  ClubGrowthPoint,
  DashboardStats,
  PaymentTransaction,
  SalesDataPoint,
  Shipment,
  TopProduct,
} from "@/types/admin";

export interface AnalyticsData {
  stats: DashboardStats;
  salesData: SalesDataPoint[];
  topProducts: TopProduct[];
  clubGrowth: ClubGrowthPoint[];
  categoryStats: { id: string; name: string; icon: string; productCount: number }[];
  shipments: Shipment[];
  transactions: PaymentTransaction[];
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch("/api/analytics", { cache: "no-store" });
  if (!res.ok) throw new Error("Analitik verisi yüklenemedi");
  return res.json();
}