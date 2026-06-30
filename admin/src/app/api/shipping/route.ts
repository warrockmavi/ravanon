import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/api-guard";
import { getDashboardAnalytics } from "@/lib/store/analytics-repo";
import {
  getCarriersPublic,
  toggleCarrier,
  updateCarrierCredentials,
} from "@/lib/store/shipping-repo";
import { getOrderById, saveOrder } from "@/lib/store/orders-repo";
import { syncTracking } from "@/lib/shipping/gateway";

export async function GET() {
  const [analytics, carriers] = await Promise.all([
    getDashboardAnalytics(),
    getCarriersPublic(),
  ]);
  return NextResponse.json({
    shipments: analytics.shipments,
    carriers,
  });
}

export async function PUT(req: NextRequest) {
  const guard = requirePermission(req, "settings.edit");
  if (guard.error) return guard.error;

  const body = await req.json();
  if (body.action === "toggle" && body.id) {
    const carrier = await toggleCarrier(body.id);
    if (!carrier) return NextResponse.json({ error: "Kargo firması bulunamadı" }, { status: 404 });
    return NextResponse.json({ carrier });
  }
  if (body.action === "credentials" && body.id) {
    const carrier = await updateCarrierCredentials(body.id, {
      apiKey: body.apiKey,
      apiSecret: body.apiSecret,
      customerCode: body.customerCode,
      testMode: body.testMode,
    });
    if (!carrier) return NextResponse.json({ error: "Kargo firması bulunamadı" }, { status: 404 });
    return NextResponse.json({ carrier });
  }
  if (body.action === "syncTracking" && body.orderId) {
    const order = await getOrderById(body.orderId);
    if (!order) return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    const sync = await syncTracking(order);
    if (sync.success && sync.events.length > order.shippingInfo.events.length) {
      order.shippingInfo = {
        ...order.shippingInfo,
        status: sync.status,
        events: sync.events,
        estimatedDelivery: sync.estimatedDelivery || order.shippingInfo.estimatedDelivery,
      };
      if (sync.status === "delivered") order.status = "delivered";
      else if (sync.status !== "preparing" && order.status === "shipped") order.status = "shipped";
      await saveOrder(order);
    }
    return NextResponse.json({ sync, order });
  }
  return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
}