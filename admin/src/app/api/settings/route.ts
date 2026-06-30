import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/api-guard";
import { getSettings, saveSettings } from "@/lib/store/settings-repo";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const guard = requirePermission(req, "settings.edit");
  if (guard.error) return guard.error;
  const body = await req.json();
  const settings = await saveSettings(body);
  return NextResponse.json({ settings });
}