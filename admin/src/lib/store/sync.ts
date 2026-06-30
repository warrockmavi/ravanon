import fs from "fs/promises";
import type { Campaign, ClubTierConfig } from "@/types/admin";
import { DATA_JS } from "./paths";
import type { StoreProduct } from "./types";
import { storeProductToJsLine } from "./transform";
import type { ClubSettings } from "./club-repo";

function jsStr(s: string) {
  return `'${s.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

export async function syncDataJs(products: StoreProduct[]): Promise<void> {
  const active = products.filter((p) => p.active !== false);
  const lines = active.map(storeProductToJsLine).join(",\n");
  const block = `  products: [\n${lines}\n  ]`;
  let content = await fs.readFile(DATA_JS, "utf8");
  const replaced = content.replace(/products:\s*\[[\s\S]*?\n  \]/, block);
  if (replaced === content) throw new Error("data.js products bloğu bulunamadı");
  await fs.writeFile(DATA_JS, replaced, "utf8");
}

export async function syncCampaignsToDataJs(campaigns: Campaign[]): Promise<void> {
  const now = new Date();
  const active = campaigns.filter(
    (c) => c.active && (c.type === "percent" || c.type === "fixed") &&
      new Date(c.startsAt) <= now && new Date(c.endsAt) >= now
  );
  const lines = active.map(
    (c) => `    ${c.code.toUpperCase()}: { type: ${jsStr(c.type)}, value: ${c.value}, min: ${c.minOrder ?? 0} }`
  );
  const block = `  discountCodes: {\n${lines.join(",\n")}\n  }`;
  let content = await fs.readFile(DATA_JS, "utf8");
  const replaced = content.replace(/discountCodes:\s*\{[\s\S]*?\n  \}/, block);
  if (replaced === content) throw new Error("data.js discountCodes bloğu bulunamadı");
  await fs.writeFile(DATA_JS, replaced, "utf8");
}

export async function syncClubToDataJs(tiers: ClubTierConfig[], settings: ClubSettings): Promise<void> {
  const tierLines = tiers.map((t) => {
    const benefits = t.benefits.map((b) => jsStr(b)).join(", ");
    return `    { id: ${jsStr(t.id)}, name: ${jsStr(t.name)}, minPoints: ${t.minPoints}, pointRate: ${t.pointRate}, color: ${jsStr(t.color)}, benefits: [${benefits}] }`;
  });
  const tierBlock = `  clubTiers: [\n${tierLines.join(",\n")}\n  ]`;
  let content = await fs.readFile(DATA_JS, "utf8");
  let replaced = content.replace(/clubTiers:\s*\[[\s\S]*?\n  \]/, tierBlock);
  if (replaced === content) throw new Error("data.js clubTiers bloğu bulunamadı");

  const settingsBlock = `  clubSettings: { welcomeBonus: ${settings.welcomeBonus}, freeShippingMin: ${settings.freeShippingMin}, minRedeemPoints: ${settings.minRedeemPoints}, redeemRate: ${settings.redeemRate}, autoTierUpgrade: ${settings.autoTierUpgrade} }`;
  if (/clubSettings:\s*\{/.test(replaced)) {
    replaced = replaced.replace(/clubSettings:\s*\{[^}]+\}/, settingsBlock);
  } else {
    replaced = replaced.replace(tierBlock, `${tierBlock},\n${settingsBlock}`);
  }
  await fs.writeFile(DATA_JS, replaced, "utf8");
}