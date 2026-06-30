import type { Campaign } from "@/types/admin";

export const MOCK_CAMPAIGNS: Campaign[] = [
  { id: "c1", name: "Hoş Geldin İndirimi", code: "WELCOME15", type: "percent", value: 15, minOrder: 250, usageCount: 342, usageLimit: 1000, active: true, startsAt: "2026-01-01", endsAt: "2026-12-31" },
  { id: "c2", name: "Yaz Flaş İndirimi", code: "YAZ2026", type: "percent", value: 20, minOrder: 500, usageCount: 89, usageLimit: 500, active: true, startsAt: "2026-06-01", endsAt: "2026-08-31" },
  { id: "c3", name: "Ücretsiz Kargo", code: "KARGO0", type: "shipping", value: 0, minOrder: 750, usageCount: 1204, active: true, startsAt: "2026-01-01", endsAt: "2026-12-31" },
  { id: "c4", name: "Club Çift Puan", code: "CLUB2X", type: "points", value: 2, usageCount: 56, usageLimit: 200, active: true, startsAt: "2026-06-15", endsAt: "2026-07-15" },
  { id: "c5", name: "Black Friday", code: "BF2025", type: "percent", value: 30, minOrder: 1000, usageCount: 890, usageLimit: 890, active: false, startsAt: "2025-11-25", endsAt: "2025-11-30" },
];