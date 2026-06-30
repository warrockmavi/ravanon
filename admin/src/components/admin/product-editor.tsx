"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { COSMETIC_TAGS, SKIN_TYPES, ROUTINE_ROLES } from "@/lib/mock/catalog";
import { fetchCatalog } from "@/lib/api/catalog";
import type { AdminProduct, Brand, Category, Collection, CosmeticCategory, ProductVariant, SkinType } from "@/types/admin";
import { cn } from "@/lib/utils";
import { saveProductApi } from "@/lib/api/products";
import { Plus, Trash2, ImagePlus, Save, ArrowLeft, CheckCircle2 } from "lucide-react";

interface ProductEditorProps {
  initial: AdminProduct;
  isNew?: boolean;
  onSave?: (product: AdminProduct) => void;
}

export function ProductEditor({ initial, isNew, onSave }: ProductEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState<AdminProduct>(initial);
  const [newTag, setNewTag] = useState("");
  const [newImage, setNewImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    fetchCatalog().then((c) => {
      setBrands(c.brands);
      setCategories(c.categories);
      setCollections(c.collections);
    }).catch(() => {});
  }, []);

  const update = (patch: Partial<AdminProduct>) =>
    setForm((prev) => ({ ...prev, ...patch, updatedAt: new Date().toISOString() }));

  const handleCategoryChange = (cat: CosmeticCategory) => {
    const label = categories.find((c) => c.id === cat)?.name ?? cat;
    update({ category: cat, categoryLabel: label });
  };

  const handleBrandChange = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    if (brand) update({ brandId, brand: brand.name });
  };

  const toggleSkinType = (st: SkinType) => {
    const next = form.skinTypes.includes(st)
      ? form.skinTypes.filter((s) => s !== st)
      : [...form.skinTypes, st];
    update({ skinTypes: next });
  };

  const toggleTag = (tag: string) => {
    const next = form.tags.includes(tag)
      ? form.tags.filter((t) => t !== tag)
      : [...form.tags, tag];
    update({ tags: next });
  };

  const toggleCollection = (id: string) => {
    const next = form.collections.includes(id)
      ? form.collections.filter((c) => c !== id)
      : [...form.collections, id];
    update({ collections: next });
  };

  const addVariant = () => {
    const v: ProductVariant = {
      id: `v-${Date.now()}`,
      name: "Yeni Varyant",
      sku: `${form.sku}-V`,
      price: form.price,
      stock: 0,
    };
    update({ variants: [...form.variants, v] });
  };

  const updateVariant = (id: string, patch: Partial<ProductVariant>) => {
    update({
      variants: form.variants.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    });
  };

  const removeVariant = (id: string) => {
    update({ variants: form.variants.filter((v) => v.id !== id) });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await saveProductApi(form);
      onSave?.(form);
      setSaved(true);
      setTimeout(() => router.push("/admin/products"), 800);
    } catch {
      alert("Kayıt başarısız. Admin sunucusunun çalıştığından emin olun.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/products")}>
          <ArrowLeft className="h-4 w-4" />
          Ürünlere Dön
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? "Senkronize ediliyor..." : saved ? "Mağazaya kaydedildi!" : isNew ? "Ürünü Yayınla" : "Kaydet & Mağazaya Gönder"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
          <TabsTrigger value="cosmetic">Kozmetik Detay</TabsTrigger>
          <TabsTrigger value="images">Görseller</TabsTrigger>
          <TabsTrigger value="variants">Varyantlar</TabsTrigger>
          <TabsTrigger value="tags">Etiket & Koleksiyon</TabsTrigger>
          <TabsTrigger value="flags">Özellikler</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="rounded-xl border border-border bg-surface-elevated p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Ürün Adı *">
                <Input value={form.name} onChange={(e) => update({ name: e.target.value })} placeholder="Örn: Niacinamide %10 Serum" />
              </Field>
              <Field label="Marka *">
                <select
                  className="select-field"
                  value={form.brandId}
                  onChange={(e) => handleBrandChange(e.target.value)}
                >
                  <option value="">Marka seçin</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.country})</option>
                  ))}
                </select>
              </Field>
              <Field label="Kategori *">
                <select
                  className="select-field"
                  value={form.category}
                  onChange={(e) => handleCategoryChange(e.target.value as CosmeticCategory)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Alt Kategori">
                <Input value={form.subcategory ?? ""} onChange={(e) => update({ subcategory: e.target.value })} placeholder="Serum, Ruj, Tonik..." />
              </Field>
              <Field label="SKU *">
                <Input value={form.sku} onChange={(e) => update({ sku: e.target.value })} placeholder="RVN-XX-001" />
              </Field>
              <Field label="Barkod">
                <Input value={form.barcode ?? ""} onChange={(e) => update({ barcode: e.target.value })} />
              </Field>
              <Field label="Fiyat (TL) *">
                <Input type="number" value={form.price} onChange={(e) => update({ price: Number(e.target.value) })} />
              </Field>
              <Field label="Eski Fiyat (TL)">
                <Input type="number" value={form.originalPrice ?? ""} onChange={(e) => update({ originalPrice: e.target.value ? Number(e.target.value) : undefined })} />
              </Field>
              <Field label="Stok *">
                <Input type="number" value={form.stock} onChange={(e) => update({ stock: Number(e.target.value) })} />
              </Field>
              <Field label="Hacim / Gramaj">
                <Input value={form.volume ?? ""} onChange={(e) => update({ volume: e.target.value })} placeholder="30ml, 50g..." />
              </Field>
              <Field label="Renk / Ton">
                <Input value={form.shade ?? ""} onChange={(e) => update({ shade: e.target.value })} placeholder="Hope, Pillow Talk..." />
              </Field>
              <Field label="Rozet">
                <Input value={form.badge ?? ""} onChange={(e) => update({ badge: e.target.value })} placeholder="Yeni, Flaş İndirim, K-Beauty..." />
              </Field>
            </div>
            <Field label="Açıklama">
              <textarea
                className="w-full min-h-[100px] rounded-lg border border-border bg-surface px-3 py-2 text-sm text-cream resize-y"
                value={form.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="Ürün açıklaması..."
              />
            </Field>
            <Toggle label="Mağazada Aktif" checked={form.active} onChange={(v) => update({ active: v })} />
          </div>
        </TabsContent>

        <TabsContent value="cosmetic">
          <div className="rounded-xl border border-border bg-surface-elevated p-6 space-y-4">
            <Field label="İçerik Listesi (INCI)">
              <textarea
                className="w-full min-h-[80px] rounded-lg border border-border bg-surface px-3 py-2 text-sm text-cream resize-y font-mono text-xs"
                value={form.ingredients}
                onChange={(e) => update({ ingredients: e.target.value })}
                placeholder="Aqua, Glycerin, Niacinamide..."
              />
            </Field>
            <Field label="Kullanım Talimatı">
              <textarea
                className="w-full min-h-[80px] rounded-lg border border-border bg-surface px-3 py-2 text-sm text-cream resize-y"
                value={form.howToUse ?? ""}
                onChange={(e) => update({ howToUse: e.target.value })}
                placeholder="Temiz cilde uygulayın..."
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Rutin Rolü">
                <select
                  className="select-field"
                  value={form.routineRole ?? ""}
                  onChange={(e) => update({ routineRole: e.target.value as AdminProduct["routineRole"] })}
                >
                  {ROUTINE_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="SPF Değeri">
                <Input type="number" value={form.spf ?? ""} onChange={(e) => update({ spf: e.target.value ? Number(e.target.value) : undefined })} placeholder="50" />
              </Field>
            </div>
            <div>
              <label className="text-xs text-cream/50 mb-2 block">Cilt Tipleri</label>
              <div className="flex flex-wrap gap-2">
                {SKIN_TYPES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => toggleSkinType(st)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-all",
                      form.skinTypes.includes(st)
                        ? "border-gold/40 bg-gold/15 text-gold"
                        : "border-border text-cream/50 hover:border-gold/20"
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images">
          <div className="rounded-xl border border-border bg-surface-elevated p-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {form.images.map((url, i) => (
                <div key={i} className="relative group aspect-square rounded-lg border border-border overflow-hidden bg-surface">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => update({ images: form.images.filter((_, j) => j !== i) })}
                    className="absolute top-2 right-2 p-1 rounded bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <div className="aspect-square rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-2 p-4">
                <ImagePlus className="h-8 w-8 text-cream/30" />
                <Input
                  placeholder="Görsel URL"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="text-xs"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!newImage}
                  onClick={() => {
                    if (newImage) {
                      update({ images: [...form.images, newImage] });
                      setNewImage("");
                    }
                  }}
                >
                  Ekle
                </Button>
              </div>
            </div>
            <p className="text-xs text-cream/40">Ürün görselleri mağazada galeri olarak gösterilir. İlk görsel kapak görselidir.</p>
          </div>
        </TabsContent>

        <TabsContent value="variants">
          <div className="rounded-xl border border-border bg-surface-elevated p-6 space-y-4">
            {form.variants.length === 0 ? (
              <p className="text-sm text-cream/50">Renk/ton varyantı yoksa tek SKU ile devam edebilirsiniz.</p>
            ) : (
              <div className="space-y-3">
                {form.variants.map((v) => (
                  <div key={v.id} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end rounded-lg border border-border bg-surface p-4">
                    <Field label="Ad"><Input value={v.name} onChange={(e) => updateVariant(v.id, { name: e.target.value })} /></Field>
                    <Field label="Ton"><Input value={v.shade ?? ""} onChange={(e) => updateVariant(v.id, { shade: e.target.value })} /></Field>
                    <Field label="SKU"><Input value={v.sku} onChange={(e) => updateVariant(v.id, { sku: e.target.value })} /></Field>
                    <Field label="Fiyat"><Input type="number" value={v.price} onChange={(e) => updateVariant(v.id, { price: Number(e.target.value) })} /></Field>
                    <div className="flex gap-2">
                      <Field label="Stok"><Input type="number" value={v.stock} onChange={(e) => updateVariant(v.id, { stock: Number(e.target.value) })} /></Field>
                      <Button variant="ghost" size="icon" className="shrink-0 mb-0.5" onClick={() => removeVariant(v.id)}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button variant="secondary" size="sm" onClick={addVariant}>
              <Plus className="h-4 w-4" /> Varyant Ekle
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="tags">
          <div className="rounded-xl border border-border bg-surface-elevated p-6 space-y-6">
            <div>
              <label className="text-xs text-cream/50 mb-2 block">Kozmetik Etiketleri</label>
              <div className="flex flex-wrap gap-2">
                {COSMETIC_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs capitalize transition-all",
                      form.tags.includes(tag)
                        ? "border-gold/40 bg-gold/15 text-gold"
                        : "border-border text-cream/50"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <Input placeholder="Özel etiket" value={newTag} onChange={(e) => setNewTag(e.target.value)} className="max-w-xs" />
                <Button size="sm" variant="secondary" disabled={!newTag} onClick={() => { toggleTag(newTag); setNewTag(""); }}>
                  Ekle
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs text-cream/50 mb-2 block">Koleksiyonlar</label>
              <div className="flex flex-wrap gap-2">
                {collections.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => toggleCollection(col.id)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm transition-all",
                      form.collections.includes(col.id)
                        ? "border-gold/40 bg-gold/15 text-gold"
                        : "border-border text-cream/50"
                    )}
                  >
                    {col.emoji} {col.name}
                  </button>
                ))}
              </div>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {form.tags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="flags">
          <div className="rounded-xl border border-border bg-surface-elevated p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Toggle label="Vegan" checked={form.vegan} onChange={(v) => update({ vegan: v })} />
              <Toggle label="Cruelty-Free" checked={form.crueltyFree} onChange={(v) => update({ crueltyFree: v })} />
              <Toggle label="Clean Beauty" checked={form.cleanBeauty} onChange={(v) => update({ cleanBeauty: v })} />
              <Toggle label="K-Beauty" checked={form.kBeauty} onChange={(v) => update({ kBeauty: v })} />
              <Toggle label="Çok Satan" checked={form.bestseller} onChange={(v) => update({ bestseller: v })} />
              <Toggle label="Yeni Ürün" checked={form.new} onChange={(v) => update({ new: v })} />
              <Toggle label="Flaş İndirim" checked={form.flash} onChange={(v) => update({ flash: v })} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-cream/50 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5">
      <span className="text-sm text-cream/70">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}