"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Clock, Truck, TrendingUp, RefreshCw } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { KpiCard } from "@/components/admin/kpi-card";
import { OrdersTable } from "@/components/admin/orders-table";
import { OrderDetailDrawer } from "@/components/admin/order-detail-drawer";
import { getOrderKpis } from "@/lib/mock/orders";
import { fetchOrders, saveOrderApi } from "@/lib/api/store";
import type { AdminOrder } from "@/types/admin";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setOrders(await fetchOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const kpis = getOrderKpis(orders);

  const handleUpdate = async (order: AdminOrder) => {
    const saved = await saveOrderApi(order);
    setOrders((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
    setSelected(saved);
  };

  return (
    <>
      <AdminHeader
        title="Siparişler"
        description="Mağazadan gelen siparişler burada görünür — durum güncellemeleri senkronize edilir"
        actions={
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Yenile
          </Button>
        }
      />
      <main className="p-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Toplam Sipariş" value={loading ? "…" : kpis.total} icon={<ShoppingCart className="h-5 w-5" />} />
          <KpiCard title="Bekleyen" value={loading ? "…" : kpis.pending} icon={<Clock className="h-5 w-5" />} />
          <KpiCard title="Kargoda" value={loading ? "…" : kpis.inTransit} icon={<Truck className="h-5 w-5" />} />
          <KpiCard title="Gelir" value={loading ? "…" : formatCurrency(kpis.revenue)} icon={<TrendingUp className="h-5 w-5" />} />
        </div>
        {!loading && (
          <OrdersTable
            orders={orders}
            onOrderClick={(o) => { setSelected(o); setDrawerOpen(true); }}
          />
        )}
      </main>
      <OrderDetailDrawer
        order={selected}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdate={handleUpdate}
      />
    </>
  );
}