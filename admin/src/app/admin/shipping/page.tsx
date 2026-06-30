"use client";

import { useEffect, useMemo, useState } from "react";
import { Truck, Package, MapPin, CheckCircle2, Search, ExternalLink, RefreshCw } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { KpiCard } from "@/components/admin/kpi-card";
import { ShippingTimeline } from "@/components/admin/shipping-timeline";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { Shipment, ShipmentStatus, ShippingCarrier } from "@/types/admin";
import { cn, formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  preparing: "Hazırlanıyor",
  picked_up: "Kargoya Verildi",
  in_transit: "Yolda",
  out_for_delivery: "Dağıtımda",
  delivered: "Teslim Edildi",
  returned: "İade",
};

const STATUS_VARIANT: Record<ShipmentStatus, "default" | "warning" | "success" | "destructive" | "secondary"> = {
  preparing: "secondary",
  picked_up: "default",
  in_transit: "warning",
  out_for_delivery: "warning",
  delivered: "success",
  returned: "destructive",
};

export default function ShippingPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [carriers, setCarriers] = useState<ShippingCarrier[]>([]);

  const toggleCarrier = async (id: string) => {
    const res = await fetch("/api/shipping", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", id }),
    });
    if (res.ok) {
      const { carrier } = await res.json();
      setCarriers((prev) => prev.map((c) => (c.id === id ? carrier : c)));
    }
  };
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ShipmentStatus>("all");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shipping", { cache: "no-store" });
      const data = await res.json();
      setShipments(data.shipments);
      setCarriers(data.carriers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const kpis = useMemo(() => ({
    total: shipments.length,
    inTransit: shipments.filter((s) => ["in_transit", "out_for_delivery", "picked_up"].includes(s.status)).length,
    preparing: shipments.filter((s) => s.status === "preparing").length,
    delivered: shipments.filter((s) => s.status === "delivered").length,
  }), [shipments]);

  const filtered = useMemo(() => {
    let list = shipments;
    if (statusFilter !== "all") list = list.filter((s) => s.status === statusFilter);
    if (filter) {
      const q = filter.toLowerCase();
      list = list.filter(
        (s) =>
          s.trackingNumber.toLowerCase().includes(q) ||
          s.orderId.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [shipments, filter, statusFilter]);

  const getTrackingUrl = (shipment: Shipment) => {
    const carrier = carriers.find((c) => c.code === shipment.carrierCode);
    return carrier ? `${carrier.trackingUrl}${shipment.trackingNumber}` : "#";
  };

  return (
    <>
      <AdminHeader
        title="Kargo Takibi"
        description="Siparişlerden türetilen canlı gönderi durumu"
        actions={
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Yenile
          </Button>
        }
      />
      <main className="p-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Toplam Gönderi" value={kpis.total} icon={<Package className="h-5 w-5" />} />
          <KpiCard title="Yolda" value={kpis.inTransit} icon={<Truck className="h-5 w-5" />} />
          <KpiCard title="Hazırlanıyor" value={kpis.preparing} icon={<MapPin className="h-5 w-5" />} />
          <KpiCard title="Teslim Edildi" value={kpis.delivered} icon={<CheckCircle2 className="h-5 w-5" />} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/30" />
                <Input placeholder="Takip no, sipariş veya müşteri ara..." value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-9" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(["all", "preparing", "in_transit", "out_for_delivery", "delivered"] as const).map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)} className={cn("rounded-full border px-3 py-1 text-xs", statusFilter === s ? "border-gold/40 bg-gold/10 text-gold" : "border-border text-cream/50")}>
                    {s === "all" ? "Tümü" : STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              {loading ? (
                <p className="text-center py-12 text-cream/40">Yükleniyor...</p>
              ) : filtered.length === 0 ? (
                <p className="text-center py-12 text-cream/40">Gönderi bulunamadı</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-surface-elevated">
                      {["Takip No", "Sipariş", "Müşteri", "Kargo", "Durum", "Tahmini"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-cream/40">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr key={s.id} className="border-b border-border last:border-0 hover:bg-white/5 cursor-pointer" onClick={() => setSelected(s)}>
                        <td className="px-4 py-3 font-mono text-sm text-gold">{s.trackingNumber}</td>
                        <td className="px-4 py-3 text-sm text-cream/70">{s.orderId}</td>
                        <td className="px-4 py-3 text-sm text-cream">{s.customerName}</td>
                        <td className="px-4 py-3 text-sm text-cream/60">{s.carrier}</td>
                        <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[s.status]}>{STATUS_LABELS[s.status]}</Badge></td>
                        <td className="px-4 py-3 text-sm text-cream/50">{formatDate(s.estimatedDelivery)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-elevated p-5">
            <h3 className="text-sm font-medium text-cream mb-4">Kargo Firmaları</h3>
            <div className="space-y-2">
              {carriers.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{c.logo}</span>
                    <div>
                      <p className="text-sm text-cream">{c.name}</p>
                      <p className="text-[10px] text-cream/40">~{c.avgDeliveryDays} gün</p>
                    </div>
                  </div>
                  <Switch checked={c.active} onCheckedChange={() => toggleCarrier(c.id)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent side="right" className="p-0 overflow-hidden">
          {selected && (
            <div className="flex h-full flex-col">
              <div className="border-b border-border bg-surface-elevated p-6 pr-14">
                <p className="font-mono text-gold text-lg">{selected.trackingNumber}</p>
                <p className="text-sm text-cream/50 mt-1">{selected.orderId} · {selected.customerName}</p>
                <Badge variant={STATUS_VARIANT[selected.status]} className="mt-3">{STATUS_LABELS[selected.status]}</Badge>
                <p className="text-sm text-cream/60 mt-3">{selected.carrier} · {selected.city}</p>
                {selected.trackingNumber !== "—" && (
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <a href={getTrackingUrl(selected)} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Kargo Sitesinde Takip Et
                    </a>
                  </Button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <h4 className="text-xs uppercase tracking-wider text-cream/40 mb-4">Kargo Hareketleri</h4>
                <ShippingTimeline events={selected.events} />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}