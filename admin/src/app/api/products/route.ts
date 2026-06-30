import { NextRequest, NextResponse } from "next/server";
import { createProduct, getAllProducts } from "@/lib/store/repository";
import type { AdminProduct } from "@/types/admin";

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as AdminProduct;
  const created = await createProduct(body);
  return NextResponse.json({ product: created }, { status: 201 });
}