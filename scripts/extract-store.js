const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dataJs = fs.readFileSync(path.join(root, "js/data.js"), "utf8");
const fn = new Function(`${dataJs}\nreturn RAVANON_DATA;`);
const data = fn();

const campaigns = [
  { id: "c1", name: "Hoş Geldin İndirimi", code: "WELCOME15", type: "percent", value: 15, minOrder: 0, usageCount: 342, usageLimit: 1000, active: true, startsAt: "2026-01-01", endsAt: "2026-12-31" },
  { id: "c2", name: "RAVANON20", code: "RAVANON20", type: "percent", value: 20, minOrder: 0, usageCount: 120, active: true, startsAt: "2026-01-01", endsAt: "2026-12-31" },
  { id: "c3", name: "Club Sabit İndirim", code: "CLUB50", type: "fixed", value: 50, minOrder: 300, usageCount: 89, active: true, startsAt: "2026-01-01", endsAt: "2026-12-31" },
  { id: "c4", name: "Ücretsiz Kargo", code: "KARGO0", type: "shipping", value: 0, minOrder: 750, usageCount: 1204, active: true, startsAt: "2026-01-01", endsAt: "2026-12-31" },
  { id: "c5", name: "Yaz Flaş", code: "YAZ2026", type: "percent", value: 20, minOrder: 500, usageCount: 89, usageLimit: 500, active: true, startsAt: "2026-06-01", endsAt: "2026-08-31" },
];

const club = {
  tiers: [
    { id: "bronze", name: "Bronze", minPoints: 0, pointRate: 10, birthdayDiscount: 5, color: "#CD7F32", benefits: ["Her 10 TL'de 1 puan", "%5 doğum günü indirimi"], memberCount: 644 },
    { id: "silver", name: "Silver", minPoints: 500, pointRate: 8, birthdayDiscount: 10, color: "#C0C0C0", benefits: ["Her 8 TL'de 1 puan", "%10 doğum günü indirimi", "Ücretsiz kargo 500 TL+"], memberCount: 312 },
    { id: "gold", name: "Gold", minPoints: 1500, pointRate: 6, birthdayDiscount: 15, color: "#C9A96E", benefits: ["Her 6 TL'de 1 puan", "%15 doğum günü indirimi", "Öncelikli destek", "Erken erişim kampanyaları"], memberCount: 187 },
    { id: "platinum", name: "Platinum", minPoints: 5000, pointRate: 4, birthdayDiscount: 25, color: "#E8B4B8", benefits: ["Her 4 TL'de 1 puan", "%25 doğum günü indirimi", "VIP etkinlikler", "Özel hediye paketleri", "Kişisel güzellik danışmanı"], memberCount: 60 },
  ],
  settings: { welcomeBonus: 100, pointExpiryMonths: 24, minRedeemPoints: 100, redeemRate: 10, autoTierUpgrade: true, freeShippingMin: 750 },
};

const outDir = path.join(root, "data");
fs.mkdirSync(outDir, { recursive: true });

const now = new Date().toISOString();

fs.writeFileSync(path.join(outDir, "campaigns.json"), JSON.stringify({ version: 1, updatedAt: now, campaigns }, null, 2));
fs.writeFileSync(path.join(outDir, "club.json"), JSON.stringify({ version: 1, updatedAt: now, ...club }, null, 2));

// Seed orders from existing mock - read as text and skip, use API seed instead
const ordersSeed = { version: 1, updatedAt: now, orders: [] };
if (!fs.existsSync(path.join(outDir, "orders.json"))) {
  fs.writeFileSync(path.join(outDir, "orders.json"), JSON.stringify(ordersSeed, null, 2));
}

console.log("Extracted campaigns.json and club.json");
console.log("discountCodes from data.js:", Object.keys(data.discountCodes));