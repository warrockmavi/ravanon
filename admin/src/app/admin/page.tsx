"use client";

import { useEffect, useRef, useState } from "react";
import { createDemoOrder } from "@/lib/api/demo";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/header";
import { KpiCard } from "@/components/admin/kpi-card";
import { SalesChart, ClubGrowthChart, TopProductsTable } from "@/components/admin/dashboard-charts";
import { fetchAnalytics } from "@/lib/api/analytics";
import type { AnalyticsData } from "@/lib/api/analytics";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, ShoppingCart, Users, Crown, Truck, CreditCard, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoOrderButton } from "@/components/admin/demo-order-button";

export default function AdminDashboardPage() {
  const demoRan = useRef(false);
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

  useEffect(() => {
    if (demoRan.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") !== "1") return;
    demoRan.current = true;
    const t = setTimeout(() => { void createDemoOrder(); }, 800);
    return () => clearTimeout(t);
  }, []);

  const stats = data?.stats;

  const quickLinks = [
    { href: "/admin/products/new", label: "Ürün Yükle", desc: "Kozmetik ürün ekle" },
    { href: "/admin/orders", label: "Siparişler", desc: "Sipariş takibi" },
    { href: "/admin/shipping", label: "Kargo Takibi", desc: stats ? `${stats.shipmentsInTransit} gönderi yolda` : "Kargo durumu" },
    { href: "/admin/payments", label: "Ödemeler", desc: stats ? `${stats.pendingPayments} bekleyen ödeme` : "Ödeme takibi" },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Canlı sipariş, kullanıcı ve gelir özeti"
        actions={
          <>
            <DemoOrderButton />
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Yenile
            </Button>
          </>
        }
      />
      <main className="p-8 space-y-8">
        {loading && !data ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
              <KpiCard title="Toplam Gelir" value={formatCurrency(stats.revenue)} change={stats.revenueChange} icon={<TrendingUp className="h-5 w-5" />} />
              <KpiCard title="Siparişler" value={stats.orders} change={stats.ordersChange} icon={<ShoppingCart className="h-5 w-5" />} />
              <KpiCard title="Kullanıcılar" value={stats.users.toLocaleString("tr-TR")} change={stats.usersChange} icon={<Users className="h-5 w-5" />} />
              <KpiCard title="Club Üyeleri" value={stats.clubMembers.toLocaleString("tr-TR")} change={stats.clubChange} icon={<Crown className="h-5 w-5" />} />
              <KpiCard title="Kargoda" value={stats.shipmentsInTransit} icon={<Truck className="h-5 w-5" />} />
              <KpiCard title="Bekleyen Ödeme" value={stats.pendingPayments} icon={<CreditCard className="h-5 w-5" />} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href} className="group rounded-xl border border-border bg-surface-elevated p-4 hover:border-gold/30 transition-all">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-cream">{link.label}</p>
                    <ArrowRight className="h-4 w-4 text-cream/30 group-hover:text-gold transition-colors" />
                  </div>
                  <p className="text-xs text-cream/40 mt-1">{link.desc}</p>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SalesChart data={data!.salesData} />
              <ClubGrowthChart data={data!.clubGrowth} />
            </div>

            <TopProductsTable products={data!.topProducts} />
          </>
        ) : (
          <p className="text-cream/50 text-center py-12">Veri yüklenemedi</p>
        )}
      </main>
    </>
  );
}