import { NextRequest, NextResponse } from "next/server";
import { getOrderById, saveOrder } from "@/lib/store/orders-repo";
import type { AdminOrder } from "@/types/admin";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json()) as AdminOrder;
  if (body.id !== id) return NextResponse.json({ error: "ID uyuşmazlığı" }, { status: 400 });
  const saved = await saveOrder(body);
  return NextResponse.json({ order: saved });
}