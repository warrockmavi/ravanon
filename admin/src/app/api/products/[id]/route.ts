import { NextRequest, NextResponse } from "next/server";
import { deleteProduct, getProductById, saveProduct } from "@/lib/store/repository";
import type { AdminProduct } from "@/types/admin";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json()) as AdminProduct;
  if (Number(id) !== body.id) {
    return NextResponse.json({ error: "ID uyuşmazlığı" }, { status: 400 });
  }
  const saved = await saveProduct(body);
  return NextResponse.json({ product: saved });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteProduct(Number(id));
  if (!ok) return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  return NextResponse.json({ success: true });
}