import fs from "fs/promises";
import type { Campaign } from "@/types/admin";
import { CAMPAIGNS_JSON } from "./paths";
import { syncCampaignsToDataJs } from "./sync";
import { MOCK_CAMPAIGNS } from "@/lib/mock/campaigns";

interface CampaignsFile {
  version: number;
  updatedAt: string;
  campaigns: Campaign[];
}

async function read(): Promise<CampaignsFile> {
  try {
    const data = JSON.parse(await fs.readFile(CAMPAIGNS_JSON, "utf8")) as CampaignsFile;
    if (!data.campaigns?.length) {
      data.campaigns = MOCK_CAMPAIGNS;
      await write(data);
    }
    return data;
  } catch {
    const seed: CampaignsFile = { version: 1, updatedAt: new Date().toISOString(), campaigns: MOCK_CAMPAIGNS };
    await write(seed);
    return seed;
  }
}

async function write(data: CampaignsFile) {
  data.updatedAt = new Date().toISOString();
  await fs.mkdir(CAMPAIGNS_JSON.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
  await fs.writeFile(CAMPAIGNS_JSON, JSON.stringify(data, null, 2), "utf8");
  await syncCampaignsToDataJs(data.campaigns);
}

export async function getCampaigns(): Promise<Campaign[]> {
  return (await read()).campaigns;
}

export async function getActiveDiscountCodes(): Promise<Record<string, { type: string; value: number; min: number }>> {
  const campaigns = await getCampaigns();
  const now = new Date();
  const codes: Record<string, { type: string; value: number; min: number }> = {};
  for (const c of campaigns) {
    if (!c.active) continue;
    if (c.type !== "percent" && c.type !== "fixed") continue;
    if (new Date(c.startsAt) > now || new Date(c.endsAt) < now) continue;
    codes[c.code.toUpperCase()] = { type: c.type, value: c.value, min: c.minOrder ?? 0 };
  }
  return codes;
}

export async function saveCampaign(campaign: Campaign): Promise<Campaign> {
  const file = await read();
  const idx = file.campaigns.findIndex((c) => c.id === campaign.id);
  if (idx >= 0) file.campaigns[idx] = campaign;
  else file.campaigns.push(campaign);
  await write(file);
  return campaign;
}

export async function saveAllCampaigns(campaigns: Campaign[]): Promise<Campaign[]> {
  const file = await read();
  file.campaigns = campaigns;
  await write(file);
  return campaigns;
}

export async function deleteCampaign(id: string): Promise<boolean> {
  const file = await read();
  const before = file.campaigns.length;
  file.campaigns = file.campaigns.filter((c) => c.id !== id);
  if (file.campaigns.length === before) return false;
  await write(file);
  return true;
}

export async function toggleCampaign(id: string): Promise<Campaign | null> {
  const file = await read();
  const c = file.campaigns.find((x) => x.id === id);
  if (!c) return null;
  c.active = !c.active;
  await write(file);
  return c;
}