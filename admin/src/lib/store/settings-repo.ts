import fs from "fs/promises";
import { SETTINGS_JSON } from "./paths";
import { getClubData, saveClub } from "./club-repo";

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storeUrl: string;
  freeShipping: boolean;
  freeShippingMin: number;
  defaultCarrier: string;
  orderNotifications: boolean;
  lowStockAlerts: boolean;
  paymentErrorAlerts: boolean;
  weeklyReportEmail: boolean;
  sessionHours: number;
  twoFactorEnabled: boolean;
}

const DEFAULT: StoreSettings = {
  storeName: "RAVANON",
  storeEmail: "destek@ravanon.com",
  storeUrl: "http://localhost:8765",
  freeShipping: true,
  freeShippingMin: 750,
  defaultCarrier: "hepsijet",
  orderNotifications: true,
  lowStockAlerts: true,
  paymentErrorAlerts: true,
  weeklyReportEmail: false,
  sessionHours: 8,
  twoFactorEnabled: false,
};

async function read(): Promise<StoreSettings> {
  try {
    return { ...DEFAULT, ...JSON.parse(await fs.readFile(SETTINGS_JSON, "utf8")) };
  } catch {
    return DEFAULT;
  }
}

async function write(settings: StoreSettings) {
  await fs.mkdir(SETTINGS_JSON.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
  await fs.writeFile(SETTINGS_JSON, JSON.stringify(settings, null, 2), "utf8");
}

export async function getSettings(): Promise<StoreSettings> {
  const settings = await read();
  try {
    const club = await getClubData();
    if (club.settings.freeShippingMin !== settings.freeShippingMin) {
      settings.freeShippingMin = club.settings.freeShippingMin;
    }
  } catch { /* club optional */ }
  return settings;
}

export async function saveSettings(patch: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await read();
  const merged = { ...current, ...patch };
  await write(merged);

  if (patch.freeShippingMin !== undefined) {
    const club = await getClubData();
    await saveClub(club.tiers, { ...club.settings, freeShippingMin: patch.freeShippingMin });
  }

  return merged;
}