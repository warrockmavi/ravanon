import { NextRequest, NextResponse } from "next/server";
import { getCampaigns, saveAllCampaigns, saveCampaign } from "@/lib/store/campaigns-repo";
import type { Campaign } from "@/types/admin";

export async function GET() {
  const campaigns = await getCampaigns();
  return NextResponse.json({ campaigns });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Campaign;
  const campaign: Campaign = {
    ...body,
    id: body.id || `c${Date.now()}`,
    usageCount: body.usageCount ?? 0,
    active: body.active ?? true,
  };
  const saved = await saveCampaign(campaign);
  return NextResponse.json({ campaign: saved }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = (await req.json()) as { campaigns: Campaign[] };
  const saved = await saveAllCampaigns(body.campaigns);
  return NextResponse.json({ campaigns: saved });
}