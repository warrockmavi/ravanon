import { NextRequest, NextResponse } from "next/server";
import { getAIConfig, saveAIConfig } from "@/lib/ai/config-repo";
import type { AIConfig } from "@/lib/ai/config-repo";

export async function GET() {
  return NextResponse.json(await getAIConfig());
}

export async function PUT(req: NextRequest) {
  const body = (await req.json()) as AIConfig;
  const saved = await saveAIConfig(body);
  return NextResponse.json(saved);
}