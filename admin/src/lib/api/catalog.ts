import type { Brand, Category, Collection } from "@/types/admin";

export async function fetchCatalog() {
  const res = await fetch("/api/catalog", { cache: "no-store" });
  if (!res.ok) throw new Error("Katalog yüklenemedi");
  return res.json() as Promise<{
    brands: Brand[];
    categories: Category[];
    collections: Collection[];
    totalProducts: number;
  }>;
}

export async function saveCatalogItem(type: "brand" | "category" | "collection", data: Brand | Category | Collection) {
  const res = await fetch("/api/catalog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, data }),
  });
  if (!res.ok) throw new Error("Kayıt başarısız");
  return (await res.json()).item;
}

export async function deleteCatalogItem(type: "brand" | "collection", id: string) {
  const res = await fetch(`/api/catalog?type=${type}&id=${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Silme başarısız");
}