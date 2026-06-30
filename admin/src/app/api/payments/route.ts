import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/api-guard";
import {
  getPaymentProvidersPublic,
  getBankAccount,
  savePaymentProviders,
  saveBankAccount,
  togglePaymentProvider,
  updateProviderCredentials,
} from "@/lib/store/payments-repo";
import { getDashboardAnalytics } from "@/lib/store/analytics-repo";
import { confirmPendingPayment } from "@/lib/store/orders-repo";

export async function GET() {
  const [providers, analytics, bankAccount] = await Promise.all([
    getPaymentProvidersPublic(),
    getDashboardAnalytics(),
    getBankAccount(),
  ]);
  return NextResponse.json({
    providers,
    transactions: analytics.transactions,
    bankAccount,
  });
}

export async function PUT(req: NextRequest) {
  const guard = requirePermission(req, "settings.edit");
  if (guard.error) return guard.error;

  const body = await req.json();
  if (body.action === "toggle" && body.id) {
    const provider = await togglePaymentProvider(body.id);
    if (!provider) return NextResponse.json({ error: "Sağlayıcı bulunamadı" }, { status: 404 });
    return NextResponse.json({ provider });
  }
  if (body.action === "credentials" && body.id) {
    const provider = await updateProviderCredentials(body.id, {
      apiKey: body.apiKey,
      apiSecret: body.apiSecret,
      merchantId: body.merchantId,
      testMode: body.testMode,
    });
    if (!provider) return NextResponse.json({ error: "Sağlayıcı bulunamadı" }, { status: 404 });
    return NextResponse.json({ provider });
  }
  if (body.action === "bank" && body.bankAccount) {
    const bank = await saveBankAccount(body.bankAccount);
    return NextResponse.json({ bankAccount: bank });
  }
  if (body.action === "confirmPayment" && body.orderId) {
    const order = await confirmPendingPayment(body.orderId);
    if (!order) return NextResponse.json({ error: "Bekleyen ödeme bulunamadı" }, { status: 404 });
    return NextResponse.json({ order });
  }
  if (body.providers) {
    const providers = await savePaymentProviders(body.providers);
    return NextResponse.json({ providers });
  }
  return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
}