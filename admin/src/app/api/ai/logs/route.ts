import { NextResponse } from "next/server";
import { getAIStats, getLogs } from "@/lib/ai/logs-repo";

export async function GET() {
  const [logs, stats] = await Promise.all([getLogs(100), getAIStats()]);
  return NextResponse.json({ logs, stats });
}