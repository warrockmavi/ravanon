import { NextRequest, NextResponse } from "next/server";
import { quoteShipping } from "@/lib/shipping/gateway";
import type { ShippingQuoteRequest } from "@/lib/shipping/types";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ShippingQuoteRequest;
  if (!body.methodId) return NextResponse.json({ error: "Kargo yöntemi gerekli" }, { status: 400 });
  const quote = await quoteShipping(body);
  if (!quote) return NextResponse.json({ error: "Geçersiz kargo yöntemi" }, { status: 404 });
  return NextResponse.json({ quote });
}