"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShippingTimeline } from "@/components/admin/shipping-timeline";
import type { AdminOrder, OrderStatus, ShippingCarrier } from "@/types/admin";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/utils";
import { RotateCcw, Truck, CheckCircle, CreditCard, ExternalLink } from "lucide-react";

const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"];
const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Beklemede", confirmed: "Onaylandı", processing: "Hazırlanıyor",
  shipped: "Kargoda", delivered: "Teslim Edildi", cancelled: "İptal", refunded: "İade Edildi",
};

const PAYMENT_STATUS: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "default" }> = {
  paid: { label: "Ödendi", variant: "success" },
  pending: { label: "Bekliyor", variant: "warning" },
  failed: { label: "Başarısız", variant: "destructive" },
  refunded: { label: "İade Edildi", variant: "default" },
  partial_refund: { label: "Kısmi İade", variant: "default" },
};

interface OrderDetailDrawerProps {
  order: AdminOrder | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (order: AdminOrder) => void;
}

export function OrderDetailDrawer({ order, open, onClose, onUpdate }: OrderDetailDrawerProps) {
  const [carriers, setCarriers] = useState<ShippingCarrier[]>([]);

  useEffect(() => {
    fetch("/api/shipping").then((r) => r.json()).then((d) => setCarriers(d.carriers || [])).catch(() => {});
  }, []);

  if (!order) return null;

  const nextStatus = () => {
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx >= 0 && idx < STATUS_FLOW.length - 1) {
      onUpdate({ ...order, status: STATUS_FLOW[idx + 1], updatedAt: new Date().toISOString() });
    }
  };

  const handleRefund = () => {
    onUpdate({
      ...order,
      status: "refunded",
      payment: { ...order.payment, status: "refunded" },
      updatedAt: new Date().toISOString(),
    });
  };

  const carrier = carriers.find((c) => c.code === order.shippingInfo.carrierCode);
  const trackingUrl = carrier && order.shippingInfo.trackingNumber !== "—"
    ? `${carrier.trackingUrl}${order.shippingInfo.trackingNumber}`
    : null;

  const paySt = PAYMENT_STATUS[order.payment.status] ?? PAYMENT_STATUS.pending;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="p-0 overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="border-b border-border bg-surface-elevated p-6 pr-14">
            <p className="font-mono text-gold text-lg">{order.id}</p>
            <p className="text-sm text-cream/50 mt-1">{formatDateTime(order.createdAt)}</p>
            <Badge variant={order.status === "delivered" ? "success" : order.status === "refunded" ? "destructive" : "default"} className="mt-3">
              {STATUS_LABELS[order.status]}
            </Badge>
            <p className="font-display text-3xl text-cream mt-4">{formatCurrency(order.total)}</p>
          </div>

          <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="mx-6 mt-4 shrink-0">
              <TabsTrigger value="overview">Özet</TabsTrigger>
              <TabsTrigger value="shipping">Kargo</TabsTrigger>
              <TabsTrigger value="payment">Ödeme</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <TabsContent value="overview" className="space-y-6 mt-4">
                <section>
                  <h4 className="text-xs uppercase tracking-wider text-cream/40 mb-3">Müşteri</h4>
                  <p className="text-cream font-medium">{order.customerName}</p>
                  <p className="text-sm text-cream/50">{order.customerEmail}</p>
                  {order.customerPhone && <p className="text-sm text-cream/50">{order.customerPhone}</p>}
                  <p className="text-sm text-cream/50 mt-2">{order.shippingAddress}</p>
                </section>

                <section>
                  <h4 className="text-xs uppercase tracking-wider text-cream/40 mb-3">Ürünler</h4>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between rounded-lg border border-border bg-surface p-3">
                        <div>
                          <p className="text-sm text-cream">{item.name}</p>
                          <p className="text-xs text-cream/40">{item.brand} × {item.quantity}</p>
                        </div>
                        <span className="text-sm text-gold">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <div className="flex justify-between text-cream/50"><span>Ara Toplam</span><span>{formatCurrency(order.subtotal)}</span></div>
                    {order.discount > 0 && <div className="flex justify-between text-emerald-400"><span>İndirim</span><span>-{formatCurrency(order.discount)}</span></div>}
                    <div className="flex justify-between text-cream/50"><span>Kargo</span><span>{order.shipping === 0 ? "Ücretsiz" : formatCurrency(order.shipping)}</span></div>
                    <div className="flex justify-between text-cream font-medium pt-2 border-t border-border"><span>Toplam</span><span>{formatCurrency(order.total)}</span></div>
                  </div>
                </section>

                {order.pointsEarned !== 0 && (
                  <p className="text-sm text-gold">Club puanı: {order.pointsEarned > 0 ? "+" : ""}{order.pointsEarned}</p>
                )}

                {!["cancelled", "refunded", "delivered"].includes(order.status) && (
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={nextStatus}>
                      <Truck className="h-3.5 w-3.5" />
                      Sonraki Durum
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleRefund}>
                      <RotateCcw className="h-3.5 w-3.5" />
                      İade Başlat
                    </Button>
                  </div>
                )}
                {order.status === "delivered" && (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle className="h-4 w-4" /> Sipariş tamamlandı
                  </div>
                )}
              </TabsContent>

              <TabsContent value="shipping" className="space-y-4 mt-4">
                {order.shippingMethod && (
                  <div className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-sm">
                    <p className="text-cream/50 text-xs mb-1">Müşteri seçimi</p>
                    <p className="text-cream">{order.shippingMethod.carrierId} · {order.shippingMethod.serviceId}</p>
                  </div>
                )}
                {order.shippingInfo.trackingNumber !== "—" ? (
                  <>
                    <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-cream/50">Kargo Firması</span>
                        <span className="text-cream">{order.shippingInfo.carrier}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-cream/50">Takip No</span>
                        <span className="font-mono text-gold">{order.shippingInfo.trackingNumber}</span>
                      </div>
                      {order.shippingInfo.estimatedDelivery && (
                        <div className="flex justify-between text-sm">
                          <span className="text-cream/50">Tahmini Teslimat</span>
                          <span className="text-cream">{formatDate(order.shippingInfo.estimatedDelivery)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trackingUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Kargo Sitesinde Takip Et
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={async () => {
                        const res = await fetch("/api/shipping", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "syncTracking", orderId: order.id }),
                        });
                        if (res.ok) {
                          const { order: updated } = await res.json();
                          onUpdate(updated);
                        }
                      }}>
                        <Truck className="h-3.5 w-3.5" />
                        Takibi Güncelle
                      </Button>
                    </div>
                    <ShippingTimeline events={order.shippingInfo.events} />
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-cream/40">Kargo gönderisi henüz oluşturulmadı. API ile etiket oluşturun.</p>
                    <Button size="sm" onClick={async () => {
                      const res = await fetch("/api/shipping/create", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderId: order.id }),
                      });
                      if (res.ok) {
                        const { order: updated } = await res.json();
                        onUpdate(updated);
                      } else {
                        const err = await res.json().catch(() => ({}));
                        alert(err.error || "Kargo oluşturulamadı");
                      }
                    }}>
                      <Truck className="h-3.5 w-3.5" />
                      Kargo Gönderisi Oluştur
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="payment" className="space-y-4 mt-4">
                <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gold" />
                      <span className="text-cream font-medium">{order.payment.provider}</span>
                    </div>
                    <Badge variant={paySt.variant}>{paySt.label}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-cream/50">
                      <span>İşlem ID</span>
                      <span className="font-mono text-cream/70">{order.payment.transactionId}</span>
                    </div>
                    <div className="flex justify-between text-cream/50">
                      <span>Tutar</span>
                      <span className="text-gold font-medium">{formatCurrency(order.payment.amount)}</span>
                    </div>
                    {order.payment.installment && (
                      <div className="flex justify-between text-cream/50">
                        <span>Taksit</span>
                        <span className="text-cream">{order.payment.installment} ay</span>
                      </div>
                    )}
                    {order.payment.cardBrand && (
                      <div className="flex justify-between text-cream/50">
                        <span>Kart</span>
                        <span className="text-cream">{order.payment.cardBrand} •••• {order.payment.lastFour}</span>
                      </div>
                    )}
                    {order.payment.paidAt && (
                      <div className="flex justify-between text-cream/50">
                        <span>Ödeme Tarihi</span>
                        <span className="text-cream">{formatDateTime(order.payment.paidAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-cream/40">Ödeme yöntemi: {order.paymentMethod}</p>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}