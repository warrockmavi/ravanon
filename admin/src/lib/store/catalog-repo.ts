import fs from "fs/promises";
import type { Brand, Category, Collection, CosmeticCategory } from "@/types/admin";
import { CATALOG_JSON } from "./paths";
import { getStoreProducts } from "./repository";
import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_COLLECTIONS } from "@/lib/mock/catalog";

interface CatalogFile {
  version: number;
  updatedAt: string;
  brands: Brand[];
  categories: Category[];
  collections: Collection[];
}

async function read(): Promise<CatalogFile> {
  try {
    const data = JSON.parse(await fs.readFile(CATALOG_JSON, "utf8")) as CatalogFile;
    if (!data.brands?.length) {
      data.brands = MOCK_BRANDS;
      data.categories = MOCK_CATEGORIES;
      data.collections = MOCK_COLLECTIONS;
      await write(data);
    }
    return data;
  } catch {
    const seed: CatalogFile = {
      version: 1,
      updatedAt: new Date().toISOString(),
      brands: MOCK_BRANDS,
      categories: MOCK_CATEGORIES,
      collections: MOCK_COLLECTIONS,
    };
    await write(seed);
    return seed;
  }
}

async function write(data: CatalogFile) {
  data.updatedAt = new Date().toISOString();
  await fs.mkdir(CATALOG_JSON.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
  await fs.writeFile(CATALOG_JSON, JSON.stringify(data, null, 2), "utf8");
}

function mergeCounts(file: CatalogFile, products: Awaited<ReturnType<typeof getStoreProducts>>["products"]) {
  const brandCounts = new Map<string, number>();
  const catCounts = new Map<string, number>();
  const colCounts = new Map<string, number>();

  for (const p of products) {
    const bKey = p.brand.toLowerCase().replace(/\s+/g, "-");
    brandCounts.set(bKey, (brandCounts.get(bKey) || 0) + 1);
    catCounts.set(p.category, (catCounts.get(p.category) || 0) + 1);
    for (const col of p.collections || []) {
      colCounts.set(col, (colCounts.get(col) || 0) + 1);
    }
  }

  return {
    brands: file.brands.map((b) => ({ ...b, productCount: brandCounts.get(b.id) || 0 })),
    categories: file.categories.map((c) => ({ ...c, productCount: catCounts.get(c.id) || 0 })),
    collections: file.collections.map((c) => ({
      ...c,
      productCount: colCounts.get(c.id) || 0,
      active: (colCounts.get(c.id) || 0) > 0 ? true : c.active,
    })),
    totalProducts: products.length,
  };
}

export async function getCatalogSummary() {
  const [file, { products }] = await Promise.all([read(), getStoreProducts()]);
  return mergeCounts(file, products);
}

export async function getCatalogRaw() {
  return read();
}

export async function saveBrand(brand: Brand): Promise<Brand> {
  const file = await read();
  const idx = file.brands.findIndex((b) => b.id === brand.id);
  if (idx >= 0) file.brands[idx] = brand;
  else file.brands.push(brand);
  await write(file);
  return brand;
}

export async function deleteBrand(id: string): Promise<boolean> {
  const file = await read();
  const before = file.brands.length;
  file.brands = file.brands.filter((b) => b.id !== id);
  if (file.brands.length === before) return false;
  await write(file);
  return true;
}

export async function saveCategory(category: Category): Promise<Category> {
  const file = await read();
  const idx = file.categories.findIndex((c) => c.id === category.id);
  if (idx >= 0) file.categories[idx] = category;
  else file.categories.push(category);
  await write(file);
  return category;
}

export async function saveCollection(collection: Collection): Promise<Collection> {
  const file = await read();
  const idx = file.collections.findIndex((c) => c.id === collection.id);
  if (idx >= 0) file.collections[idx] = collection;
  else file.collections.push(collection);
  await write(file);
  return collection;
}

export async function deleteCollection(id: string): Promise<boolean> {
  const file = await read();
  const before = file.collections.length;
  file.collections = file.collections.filter((c) => c.id !== id);
  if (file.collections.length === before) return false;
  await write(file);
  return true;
}

export function getCategoryLabel(categories: Category[], id: CosmeticCategory) {
  return categories.find((c) => c.id === id)?.name ?? id;
}

export function getBrandName(brands: Brand[], brandId: string) {
  return brands.find((b) => b.id === brandId)?.name;
}