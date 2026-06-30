export interface StoreProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviews: number;
  skinType: string[];
  vegan: boolean;
  crueltyFree: boolean;
  bestseller: boolean;
  new: boolean;
  flash: boolean;
  routineRole?: string;
  tags: string[];
  description: string;
  ingredients: string;
  badge?: string;
  bundle?: boolean;
  stock?: number;
  active?: boolean;
  sku?: string;
  images?: string[];
  howToUse?: string;
  spf?: number;
  volume?: string;
  shade?: string;
  kBeauty?: boolean;
  cleanBeauty?: boolean;
  collections?: string[];
  variants?: { id: string; name: string; sku: string; price: number; stock: number; shade?: string }[];
  updatedAt?: string;
}

export interface ProductsFile {
  version: number;
  updatedAt: string;
  products: StoreProduct[];
}