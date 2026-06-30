import type { AdminOrder, Campaign, ClubTierConfig } from "@/types/admin";
import type { ClubSettings } from "@/lib/store/club-repo";

export async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await fetch("/api/campaigns", { cache: "no-store" });
  if (!res.ok) throw new Error("Kampanyalar yüklenemedi");
  return (await res.json()).campaigns;
}

export async function saveCampaigns(campaigns: Campaign[]): Promise<Campaign[]> {
  const res = await fetch("/api/campaigns", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaigns }),
  });
  if (!res.ok) throw new Error("Kampanyalar kaydedilemedi");
  return (await res.json()).campaigns;
}

export async function toggleCampaignApi(id: string): Promise<Campaign> {
  const res = await fetch(`/api/campaigns/${id}`, { method: "PATCH" });
  if (!res.ok) throw new Error("Kampanya güncellenemedi");
  return (await res.json()).campaign;
}

export async function fetchClub(): Promise<{ tiers: ClubTierConfig[]; settings: ClubSettings }> {
  const res = await fetch("/api/club", { cache: "no-store" });
  if (!res.ok) throw new Error("Club verisi yüklenemedi");
  return res.json();
}

export async function saveClubApi(tiers: ClubTierConfig[], settings: ClubSettings) {
  const res = await fetch("/api/club", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tiers, settings }),
  });
  if (!res.ok) throw new Error("Club ayarları kaydedilemedi");
  return res.json();
}

export async function fetchOrders(): Promise<AdminOrder[]> {
  const res = await fetch("/api/orders", { cache: "no-store" });
  if (!res.ok) throw new Error("Siparişler yüklenemedi");
  return (await res.json()).orders;
}

export async function saveOrderApi(order: AdminOrder): Promise<AdminOrder> {
  const res = await fetch(`/api/orders/${order.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error("Sipariş kaydedilemedi");
  return (await res.json()).order;
}