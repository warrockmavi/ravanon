import type { AdminProduct } from "@/types/admin";

export async function fetchProducts(): Promise<AdminProduct[]> {
  const res = await fetch("/api/products", { cache: "no-store" });
  if (!res.ok) throw new Error("Ürünler yüklenemedi");
  const data = await res.json();
  return data.products;
}

export async function fetchProduct(id: number): Promise<AdminProduct | null> {
  const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Ürün yüklenemedi");
  const data = await res.json();
  return data.product;
}

export async function saveProductApi(product: AdminProduct): Promise<AdminProduct> {
  const exists = await fetchProduct(product.id);
  const method = exists ? "PUT" : "POST";
  const url = exists ? `/api/products/${product.id}` : "/api/products";
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Ürün kaydedilemedi");
  const data = await res.json();
  return data.product;
}

export async function deleteProductApi(id: number): Promise<void> {
  const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Ürün silinemedi");
}