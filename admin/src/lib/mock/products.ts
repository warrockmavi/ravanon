import type { AdminProduct } from "@/types/admin";

const NOW = "2026-06-01T10:00:00Z";

function makeProduct(
  p: Partial<AdminProduct> & Pick<AdminProduct, "id" | "name" | "brand" | "brandId" | "category" | "categoryLabel" | "price" | "stock" | "sku">
): AdminProduct {
  return {
    description: "",
    ingredients: "",
    skinTypes: [],
    tags: [],
    cleanBeauty: false,
    kBeauty: false,
    collections: [],
    images: [],
    variants: [],
    rating: 4.5,
    reviews: 0,
    vegan: false,
    crueltyFree: true,
    bestseller: false,
    new: false,
    flash: false,
    active: true,
    createdAt: NOW,
    updatedAt: NOW,
    ...p,
  };
}

export const MOCK_PRODUCTS: AdminProduct[] = [
  makeProduct({
    id: 1, name: "Niacinamide %10 + Zinc %1 Serum", brand: "The Ordinary", brandId: "b1",
    category: "cilt-bakimi", categoryLabel: "Cilt Bakımı", subcategory: "Serum",
    description: "Gözenek görünümünü azaltmaya ve cilt tonunu eşitlemeye yardımcı hafif serum.",
    ingredients: "Aqua, Niacinamide, Zinc PCA, Pentylene Glycol, Tamarindus Indica Seed Gum",
    howToUse: "Akşam temiz cilde 3-4 damla uygulayın. SPF kullanın.",
    skinTypes: ["Yağlı", "Karma", "Normal"], tags: ["gözenek", "leke", "vegan"],
    routineRole: "serum", volume: "30ml", price: 449, originalPrice: 549, stock: 124,
    sku: "RVN-TO-001", rating: 4.8, reviews: 2341, vegan: true, crueltyFree: true,
    bestseller: true, flash: true, badge: "Flaş İndirim", cleanBeauty: true,
    collections: ["clean-beauty", "gen-z-picks"], images: ["https://placehold.co/400x400/1a1a2e/C9A96E?text=Niacinamide"],
  }),
  makeProduct({
    id: 2, name: "Hyaluronic Acid Serum", brand: "The Inkey List", brandId: "b1",
    category: "cilt-bakimi", categoryLabel: "Cilt Bakımı", subcategory: "Serum",
    description: "Çoklu molekül ağırlıklı hyaluronik asit ile derin nemlendirme.",
    ingredients: "Aqua, Propanediol, Sodium Hyaluronate, Glycerin",
    skinTypes: ["Kuru", "Karma", "Hassas", "Normal"], tags: ["nem", "glass-skin"],
    routineRole: "serum", volume: "30ml", price: 389, stock: 89,
    sku: "RVN-TIL-002", rating: 4.7, reviews: 1823, vegan: true, crueltyFree: true,
    bestseller: true, cleanBeauty: true, collections: ["glass-skin"],
    images: ["https://placehold.co/400x400/1a1a2e/C9A96E?text=HA+Serum"],
  }),
  makeProduct({
    id: 6, name: "Soft Pinch Liquid Blush - Hope", brand: "Rare Beauty", brandId: "b2",
    category: "makyaj", categoryLabel: "Makyaj", subcategory: "Allık",
    description: "Hafif, doğal bitişli sıvı allık. TikTok'ta viral.",
    ingredients: "Dimethicone, Isododecane, Synthetic Fluorphlogopite",
    skinTypes: ["Kuru", "Karma", "Normal"], tags: ["viral", "tiktok", "doğal"],
    routineRole: "makeup", shade: "Hope", volume: "7.5ml", price: 1099, stock: 45,
    sku: "RVN-RB-006", rating: 4.9, reviews: 7234, vegan: true, crueltyFree: true,
    bestseller: true, new: true, badge: "Yeni", collections: ["viral-tiktok", "gen-z-picks", "soft-glam"],
    images: ["https://placehold.co/400x400/1a1a2e/E8B4B8?text=Soft+Pinch"],
    variants: [
      { id: "v1", name: "Hope", sku: "RVN-RB-006-H", price: 1099, stock: 20, shade: "Hope" },
      { id: "v2", name: "Joy", sku: "RVN-RB-006-J", price: 1099, stock: 15, shade: "Joy" },
      { id: "v3", name: "Encourage", sku: "RVN-RB-006-E", price: 1099, stock: 10, shade: "Encourage" },
    ],
  }),
  makeProduct({
    id: 7, name: "Brazilian Bum Bum Cream", brand: "Sol de Janeiro", brandId: "b8",
    category: "vucut-bakimi", categoryLabel: "Vücut Bakımı", subcategory: "Vücut Kremi",
    description: "Cupuaçu yağı ve guaraná özü ile zenginleştirilmiş vücut kremi.",
    ingredients: "Aqua, Caprylic/Capric Triglyceride, Theobroma Grandiflorum Seed Butter",
    skinTypes: ["Kuru", "Normal"], tags: ["nem", "parlak"], volume: "240ml",
    price: 899, originalPrice: 1099, stock: 67, sku: "RVN-SDJ-007", rating: 4.8, reviews: 8901,
    crueltyFree: true, bestseller: true, flash: true, badge: "Flaş İndirim",
    collections: ["gen-z-picks"], images: ["https://placehold.co/400x400/1a1a2e/C9A96E?text=Bum+Bum"],
  }),
  makeProduct({
    id: 17, name: "Pillow Talk Lipstick", brand: "Charlotte Tilbury", brandId: "b5",
    category: "makyaj", categoryLabel: "Makyaj", subcategory: "Ruj",
    description: "İkonik nude-pembe ton, mat-satin bitiş.",
    ingredients: "Octyldodecanol, Polyethylene, Ricinus Communis Seed Oil",
    skinTypes: ["Normal", "Kuru"], tags: ["soft-glam"], routineRole: "makeup",
    shade: "Pillow Talk", volume: "3.5g", price: 1699, stock: 32,
    sku: "RVN-CT-017", rating: 4.9, reviews: 4102, crueltyFree: true,
    bestseller: true, badge: "İkon", collections: ["soft-glam"],
    images: ["https://placehold.co/400x400/1a1a2e/E8B4B8?text=Pillow+Talk"],
  }),
  makeProduct({
    id: 38, name: "Advanced Snail 96 Mucin Power Essence", brand: "COSRX", brandId: "b3",
    category: "cilt-bakimi", categoryLabel: "Cilt Bakımı", subcategory: "Essence",
    description: "%96 salyangoz mukusu ile yoğun onarım ve nem.",
    ingredients: "Snail Secretion Filtrate, Betaine, Sodium Hyaluronate",
    howToUse: "Tonik sonrası pamukla veya avuç içiyle uygulayın.",
    skinTypes: ["Kuru", "Karma", "Hassas", "Normal"], tags: ["k-beauty", "nem", "hanbang"],
    routineRole: "serum", volume: "100ml", price: 599, stock: 156,
    sku: "RVN-CX-038", rating: 4.9, reviews: 15200, crueltyFree: true,
    bestseller: true, new: true, kBeauty: true, badge: "K-Beauty",
    collections: ["k-beauty", "glass-skin"], images: ["https://placehold.co/400x400/1a1a2e/C9A96E?text=Snail+96"],
  }),
  makeProduct({
    id: 39, name: "Heartleaf 77% Soothing Toner", brand: "Anua", brandId: "b3",
    category: "cilt-bakimi", categoryLabel: "Cilt Bakımı", subcategory: "Tonik",
    description: "%77 heartleaf özü ile yatıştırıcı ve dengeleyici tonik.",
    ingredients: "Houttuynia Cordata Extract, Aqua, Glycerin",
    skinTypes: ["Hassas", "Yağlı", "Karma"], tags: ["k-beauty", "hassas", "akne"],
    routineRole: "toner", volume: "250ml", price: 449, stock: 0,
    sku: "RVN-AN-039", rating: 4.8, reviews: 9800, vegan: true, crueltyFree: true,
    bestseller: true, new: true, kBeauty: true, badge: "Tükendi",
    collections: ["k-beauty", "clean-beauty"], images: ["https://placehold.co/400x400/1a1a2e/C9A96E?text=Heartleaf"],
  }),
  makeProduct({
    id: 48, name: "Relief Sun Rice + Probiotics SPF50+", brand: "Beauty of Joseon", brandId: "b4",
    category: "cilt-bakimi", categoryLabel: "Cilt Bakımı", subcategory: "Güneş Koruyucu",
    description: "Pirinç ve probiyotikli hafif güneş koruyucu, beyaz iz bırakmaz.",
    ingredients: "Oryza Sativa Extract, Bacillus Ferment, Niacinamide",
    skinTypes: ["Kuru", "Karma", "Hassas", "Normal"], tags: ["spf", "k-beauty", "hanbang"],
    routineRole: "spf", spf: 50, volume: "50ml", price: 649, originalPrice: 749, stock: 78,
    sku: "RVN-BOJ-048", rating: 4.9, reviews: 18500, vegan: true, crueltyFree: true,
    bestseller: true, new: true, flash: true, kBeauty: true, cleanBeauty: true, badge: "SPF50+",
    collections: ["k-beauty", "clean-beauty"], images: ["https://placehold.co/400x400/1a1a2e/C9A96E?text=Relief+Sun"],
  }),
  makeProduct({
    id: 24, name: "Chance Eau Tendre EDT", brand: "Chanel", brandId: "b7",
    category: "parfum", categoryLabel: "Parfüm", subcategory: "EDT",
    description: "Çiçeksi ve narin, genç ve feminen koku.",
    ingredients: "Alcohol, Parfum, Aqua, Linalool, Limonene",
    skinTypes: ["Normal"], tags: ["lüks"], volume: "50ml", price: 4299, stock: 18,
    sku: "RVN-CH-024", rating: 4.9, reviews: 2100, badge: "Lüks",
    images: ["https://placehold.co/400x400/1a1a2e/E8B4B8?text=Chance"],
  }),
  makeProduct({
    id: 22, name: "Repair & Protect Shampoo", brand: "Moroccanoil", brandId: "b6",
    category: "sac-bakimi", categoryLabel: "Saç Bakımı", subcategory: "Şampuan",
    description: "Argan yağı ile onarıcı ve koruyucu şampuan.",
    ingredients: "Aqua, Sodium Lauroyl Sarcosinate, Argania Spinosa Kernel Oil",
    skinTypes: ["Kuru", "Normal"], tags: ["nem"], volume: "250ml", price: 749, stock: 54,
    sku: "RVN-MO-022", rating: 4.6, reviews: 1890, crueltyFree: true, active: false,
    images: ["https://placehold.co/400x400/1a1a2e/C9A96E?text=Shampoo"],
  }),
];

export function getProductKpis(products: AdminProduct[]) {
  return {
    total: products.length,
    active: products.filter((p) => p.active).length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock < 30).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    kBeauty: products.filter((p) => p.kBeauty).length,
    vegan: products.filter((p) => p.vegan).length,
  };
}

export function getProductById(id: number): AdminProduct | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

export const EMPTY_PRODUCT: Omit<AdminProduct, "id"> = {
  name: "", brand: "", brandId: "", category: "cilt-bakimi", categoryLabel: "Cilt Bakımı",
  description: "", ingredients: "", skinTypes: [], tags: [], collections: [], images: [], variants: [],
  price: 0, stock: 0, sku: "", rating: 0, reviews: 0,
  vegan: false, crueltyFree: true, cleanBeauty: false, kBeauty: false,
  bestseller: false, new: false, flash: false, active: true,
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
};