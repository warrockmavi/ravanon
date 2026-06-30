import { NextRequest, NextResponse } from "next/server";
import { deleteCampaign, saveCampaign, toggleCampaign } from "@/lib/store/campaigns-repo";
import type { Campaign } from "@/types/admin";

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updated = await toggleCampaign(id);
  if (!updated) return NextResponse.json({ error: "Kampanya bulunamadı" }, { status: 404 });
  return NextResponse.json({ campaign: updated });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json()) as Campaign;
  const saved = await saveCampaign({ ...body, id });
  return NextResponse.json({ campaign: saved });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteCampaign(id);
  if (!ok) return NextResponse.json({ error: "Kampanya bulunamadı" }, { status: 404 });
  return NextResponse.json({ success: true });
}