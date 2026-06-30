import { NextRequest, NextResponse } from "next/server";
import { getCheckoutMethods } from "@/lib/shipping/gateway";

export async function GET(req: NextRequest) {
  const subtotal = Number(req.nextUrl.searchParams.get("subtotal") || 0);
  const methods = await getCheckoutMethods(subtotal);
  return NextResponse.json({ methods });
}