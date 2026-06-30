import { getStoreProducts } from "@/lib/store/repository";
import { findByEmailOrPhone } from "@/lib/store/users-repo";

export interface AIProductSuggestion {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: string;
}

export interface AIChatResult {
  response: string;
  products: AIProductSuggestion[];
  quickReplies: string[];
  intent: string;
}

const RULES: { keywords: string[]; intent: string; response: string; filter: (p: AIProductSuggestion, ctx: Ctx) => boolean; quickReplies: string[] }[] = [
  { keywords: ["kuru", "nem", "kuruluk"], intent: "dry_skin", response: "Kuru ciltler için nem bariyerini güçlendiren ürünler öneriyorum. Hyaluronik asit ve seramid içeren formüller idealdir:", filter: (p) => p.category === "cilt-bakimi", quickReplies: ["SPF öner", "Vegan ürünler", "Glass skin"] },
  { keywords: ["yağlı", "gözenek", "akne", "sivilce"], intent: "oily_skin", response: "Yağlı ve karma ciltler için hafif, gözenek tıkamayan formüller seçtim:", filter: (p) => ["cilt-bakimi", "makyaj"].includes(p.category), quickReplies: ["Hassas cilt", "K-Beauty", "Bütçe dostu"] },
  { keywords: ["hassas", "kızarık", "tahriş"], intent: "sensitive", response: "Hassas ciltler için parfümsüz, yatıştırıcı formüller:", filter: (p) => p.category === "cilt-bakimi", quickReplies: ["Nemlendirici", "Temizleyici"] },
  { keywords: ["makyaj", "fondöten", "ruj", "allık"], intent: "makeup", response: "En popüler makyaj ürünlerimiz:", filter: (p) => p.category === "makyaj", quickReplies: ["Soft glam", "Vegan makyaj"] },
  { keywords: ["k-beauty", "kore", "glass", "cam cilt"], intent: "kbeauty", response: "K-Beauty ve glass skin rutini için önerilerim:", filter: (p) => p.name.toLowerCase().includes("snail") || p.brand.toLowerCase().includes("cosrx") || p.brand.toLowerCase().includes("joseon") || p.category === "cilt-bakimi", quickReplies: ["SPF50+", "Serum öner"] },
  { keywords: ["vegan", "cruelty", "temiz", "clean"], intent: "vegan", response: "Vegan ve clean beauty seçeneklerimiz:", filter: () => true, quickReplies: ["Cilt bakımı", "Makyaj"] },
  { keywords: ["saç", "şampuan", "olaplex"], intent: "hair", response: "Saç bakım rutininiz için:", filter: (p) => p.category === "sac-bakimi", quickReplies: ["Onarım", "Nem"] },
  { keywords: ["parfüm", "koku", "edp", "edt"], intent: "fragrance", response: "En sevilen parfüm ve kokular:", filter: (p) => p.category === "parfum" || p.category === "vucut-bakimi", quickReplies: ["Vücut spreyi"] },
  { keywords: ["anti", "kırışık", "aging", "retinol", "peptit"], intent: "antiaging", response: "Anti-aging rutini için peptit ve retinol bazlı öneriler:", filter: (p) => p.category === "cilt-bakimi", quickReplies: ["Gece bakımı", "SPF"] },
  { keywords: ["bütçe", "ucuz", "ekonomik", "uygun"], intent: "budget", response: "Bütçe dostu ama etkili seçenekler:", filter: (p) => p.price < 500, quickReplies: ["Makyaj", "Cilt bakımı"] },
  { keywords: ["trend", "2026", "viral", "tiktok"], intent: "trends", response: "2026 trendleri: Glass Skin, Skinimalism ve K-Beauty. Popüler seçimler:", filter: () => true, quickReplies: ["K-Beauty rutini", "Soft glam"] },
  { keywords: ["spf", "güneş", "koruma"], intent: "spf", response: "Güneş koruyucu önerilerim — her gün kullanın:", filter: (p) => p.name.toLowerCase().includes("spf") || p.name.toLowerCase().includes("sun"), quickReplies: ["Cilt tipim?", "Nemlendirici"] },
];

type Ctx = { skinType?: string; userName?: string; spend?: number };

export async function processAIChat(
  message: string,
  context: { userId?: string; userEmail?: string; skinType?: string } = {}
): Promise<AIChatResult> {
  const { products: storeProducts } = await getStoreProducts();
  const catalog: AIProductSuggestion[] = storeProducts.map((p) => ({
    id: p.id, name: p.name, brand: p.brand, price: p.price, category: p.category,
  }));

  let ctx: Ctx = { skinType: context.skinType };
  if (context.userEmail || context.userId) {
    const user = await findByEmailOrPhone(context.userEmail ?? context.userId ?? "");
    if (user) {
      ctx = { ...ctx, userName: user.name, spend: user.lifetimeSpend };
    }
  }

  const lower = message.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      let filtered = catalog.filter((p) => rule.filter(p, ctx));
      if (ctx.skinType) {
        const skinFiltered = storeProducts.filter((p) => p.skinType?.includes(ctx.skinType!));
        if (skinFiltered.length) {
          filtered = skinFiltered.map((p) => ({ id: p.id, name: p.name, brand: p.brand, price: p.price, category: p.category }));
        }
      }
      if (rule.intent === "vegan") {
        filtered = storeProducts.filter((p) => p.vegan || p.crueltyFree).map((p) => ({ id: p.id, name: p.name, brand: p.brand, price: p.price, category: p.category }));
      }
      if (rule.intent === "trends") {
        filtered = storeProducts.filter((p) => p.new || p.bestseller).map((p) => ({ id: p.id, name: p.name, brand: p.brand, price: p.price, category: p.category }));
      }
      const top = filtered.slice(0, 3);
      let response = rule.response;
      if (ctx.userName) response = `Merhaba ${ctx.userName.split(" ")[0]}! ${response}`;
      return { response, products: top, quickReplies: rule.quickReplies, intent: rule.intent };
    }
  }

  if (lower.includes("sipariş") || lower.includes("aldım") || lower.includes("geçmiş")) {
    return {
      response: ctx.userName
        ? `${ctx.userName}, sipariş geçmişinizi hesabınızdan görüntüleyebilirsiniz. Size yine de en çok tercih edilen ürünleri öneriyorum:`
        : "Sipariş geçmişi için giriş yapmanız gerekir. Popüler ürünlerimiz:",
      products: catalog.slice(0, 3),
      quickReplies: ["Kuru cilt", "Makyaj", "K-Beauty"],
      intent: "orders",
    };
  }

  return {
    response: "Size en uygun ürünleri bulmam için cilt tipinizi veya ihtiyacınızı yazın. Örn: kuru cilt, makyaj, K-Beauty, vegan ürünler",
    products: catalog.filter((p) => p.price < 800).slice(0, 3),
    quickReplies: ["Kuru cilt için", "Glass skin rutini", "Vegan ürünler", "2026 trendleri"],
    intent: "general",
  };
}