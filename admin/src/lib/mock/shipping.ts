import type { Shipment, ShippingCarrier, ShippingTrackingEvent } from "@/types/admin";

const SVC = (price: number, days: number) => [{ id: "standard", name: "Standart", basePrice: price, etaDays: days, active: true }];

export const MOCK_CARRIERS: ShippingCarrier[] = [
  { id: "yurtici", name: "Yurtiçi Kargo", code: "YK", logo: "📦", trackingUrl: "https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=", active: true, testMode: true, avgDeliveryDays: 2, apiKeyMasked: "—", services: SVC(44.9, 2) },
  { id: "aras", name: "Aras Kargo", code: "AR", logo: "🚚", trackingUrl: "https://www.araskargo.com.tr/trmm.aspx?q=", active: true, testMode: true, avgDeliveryDays: 2, apiKeyMasked: "—", services: SVC(42.9, 2) },
  { id: "mng", name: "MNG Kargo", code: "MNG", logo: "📮", trackingUrl: "https://www.mngkargo.com.tr/tracking?code=", active: true, testMode: true, avgDeliveryDays: 3, apiKeyMasked: "—", services: SVC(39.9, 3) },
  { id: "ptt", name: "PTT Kargo", code: "PTT", logo: "✉️", trackingUrl: "https://gonderitakip.ptt.gov.tr/", active: false, testMode: true, avgDeliveryDays: 4, apiKeyMasked: "—", services: SVC(35.9, 4) },
  { id: "hepsijet", name: "HepsiJet", code: "HJ", logo: "⚡", trackingUrl: "https://www.hepsijet.com/takip/", active: true, testMode: true, avgDeliveryDays: 1, apiKeyMasked: "—", services: [{ id: "express", name: "Hızlı", basePrice: 89.9, etaDays: 1, active: true }, { id: "standard", name: "Standart", basePrice: 49.9, etaDays: 2, active: true }] },
];

const defaultEvents = (status: string): ShippingTrackingEvent[] => {
  const base: ShippingTrackingEvent[] = [
    { id: "e1", status: "preparing", title: "Sipariş hazırlanıyor", location: "RAVANON Depo — İstanbul", createdAt: "2026-06-29T10:00:00Z" },
    { id: "e2", status: "picked_up", title: "Kargo firmasına teslim edildi", location: "İstanbul Aktarma", createdAt: "2026-06-29T16:00:00Z" },
  ];
  if (status === "in_transit" || status === "out_for_delivery" || status === "delivered") {
    base.push({ id: "e3", status: "in_transit", title: "Dağıtım merkezinde", location: "Ankara Aktarma", createdAt: "2026-06-30T08:00:00Z" });
  }
  if (status === "out_for_delivery" || status === "delivered") {
    base.push({ id: "e4", status: "out_for_delivery", title: "Dağıtıma çıktı", location: "Çankaya Şube", createdAt: "2026-06-30T11:00:00Z" });
  }
  if (status === "delivered") {
    base.push({ id: "e5", status: "delivered", title: "Teslim edildi", location: "Müşteri adresi", createdAt: "2026-06-30T14:30:00Z" });
  }
  return base;
};

export const MOCK_SHIPMENTS: Shipment[] = [
  { id: "sh1", orderId: "RVN-P9L2K1", customerName: "Zeynep Arslan", carrier: "Yurtiçi Kargo", carrierCode: "YK", trackingNumber: "YK7849201563", status: "in_transit", city: "Ankara", itemCount: 3, estimatedDelivery: "2026-07-01", events: defaultEvents("in_transit"), createdAt: "2026-06-29T18:00:00Z" },
  { id: "sh2", orderId: "RVN-A3F8W9", customerName: "Fatma İnce", carrier: "HepsiJet", carrierCode: "HJ", trackingNumber: "HJ20260630001", status: "preparing", city: "İzmir", itemCount: 2, estimatedDelivery: "2026-07-02", events: defaultEvents("preparing"), createdAt: "2026-06-30T09:15:00Z" },
  { id: "sh3", orderId: "RVN-B5H2Q7", customerName: "Selin Yıldız", carrier: "Aras Kargo", carrierCode: "AR", trackingNumber: "AR5567891234", status: "out_for_delivery", city: "Bursa", itemCount: 1, estimatedDelivery: "2026-06-30", events: defaultEvents("out_for_delivery"), createdAt: "2026-06-30T12:30:00Z" },
  { id: "sh4", orderId: "RVN-M2K8X4", customerName: "Elif Kaya", carrier: "MNG Kargo", carrierCode: "MNG", trackingNumber: "MNG9988776655", status: "delivered", city: "İstanbul", itemCount: 2, estimatedDelivery: "2026-06-30", events: defaultEvents("delivered"), createdAt: "2026-06-28T14:30:00Z" },
  { id: "sh5", orderId: "RVN-K7J3N2", customerName: "Elif Kaya", carrier: "Yurtiçi Kargo", carrierCode: "YK", trackingNumber: "YK1122334455", status: "delivered", city: "İstanbul", itemCount: 1, estimatedDelivery: "2026-06-12", events: defaultEvents("delivered"), createdAt: "2026-06-10T16:00:00Z" },
];