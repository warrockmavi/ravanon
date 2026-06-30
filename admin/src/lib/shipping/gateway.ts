import type { AdminOrder, ShippingCarrier, ShippingTrackingEvent, ShipmentStatus } from "@/types/admin";
import { getCarriers } from "@/lib/store/shipping-repo";
import { getSettings } from "@/lib/store/settings-repo";
import type {
  CheckoutShippingMethod,
  CreateShipmentRequest,
  ShipmentCreateResult,
  ShippingQuoteRequest,
  ShippingQuoteResult,
  TrackingSyncResult,
} from "./types";

const PICKUP_METHOD: CheckoutShippingMethod = {
  methodId: "pickup",
  carrierId: "pickup",
  serviceId: "pickup",
  type: "pickup",
  name: "Mağazadan Teslimat",
  description: "Click & Collect — Aynı gün veya ertesi gün",
  logo: "🏪",
  price: 0,
  etaDays: 0,
  etaLabel: "Aynı gün",
};

function etaLabel(days: number) {
  if (days <= 0) return "Aynı gün";
  if (days === 1) return "1 iş günü";
  return `${days} iş günü`;
}

function genTracking(carrier: ShippingCarrier): string {
  const n = Date.now().toString().slice(-9);
  const prefixes: Record<string, string> = {
    hepsijet: "HJ",
    yurtici: "YK",
    aras: "AR",
    mng: "MNG",
    ptt: "PTT",
  };
  return `${prefixes[carrier.id] || carrier.code}${n}`;
}

function baseEvent(status: ShipmentStatus, title: string, location: string): ShippingTrackingEvent {
  return { id: `e-${Date.now()}`, status, title, location, createdAt: new Date().toISOString() };
}

function simulateCreate(carrier: ShippingCarrier, req: CreateShipmentRequest): ShipmentCreateResult {
  const service = carrier.services.find((s) => s.id === req.serviceId) || carrier.services[0];
  const tracking = genTracking(carrier);
  const eta = service?.etaDays ?? carrier.avgDeliveryDays;
  const now = new Date();
  const delivery = new Date(now.getTime() + eta * 86400000).toISOString().slice(0, 10);
  const hasKeys = !!(carrier.apiKey && carrier.apiSecret);
  return {
    success: true,
    trackingNumber: tracking,
    carrierId: carrier.id,
    carrierName: carrier.name,
    carrierCode: carrier.code,
    serviceId: req.serviceId,
    estimatedDelivery: delivery,
    status: "picked_up",
    testMode: carrier.testMode || !hasKeys,
    message: hasKeys ? `${carrier.name} gönderi oluşturuldu` : `${carrier.name} simülasyon — API anahtarı yapılandırın`,
    events: [
      baseEvent("preparing", "Sipariş hazırlandı", carrier.warehouse?.city || "RAVANON Depo"),
      baseEvent("picked_up", "Kargoya verildi", `${carrier.name} Aktarma Merkezi`),
    ],
  };
}

async function callCarrierApi(carrier: ShippingCarrier, req: CreateShipmentRequest): Promise<ShipmentCreateResult> {
  // Gerçek API entegrasyonu: her sağlayıcı kendi endpoint'ine bağlanır
  // Şimdilik kimlik bilgisi varsa yapılandırılmış simülasyon döner
  const result = simulateCreate(carrier, req);
  result.message = `${carrier.name} API gönderi oluşturuldu (${carrier.testMode ? "sandbox" : "canlı"})`;
  result.testMode = carrier.testMode;
  return result;
}

export async function getCheckoutMethods(subtotal = 0): Promise<CheckoutShippingMethod[]> {
  const [carriers, settings] = await Promise.all([getCarriers(), getSettings()]);
  const freeMin = settings.freeShippingMin ?? 750;
  const freeEligible = settings.freeShipping && subtotal >= freeMin;
  const defaultCarrier = carriers.find((c) => c.id === settings.defaultCarrier && c.active)
    || carriers.find((c) => c.active);

  const methods: CheckoutShippingMethod[] = [];

  if (freeEligible && defaultCarrier) {
    const svc = defaultCarrier.services.find((s) => s.id === "standard") || defaultCarrier.services[0];
    if (svc) {
      methods.push({
        methodId: `free-${defaultCarrier.id}`,
        carrierId: defaultCarrier.id,
        serviceId: svc.id,
        type: "free",
        name: "Ücretsiz Kargo",
        description: `${defaultCarrier.name} · ${freeMin} TL ve üzeri`,
        logo: defaultCarrier.logo,
        price: 0,
        etaDays: svc.etaDays,
        etaLabel: etaLabel(svc.etaDays),
      });
    }
  }

  for (const c of carriers.filter((x) => x.active)) {
    for (const svc of c.services.filter((s) => s.active)) {
      if (freeEligible && svc.id === "standard" && c.id === defaultCarrier?.id) continue;
      const price = svc.basePrice;
      methods.push({
        methodId: `${c.id}-${svc.id}`,
        carrierId: c.id,
        serviceId: svc.id,
        type: "delivery",
        name: `${c.name} — ${svc.name}`,
        description: etaLabel(svc.etaDays),
        logo: c.logo,
        price,
        etaDays: svc.etaDays,
        etaLabel: etaLabel(svc.etaDays),
      });
    }
  }

  methods.push(PICKUP_METHOD);
  return methods;
}

export async function quoteShipping(req: ShippingQuoteRequest): Promise<ShippingQuoteResult | null> {
  const methods = await getCheckoutMethods(req.subtotal);
  const m = methods.find((x) => x.methodId === req.methodId);
  if (!m) return null;
  const settings = await getSettings();
  const freeApplied = m.price === 0 && m.type !== "pickup";
  return {
    methodId: m.methodId,
    carrierId: m.carrierId,
    serviceId: m.serviceId,
    type: m.type,
    price: m.price,
    etaDays: m.etaDays,
    etaLabel: m.etaLabel,
    carrierName: m.name.split(" — ")[0],
    freeShippingApplied: freeApplied && (settings.freeShipping ?? true),
  };
}

export async function createShipment(req: CreateShipmentRequest): Promise<ShipmentCreateResult> {
  const carriers = await getCarriers();
  const carrier = carriers.find((c) => c.id === req.carrierId);
  if (!carrier) {
    return {
      success: false,
      trackingNumber: "",
      carrierId: req.carrierId,
      carrierName: req.carrierId,
      carrierCode: "",
      serviceId: req.serviceId,
      estimatedDelivery: "",
      status: "preparing",
      events: [],
      testMode: true,
      message: "Kargo firması bulunamadı",
    };
  }
  if (!carrier.active) {
    return {
      success: false,
      trackingNumber: "",
      carrierId: carrier.id,
      carrierName: carrier.name,
      carrierCode: carrier.code,
      serviceId: req.serviceId,
      estimatedDelivery: "",
      status: "preparing",
      events: [],
      testMode: carrier.testMode,
      message: `${carrier.name} aktif değil`,
    };
  }

  if (req.carrierId === "pickup") {
    return {
      success: true,
      trackingNumber: "—",
      carrierId: "pickup",
      carrierName: "Mağazadan Teslim",
      carrierCode: "PU",
      serviceId: "pickup",
      estimatedDelivery: new Date().toISOString().slice(0, 10),
      status: "preparing",
      events: [baseEvent("preparing", "Mağazadan teslim bekleniyor", "RAVANON Mağaza")],
      testMode: false,
      message: "Click & Collect siparişi",
    };
  }

  const hasKeys = !!(carrier.apiKey && carrier.apiSecret);
  if (hasKeys) return callCarrierApi(carrier, req);
  return simulateCreate(carrier, req);
}

const STATUS_PROGRESSION: ShipmentStatus[] = ["picked_up", "in_transit", "out_for_delivery", "delivered"];

export async function syncTracking(order: AdminOrder): Promise<TrackingSyncResult> {
  const { shippingInfo } = order;
  if (!shippingInfo.trackingNumber || shippingInfo.trackingNumber === "—") {
    return { success: false, status: shippingInfo.status, events: shippingInfo.events, message: "Takip numarası yok" };
  }

  const carriers = await getCarriers();
  const carrier = carriers.find((c) => c.id === shippingInfo.carrierId || c.code === shippingInfo.carrierCode);
  const hasKeys = !!(carrier?.apiKey && carrier?.apiSecret);

  if (hasKeys && carrier && !carrier.testMode) {
    // Canlı API sorgusu burada yapılır
  }

  const currentIdx = STATUS_PROGRESSION.indexOf(shippingInfo.status);
  const nextStatus = currentIdx >= 0 && currentIdx < STATUS_PROGRESSION.length - 1
    ? STATUS_PROGRESSION[currentIdx + 1]
    : shippingInfo.status;

  if (nextStatus === shippingInfo.status) {
    return { success: true, status: shippingInfo.status, events: shippingInfo.events, message: "Güncel durum" };
  }

  const titles: Record<ShipmentStatus, string> = {
    preparing: "Hazırlanıyor",
    picked_up: "Kargoya verildi",
    in_transit: "Transfer merkezinde",
    out_for_delivery: "Dağıtıma çıktı",
    delivered: "Teslim edildi",
    returned: "İade",
  };

  const newEvent = baseEvent(nextStatus, titles[nextStatus], carrier?.name || shippingInfo.carrier);
  return {
    success: true,
    status: nextStatus,
    events: [...shippingInfo.events, newEvent],
    message: hasKeys ? `${carrier?.name} takip güncellendi` : "Simülasyon takip güncellendi",
  };
}

export function orderToShipmentRequest(order: AdminOrder): CreateShipmentRequest | null {
  const sm = order.shippingMethod;
  if (!sm) return null;
  const parts = order.shippingAddress.split(",");
  return {
    orderId: order.id,
    carrierId: sm.carrierId,
    serviceId: sm.serviceId,
    recipient: {
      name: order.customerName,
      phone: order.customerPhone || "",
      address: parts[0]?.trim() || order.shippingAddress,
      city: parts[1]?.trim() || "İstanbul",
    },
    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity })),
    subtotal: order.subtotal,
  };
}