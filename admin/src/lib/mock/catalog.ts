import type { Brand, Category, Collection } from "@/types/admin";

export const MOCK_BRANDS: Brand[] = [
  { id: "b1", name: "The Ordinary", country: "Kanada", productCount: 8, active: true },
  { id: "b2", name: "Rare Beauty", country: "ABD", productCount: 5, active: true },
  { id: "b3", name: "COSRX", country: "Kore", productCount: 6, active: true },
  { id: "b4", name: "Beauty of Joseon", country: "Kore", productCount: 4, active: true },
  { id: "b5", name: "Charlotte Tilbury", country: "İngiltere", productCount: 7, active: true },
  { id: "b6", name: "RAVANON", country: "Türkiye", productCount: 12, active: true },
  { id: "b7", name: "Chanel", country: "Fransa", productCount: 3, active: true },
  { id: "b8", name: "Sol de Janeiro", country: "Brezilya", productCount: 4, active: true },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: "makyaj", name: "Makyaj", icon: "💄", productCount: 18 },
  { id: "cilt-bakimi", name: "Cilt Bakımı", icon: "✨", productCount: 22 },
  { id: "sac-bakimi", name: "Saç Bakımı", icon: "💇", productCount: 8 },
  { id: "parfum", name: "Parfüm & Koku", icon: "🌸", productCount: 6 },
  { id: "vucut-bakimi", name: "Vücut Bakımı", icon: "🧴", productCount: 10 },
  { id: "tirnak", name: "Tırnak", icon: "💅", productCount: 4 },
  { id: "erkek-bakim", name: "Erkek Bakım", icon: "🧔", productCount: 3 },
  { id: "aksesuar", name: "Aksesuar & Araç", icon: "🪞", productCount: 5 },
];

export const MOCK_COLLECTIONS: Collection[] = [
  { id: "k-beauty", name: "K-Beauty Glow", emoji: "🇰🇷", productCount: 11, active: true },
  { id: "viral-tiktok", name: "TikTok Viral", emoji: "📱", productCount: 7, active: true },
  { id: "gen-z-picks", name: "Gen Z Picks", emoji: "✨", productCount: 12, active: true },
  { id: "glass-skin", name: "Glass Skin", emoji: "💎", productCount: 9, active: true },
  { id: "clean-beauty", name: "Clean Beauty", emoji: "🌿", productCount: 8, active: true },
  { id: "soft-glam", name: "Soft Glam", emoji: "💗", productCount: 6, active: true },
];

export const COSMETIC_TAGS = [
  "k-beauty", "glass-skin", "vegan", "cruelty-free", "spf", "anti-aging",
  "nem", "gözenek", "leke", "akne", "hassas", "mat", "parlak", "doğal",
  "viral", "tiktok", "refill", "clean-beauty", "hanbang", "peptit",
];

export const SKIN_TYPES = ["Kuru", "Yağlı", "Karma", "Hassas", "Normal"] as const;
export const ROUTINE_ROLES = [
  { id: "", label: "Yok" },
  { id: "cleanser", label: "Temizleyici" },
  { id: "toner", label: "Tonik" },
  { id: "serum", label: "Serum" },
  { id: "moisturizer", label: "Nemlendirici" },
  { id: "spf", label: "Güneş Koruyucu" },
  { id: "mask", label: "Maske" },
  { id: "exfoliant", label: "Peeling" },
  { id: "eye", label: "Göz Bakımı" },
  { id: "lip", label: "Dudak Bakımı" },
  { id: "makeup", label: "Makyaj" },
];