import fs from "fs/promises";
import type { ClubTierConfig } from "@/types/admin";
import { CLUB_JSON } from "./paths";
import { syncClubToDataJs } from "./sync";

export interface ClubSettings {
  welcomeBonus: number;
  pointExpiryMonths: number;
  minRedeemPoints: number;
  redeemRate: number;
  autoTierUpgrade: boolean;
  freeShippingMin: number;
}

interface ClubFile {
  version: number;
  updatedAt: string;
  tiers: ClubTierConfig[];
  settings: ClubSettings;
}

async function read(): Promise<ClubFile> {
  try {
    return JSON.parse(await fs.readFile(CLUB_JSON, "utf8")) as ClubFile;
  } catch {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      tiers: [],
      settings: { welcomeBonus: 100, pointExpiryMonths: 24, minRedeemPoints: 100, redeemRate: 10, autoTierUpgrade: true, freeShippingMin: 750 },
    };
  }
}

async function write(data: ClubFile) {
  data.updatedAt = new Date().toISOString();
  await fs.mkdir(CLUB_JSON.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
  await fs.writeFile(CLUB_JSON, JSON.stringify(data, null, 2), "utf8");
  await syncClubToDataJs(data.tiers, data.settings);
}

export async function getClubData(): Promise<ClubFile> {
  return read();
}

export async function saveClub(tiers: ClubTierConfig[], settings: ClubSettings): Promise<ClubFile> {
  const file = await read();
  file.tiers = tiers;
  file.settings = settings;
  await write(file);
  return file;
}