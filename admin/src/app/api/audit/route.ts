import { NextRequest, NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/store/audit-repo";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") || undefined;
  const limit = Number(req.nextUrl.searchParams.get("limit") || 100);
  const logs = await getAuditLogs(limit, userId);
  return NextResponse.json({ logs });
}