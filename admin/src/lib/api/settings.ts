import type { StoreSettings } from "@/lib/store/settings-repo";

export async function fetchSettings(): Promise<StoreSettings> {
  const res = await fetch("/api/settings", { cache: "no-store" });
  if (!res.ok) throw new Error("Ayarlar yüklenemedi");
  return (await res.json()).settings;
}

export async function saveSettingsApi(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Ayarlar kaydedilemedi");
  return (await res.json()).settings;
}