"use client";

import { useEffect, useMemo, useState } from "react";
import { Truck, Package, MapPin, CheckCircle2, Search, ExternalLink, RefreshCw, Settings } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ShipmentStatus>("all");
  const [configCarrier, setConfigCarrier] = useState<ShippingCarrier | null>(null);
  const [creds, setCreds] = useState({ apiKey: "", apiSecret: "", customerCode: "", testMode: true });
  const [saving, setSaving] = useState(false);

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

  const saveCredentials = async () => {
    if (!configCarrier) return;
    setSaving(true);
    try {
      const res = await fetch("/api/shipping", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "credentials",
          id: configCarrier.id,
          apiKey: creds.apiKey || undefined,
          apiSecret: creds.apiSecret || undefined,
          customerCode: creds.customerCode || undefined,
          testMode: creds.testMode,
        }),
      });
      if (!res.ok) throw new Error();
      const { carrier } = await res.json();
      setCarriers((prev) => prev.map((c) => (c.id === carrier.id ? carrier : c)));
      setConfigCarrier(null);
    } catch {
      alert("API bilgileri kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const syncTracking = async (orderId: string) => {
    const res = await fetch("/api/shipping", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "syncTracking", orderId }),
    });
    if (res.ok) await load();
  };

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
    return carrier && shipment.trackingNumber !== "—"
      ? `${carrier.trackingUrl}${shipment.trackingNumber}`
      : "#";
  };

  return (
    <>
      <AdminHeader
        title="Kargo Entegrasyonu"
        description="HepsiJet, Yurtiçi, Aras, MNG, PTT — API yapılandırma ve canlı takip"
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
                <p className="text-center py-12 text-cream/40">Gönderi bulunamadı — sipariş oluşturup kargo etiketi basın</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-surface-elevated">
                      {["Takip No", "Sipariş", "Müşteri", "Kargo", "Durum", "Tahmini", ""].map((h) => (
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
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          {s.trackingNumber !== "—" && s.status !== "delivered" && (
                            <Button size="sm" variant="outline" onClick={() => syncTracking(s.orderId)}>Güncelle</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-elevated p-5 space-y-4">
            <h3 className="text-sm font-medium text-cream">Kargo Firmaları</h3>
            <div className="space-y-2">
              {carriers.map((c) => (
                <div key={c.id} className={cn("rounded-lg border px-3 py-3", c.active ? "border-gold/20 bg-surface" : "border-border opacity-60")}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{c.logo}</span>
                      <div>
                        <p className="text-sm text-cream">{c.name}</p>
                        <p className="text-[10px] text-cream/40 font-mono">{c.apiKeyMasked || "—"}</p>
                      </div>
                    </div>
                    <Switch checked={c.active} onCheckedChange={() => toggleCarrier(c.id)} />
                  </div>
                  <div className="flex gap-1 flex-wrap mb-2">
                    {c.testMode && <Badge variant="warning">Test</Badge>}
                    {c.services?.map((s) => (
                      <Badge key={s.id} variant="default">{s.name} ₺{s.basePrice}</Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { setConfigCarrier(c); setCreds({ apiKey: "", apiSecret: "", customerCode: c.customerCode || "", testMode: c.testMode }); }}>
                    <Settings className="h-3.5 w-3.5" />
                    API Yapılandır
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-cream/40">
              Her firmanın geliştirici panelinden API anahtarı alın. Test modunda simülasyon takip numarası üretilir.
            </p>
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
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <a href={getTrackingUrl(selected)} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Kargo Sitesinde Takip Et
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => syncTracking(selected.orderId)}>
                      <RefreshCw className="h-3.5 w-3.5" />
                      Güncelle
                    </Button>
                  </div>
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

      {configCarrier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfigCarrier(null)} />
          <div className="relative w-full max-w-md rounded-xl border border-border bg-surface-elevated p-6 shadow-2xl">
            <h2 className="font-display text-lg text-cream mb-1">{configCarrier.name} — API</h2>
            <p className="text-sm text-cream/40 mb-6">Boş alanlar mevcut değerleri korur</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-cream/50 mb-1.5 block">API Key / Kullanıcı</label>
                <Input value={creds.apiKey} onChange={(e) => setCreds({ ...creds, apiKey: e.target.value })} className="font-mono text-sm" />
              </div>
              <div>
                <label className="text-xs text-cream/50 mb-1.5 block">API Secret / Şifre</label>
                <Input type="password" value={creds.apiSecret} onChange={(e) => setCreds({ ...creds, apiSecret: e.target.value })} className="font-mono text-sm" />
              </div>
              <div>
                <label className="text-xs text-cream/50 mb-1.5 block">Müşteri / Sözleşme Kodu</label>
                <Input value={creds.customerCode} onChange={(e) => setCreds({ ...creds, customerCode: e.target.value })} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <Switch checked={creds.testMode} onCheckedChange={(v) => setCreds({ ...creds, testMode: v })} />
                <span className="text-sm text-cream">Test / Sandbox modu</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setConfigCarrier(null)}>İptal</Button>
              <Button className="flex-1" onClick={saveCredentials} disabled={saving}>{saving ? "Kaydediliyor..." : "Kaydet"}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}