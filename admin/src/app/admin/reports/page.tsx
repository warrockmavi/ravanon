"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, Package, RefreshCw } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { KpiCard } from "@/components/admin/kpi-card";
import { SalesChart, ClubGrowthChart, TopProductsTable } from "@/components/admin/dashboard-charts";
import { fetchAnalytics } from "@/lib/api/analytics";
import type { AnalyticsData } from "@/lib/api/analytics";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ReportsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setData(await fetchAnalytics());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const exportCsv = () => {
    if (!data) return;
    const rows = [
      ["Metrik", "Değer", "Değişim %"],
      ["Aylık Gelir", data.stats.revenue, data.stats.revenueChange],
      ["Sipariş", data.stats.orders, data.stats.ordersChange],
      ["Kullanıcı", data.stats.users, data.stats.usersChange],
      ["Club Üye", data.stats.clubMembers, data.stats.clubChange],
      [],
      ["Ürün", "Satış", "Gelir"],
      ...data.topProducts.map((p) => [p.name, p.sales, p.revenue]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ravanon-rapor.csv";
    a.click();
  };

  const stats = data?.stats;

  return (
    <>
      <AdminHeader
        title="Raporlar & Analitik"
        description="Canlı satış, kategori ve üye büyüme raporları"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={!data}>
              <Download className="h-4 w-4" />
              CSV İndir
            </Button>
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Yenile
            </Button>
          </div>
        }
      />
      <main className="p-8 space-y-8">
        {loading && !data ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard title="Aylık Gelir" value={formatCurrency(stats.revenue)} change={stats.revenueChange} icon={<TrendingUp className="h-5 w-5" />} />
              <KpiCard title="Sipariş" value={stats.orders} change={stats.ordersChange} icon={<BarChart3 className="h-5 w-5" />} />
              <KpiCard title="Toplam Üye" value={stats.users} change={stats.usersChange} icon={<Users className="h-5 w-5" />} />
              <KpiCard title="Club Üyesi" value={stats.clubMembers} change={stats.clubChange} icon={<Package className="h-5 w-5" />} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SalesChart data={data!.salesData} />
              <ClubGrowthChart data={data!.clubGrowth} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TopProductsTable products={data!.topProducts} />
              <div className="rounded-xl border border-border bg-surface-elevated p-6">
                <h3 className="font-display text-lg text-cream mb-4">Kategori Dağılımı</h3>
                <div className="space-y-3">
                  {data!.categoryStats.map((c) => {
                    const total = data!.categoryStats.reduce((s, x) => s + x.productCount, 0) || 1;
                    const pct = Math.round((c.productCount / total) * 100);
                    return (
                      <div key={c.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-cream/70">{c.icon} {c.name}</span>
                          <span className="text-cream/50">{c.productCount} ürün (%{pct})</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-gold to-rose-gold" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-cream/50 text-center py-12">Rapor verisi yüklenemedi</p>
        )}
      </main>
    </>
  );
}