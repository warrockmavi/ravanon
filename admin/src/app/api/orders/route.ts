import { NextRequest, NextResponse } from "next/server";
import { createStorefrontOrder, getOrders } from "@/lib/store/orders-repo";

export async function GET() {
  const orders = await getOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const order = await createStorefrontOrder(body);
  return NextResponse.json({ order }, { status: 201 });
}