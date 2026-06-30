import { NextRequest, NextResponse } from "next/server";
import { getOrderById, saveOrder } from "@/lib/store/orders-repo";
import { syncTracking } from "@/lib/shipping/gateway";
import { getCarriersPublic } from "@/lib/store/shipping-repo";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  const tracking = req.nextUrl.searchParams.get("tracking");
  if (!orderId && !tracking) {
    return NextResponse.json({ error: "orderId veya tracking gerekli" }, { status: 400 });
  }

  if (orderId) {
    const order = await getOrderById(orderId);
    if (!order) return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    const carriers = await getCarriersPublic();
    const carrier = carriers.find((c) => c.id === order.shippingInfo.carrierId || c.code === order.shippingInfo.carrierCode);
    const trackingUrl = carrier && order.shippingInfo.trackingNumber !== "—"
      ? `${carrier.trackingUrl}${order.shippingInfo.trackingNumber}`
      : null;
    return NextResponse.json({
      orderId: order.id,
      carrier: order.shippingInfo.carrier,
      trackingNumber: order.shippingInfo.trackingNumber,
      status: order.shippingInfo.status,
      estimatedDelivery: order.shippingInfo.estimatedDelivery,
      events: order.shippingInfo.events,
      trackingUrl,
    });
  }

  return NextResponse.json({ error: "Sadece orderId destekleniyor" }, { status: 400 });
}