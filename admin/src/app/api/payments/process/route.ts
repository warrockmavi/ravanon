import { NextRequest, NextResponse } from "next/server";
import { processPayment } from "@/lib/payments/gateway";
import type { PaymentProcessRequest } from "@/lib/payments/types";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as PaymentProcessRequest;
  if (!body.providerId || !body.amount || !body.orderRef || !body.customer) {
    return NextResponse.json({ error: "Eksik ödeme bilgisi" }, { status: 400 });
  }

  const result = await processPayment(body);
  const status = result.success || result.status === "pending" ? 200 : 402;
  return NextResponse.json({ payment: result }, { status });
}