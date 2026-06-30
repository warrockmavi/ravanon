import type { AdminProduct } from "@/types/admin";
import type { StoreProduct } from "./types";

export function adminToStore(p: AdminProduct): StoreProduct {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    rating: p.rating,
    reviews: p.reviews,
    skinType: p.skinTypes ?? [],
    vegan: p.vegan,
    crueltyFree: p.crueltyFree,
    bestseller: p.bestseller,
    new: p.new,
    flash: p.flash,
    routineRole: p.routineRole || undefined,
    tags: p.tags ?? [],
    description: p.description,
    ingredients: p.ingredients,
    badge: p.badge,
    stock: p.stock,
    active: p.active,
    sku: p.sku,
    images: p.images?.length ? p.images : undefined,
    howToUse: p.howToUse,
    spf: p.spf,
    volume: p.volume,
    shade: p.shade,
    kBeauty: p.kBeauty || undefined,
    cleanBeauty: p.cleanBeauty || undefined,
    collections: p.collections?.length ? p.collections : undefined,
    variants: p.variants?.length ? p.variants : undefined,
    updatedAt: p.updatedAt,
  };
}

export function storeToAdmin(p: StoreProduct): AdminProduct {
  const categoryLabels: Record<string, string> = {
    makyaj: "Makyaj",
    "cilt-bakimi": "Cilt Bakımı",
    "sac-bakimi": "Saç Bakımı",
    parfum: "Parfüm",
    "vucut-bakimi": "Vücut Bakımı",
    tirnak: "Tırnak",
    "erkek-bakim": "Erkek Bakım",
    aksesuar: "Aksesuar & Araç",
  };
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    brandId: "",
    category: p.category as AdminProduct["category"],
    categoryLabel: categoryLabels[p.category] ?? p.category,
    description: p.description ?? "",
    ingredients: p.ingredients ?? "",
    howToUse: p.howToUse,
    skinTypes: (p.skinType ?? []) as AdminProduct["skinTypes"],
    tags: p.tags ?? [],
    routineRole: (p.routineRole as AdminProduct["routineRole"]) || undefined,
    spf: p.spf,
    volume: p.volume,
    shade: p.shade,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    stock: p.stock ?? 0,
    sku: p.sku ?? `RVN-${p.id}`,
    rating: p.rating,
    reviews: p.reviews,
    vegan: p.vegan ?? false,
    crueltyFree: p.crueltyFree ?? true,
    cleanBeauty: p.cleanBeauty ?? false,
    kBeauty: p.kBeauty ?? false,
    bestseller: p.bestseller ?? false,
    new: p.new ?? false,
    flash: p.flash ?? false,
    badge: p.badge,
    active: p.active !== false,
    collections: p.collections ?? [],
    images: p.images ?? [],
    variants: p.variants ?? [],
    createdAt: p.updatedAt ?? new Date().toISOString(),
    updatedAt: p.updatedAt ?? new Date().toISOString(),
  };
}

export function storeProductToJsLine(p: StoreProduct): string {
  const fields: string[] = [
    `id: ${p.id}`,
    `name: ${jsStr(p.name)}`,
    `brand: ${jsStr(p.brand)}`,
    `category: ${jsStr(p.category)}`,
    `price: ${p.price}`,
    `originalPrice: ${p.originalPrice == null ? "null" : p.originalPrice}`,
    `rating: ${p.rating}`,
    `reviews: ${p.reviews}`,
    `skinType: ${jsArr(p.skinType)}`,
    `vegan: ${p.vegan}`,
    `crueltyFree: ${p.crueltyFree}`,
    `bestseller: ${p.bestseller}`,
    `new: ${p.new}`,
    `flash: ${p.flash}`,
  ];
  if (p.routineRole) fields.push(`routineRole: ${jsStr(p.routineRole)}`);
  if (p.tags?.length) fields.push(`tags: ${jsArr(p.tags)}`);
  if (p.description) fields.push(`description: ${jsStr(p.description)}`);
  if (p.ingredients) fields.push(`ingredients: ${jsStr(p.ingredients)}`);
  if (p.badge) fields.push(`badge: ${jsStr(p.badge)}`);
  if (p.bundle) fields.push(`bundle: true`);
  if (p.stock != null) fields.push(`stock: ${p.stock}`);
  if (p.active === false) fields.push(`active: false`);
  if (p.sku) fields.push(`sku: ${jsStr(p.sku)}`);
  if (p.howToUse) fields.push(`howToUse: ${jsStr(p.howToUse)}`);
  if (p.spf) fields.push(`spf: ${p.spf}`);
  if (p.volume) fields.push(`volume: ${jsStr(p.volume)}`);
  if (p.shade) fields.push(`shade: ${jsStr(p.shade)}`);
  if (p.kBeauty) fields.push(`kBeauty: true`);
  if (p.cleanBeauty) fields.push(`cleanBeauty: true`);
  if (p.images?.length) fields.push(`images: ${jsArr(p.images)}`);
  if (p.collections?.length) fields.push(`collections: ${jsArr(p.collections)}`);
  return `    { ${fields.join(", ")} }`;
}

function jsStr(s: string) {
  return `'${s.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

function jsArr(arr: string[]) {
  return `[${arr.map(jsStr).join(", ")}]`;
}