import { NextResponse } from "next/server";
import { getFullStore } from "@/lib/store/index";

/** Mağaza sitesi için tüm canlı veri */
export async function GET() {
  const data = await getFullStore();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}