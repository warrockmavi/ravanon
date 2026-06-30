import fs from "fs/promises";
import type { AdminProduct } from "@/types/admin";
import { PRODUCTS_JSON } from "./paths";
import type { ProductsFile, StoreProduct } from "./types";
import { adminToStore, storeToAdmin } from "./transform";
import { syncDataJs } from "./sync";

async function readFile(): Promise<ProductsFile> {
  try {
    const raw = await fs.readFile(PRODUCTS_JSON, "utf8");
    return JSON.parse(raw) as ProductsFile;
  } catch {
    return { version: 1, updatedAt: new Date().toISOString(), products: [] };
  }
}

async function writeFile(data: ProductsFile): Promise<void> {
  data.updatedAt = new Date().toISOString();
  await fs.mkdir(PRODUCTS_JSON.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
  await fs.writeFile(PRODUCTS_JSON, JSON.stringify(data, null, 2), "utf8");
  await syncDataJs(data.products);
}

export async function getAllProducts(): Promise<AdminProduct[]> {
  const file = await readFile();
  return file.products
    .map(storeToAdmin)
    .sort((a, b) => a.id - b.id);
}

export async function getProductById(id: number): Promise<AdminProduct | null> {
  const file = await readFile();
  const found = file.products.find((p) => p.id === id);
  return found ? storeToAdmin(found) : null;
}

export async function getStoreProducts(): Promise<{ updatedAt: string; products: StoreProduct[] }> {
  const file = await readFile();
  const active = file.products.filter((p) => p.active !== false);
  return { updatedAt: file.updatedAt, products: active };
}

export async function saveProduct(product: AdminProduct): Promise<AdminProduct> {
  const file = await readFile();
  const store = adminToStore({ ...product, updatedAt: new Date().toISOString() });
  const idx = file.products.findIndex((p) => p.id === product.id);
  if (idx >= 0) file.products[idx] = store;
  else file.products.push(store);
  await writeFile(file);
  return storeToAdmin(store);
}

export async function createProduct(product: Omit<AdminProduct, "id" | "createdAt" | "updatedAt"> & { id?: number }): Promise<AdminProduct> {
  const file = await readFile();
  const maxId = file.products.reduce((m, p) => Math.max(m, p.id), 0);
  const id = product.id ?? maxId + 1;
  const now = new Date().toISOString();
  const full: AdminProduct = {
    ...product,
    id,
    createdAt: now,
    updatedAt: now,
  } as AdminProduct;
  return saveProduct(full);
}

export async function deleteProduct(id: number): Promise<boolean> {
  const file = await readFile();
  const before = file.products.length;
  file.products = file.products.filter((p) => p.id !== id);
  if (file.products.length === before) return false;
  await writeFile(file);
  return true;
}