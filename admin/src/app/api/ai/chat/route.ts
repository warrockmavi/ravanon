import { NextRequest, NextResponse } from "next/server";
import { processAIChat } from "@/lib/ai/engine";
import { getAIConfig } from "@/lib/ai/config-repo";
import { addLog } from "@/lib/ai/logs-repo";

export async function POST(req: NextRequest) {
  const config = await getAIConfig();
  if (!config.enabled) {
    return NextResponse.json({ error: "AI danışman şu an kapalı" }, { status: 503 });
  }

  const body = await req.json();
  const message = String(body.message ?? "").trim();
  if (!message) return NextResponse.json({ error: "Mesaj gerekli" }, { status: 400 });

  const result = await processAIChat(message, {
    userId: body.userId,
    userEmail: body.userEmail,
    skinType: body.skinType,
  });

  if (config.logConversations) {
    await addLog({
      userId: body.userId,
      userEmail: body.userEmail,
      userName: body.userName,
      message,
      response: result.response,
      intent: result.intent,
      productIds: result.products.map((p) => p.id),
    });
  }

  return NextResponse.json(result);
}