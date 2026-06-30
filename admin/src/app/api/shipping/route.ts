import { NextRequest, NextResponse } from "next/server";
import { getDashboardAnalytics } from "@/lib/store/analytics-repo";
import { getCarriers, toggleCarrier } from "@/lib/store/shipping-repo";

export async function GET() {
  const [analytics, carriers] = await Promise.all([
    getDashboardAnalytics(),
    getCarriers(),
  ]);
  return NextResponse.json({
    shipments: analytics.shipments,
    carriers,
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (body.action === "toggle" && body.id) {
    const carrier = await toggleCarrier(body.id);
    if (!carrier) return NextResponse.json({ error: "Kargo firması bulunamadı" }, { status: 404 });
    return NextResponse.json({ carrier });
  }
  return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
}