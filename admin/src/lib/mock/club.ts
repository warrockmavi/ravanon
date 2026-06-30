import type { ClubTierConfig } from "@/types/admin";

export const MOCK_CLUB_TIERS: ClubTierConfig[] = [
  {
    id: "bronze",
    name: "Bronze",
    minPoints: 0,
    pointRate: 10,
    birthdayDiscount: 5,
    color: "#CD7F32",
    benefits: ["Her 10 TL'de 1 puan", "%5 doğum günü indirimi"],
    memberCount: 644,
  },
  {
    id: "silver",
    name: "Silver",
    minPoints: 500,
    pointRate: 8,
    birthdayDiscount: 10,
    color: "#C0C0C0",
    benefits: ["Her 8 TL'de 1 puan", "%10 doğum günü indirimi", "Ücretsiz kargo 500 TL+"],
    memberCount: 312,
  },
  {
    id: "gold",
    name: "Gold",
    minPoints: 1500,
    pointRate: 6,
    birthdayDiscount: 15,
    color: "#C9A96E",
    benefits: ["Her 6 TL'de 1 puan", "%15 doğum günü indirimi", "Öncelikli destek", "Erken erişim kampanyaları"],
    memberCount: 187,
  },
  {
    id: "platinum",
    name: "Platinum",
    minPoints: 5000,
    pointRate: 4,
    birthdayDiscount: 25,
    color: "#E8B4B8",
    benefits: ["Her 4 TL'de 1 puan", "%25 doğum günü indirimi", "VIP etkinlikler", "Özel hediye paketleri", "Kişisel güzellik danışmanı"],
    memberCount: 60,
  },
];

export const CLUB_SETTINGS = {
  welcomeBonus: 100,
  pointExpiryMonths: 24,
  minRedeemPoints: 100,
  redeemRate: 10,
  autoTierUpgrade: true,
};