import { NextRequest, NextResponse } from "next/server";
import { getPaymentProviders, savePaymentProviders, togglePaymentProvider } from "@/lib/store/payments-repo";
import { getDashboardAnalytics } from "@/lib/store/analytics-repo";

export async function GET() {
  const [providers, analytics] = await Promise.all([
    getPaymentProviders(),
    getDashboardAnalytics(),
  ]);
  return NextResponse.json({
    providers,
    transactions: analytics.transactions,
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (body.action === "toggle" && body.id) {
    const provider = await togglePaymentProvider(body.id);
    if (!provider) return NextResponse.json({ error: "Sağlayıcı bulunamadı" }, { status: 404 });
    return NextResponse.json({ provider });
  }
  if (body.providers) {
    const providers = await savePaymentProviders(body.providers);
    return NextResponse.json({ providers });
  }
  return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
}