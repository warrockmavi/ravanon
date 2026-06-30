import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/api-guard";
import { createShipment } from "@/lib/shipping/gateway";
import { getOrderById, saveOrder } from "@/lib/store/orders-repo";
import type { CreateShipmentRequest } from "@/lib/shipping/types";

export async function POST(req: NextRequest) {
  const guard = requirePermission(req, "orders.edit");
  if (guard.error) return guard.error;

  const body = (await req.json()) as CreateShipmentRequest & { orderId: string };
  if (!body.orderId) return NextResponse.json({ error: "Sipariş ID gerekli" }, { status: 400 });

  const order = await getOrderById(body.orderId);
  if (!order) return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });

  const req2: CreateShipmentRequest = {
    orderId: order.id,
    carrierId: body.carrierId || order.shippingMethod?.carrierId || "hepsijet",
    serviceId: body.serviceId || order.shippingMethod?.serviceId || "standard",
    recipient: body.recipient || {
      name: order.customerName,
      phone: order.customerPhone || "",
      address: order.shippingAddress,
      city: "İstanbul",
    },
    items: body.items || order.items.map((i) => ({ name: i.name, quantity: i.quantity })),
    subtotal: order.subtotal,
  };

  const result = await createShipment(req2);
  if (!result.success) {
    return NextResponse.json({ error: result.message, shipment: result }, { status: 422 });
  }

  const now = new Date().toISOString();
  order.shippingInfo = {
    carrier: result.carrierName,
    carrierId: result.carrierId,
    carrierCode: result.carrierCode,
    serviceId: result.serviceId,
    trackingNumber: result.trackingNumber,
    status: result.status,
    estimatedDelivery: result.estimatedDelivery,
    labelUrl: result.labelUrl,
    events: result.events,
  };
  if (order.status === "processing" || order.status === "confirmed") {
    order.status = "shipped";
  }
  order.updatedAt = now;
  await saveOrder(order);

  return NextResponse.json({ shipment: result, order });
}