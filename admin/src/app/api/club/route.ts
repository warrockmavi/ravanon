import { NextRequest, NextResponse } from "next/server";
import { getClubData, saveClub } from "@/lib/store/club-repo";
import type { ClubTierConfig } from "@/types/admin";
import type { ClubSettings } from "@/lib/store/club-repo";

export async function GET() {
  const data = await getClubData();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const body = (await req.json()) as { tiers: ClubTierConfig[]; settings: ClubSettings };
  const saved = await saveClub(body.tiers, body.settings);
  return NextResponse.json(saved);
}