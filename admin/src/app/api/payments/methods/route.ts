import { NextResponse } from "next/server";
import { getCheckoutPaymentMethods } from "@/lib/payments/gateway";
import { getBankAccount } from "@/lib/store/payments-repo";

export async function GET() {
  const [methods, bank] = await Promise.all([getCheckoutPaymentMethods(), getBankAccount()]);
  return NextResponse.json({ methods, bankAccount: bank });
}