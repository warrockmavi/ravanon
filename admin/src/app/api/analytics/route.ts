import { NextResponse } from "next/server";
import { getDashboardAnalytics } from "@/lib/store/analytics-repo";

export async function GET() {
  const data = await getDashboardAnalytics();
  return NextResponse.json(data);
}