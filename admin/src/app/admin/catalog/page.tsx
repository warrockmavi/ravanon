"use client";

import { useEffect, useState } from "react";
import { Layers, Tag, Sparkles, RefreshCw, Plus, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { KpiCard } from "@/components/admin/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteCatalogItem, fetchCatalog, saveCatalogItem } from "@/lib/api/catalog";
import { useAuth } from "@/components/admin/auth-provider";
import type { Brand, Category, Collection } from "@/types/admin";

export default function CatalogPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [brandForm, setBrandForm] = useState({ name: "", country: "Türkiye" });
  const [colForm, setColForm] = useState({ name: "", emoji: "✨" });
  const { hasPermission } = useAuth();

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchCatalog();
      setBrands(data.brands);
      setCategories(data.categories);
      setCollections(data.collections);
      setTotalProducts(data.totalProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = brandForm.name.toLowerCase().replace(/\s+/g, "-");
    await saveCatalogItem("brand", { id, name: brandForm.name, country: brandForm.country, productCount: 0, active: true });
    setBrandForm({ name: "", country: "Türkiye" });
    load();
  };

  const addCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = colForm.name.toLowerCase().replace(/\s+/g, "-");
    await saveCatalogItem("collection", { id, name: colForm.name, emoji: colForm.emoji, productCount: 0, active: true });
    setColForm({ name: "", emoji: "✨" });
    load();
  };

  const canEdit = hasPermission("products.edit");

  return (
    <>
      <AdminHeader
        title="Katalog Yönetimi"
        description="Marka, kategori ve koleksiyon yönetimi — ürün editörüne senkronize edilir"
        actions={
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Yenile
          </Button>
        }
      />
      <main className="p-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Markalar" value={brands.length} icon={<Tag className="h-5 w-5" />} />
          <KpiCard title="Kategoriler" value={categories.length} icon={<Layers className="h-5 w-5" />} />
          <KpiCard title="Koleksiyonlar" value={collections.length} icon={<Sparkles className="h-5 w-5" />} />
          <KpiCard title="Toplam Ürün" value={totalProducts} icon={<Layers className="h-5 w-5" />} />
        </div>

        <Tabs defaultValue="brands">
          <TabsList>
            <TabsTrigger value="brands">Markalar</TabsTrigger>
            <TabsTrigger value="categories">Kategoriler</TabsTrigger>
            <TabsTrigger value="collections">Koleksiyonlar</TabsTrigger>
          </TabsList>

          <TabsContent value="brands" className="space-y-4">
            {canEdit && (
              <form onSubmit={addBrand} className="flex flex-wrap gap-2 items-end">
                <Input placeholder="Marka adı" value={brandForm.name} onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })} required className="max-w-xs" />
                <Input placeholder="Ülke" value={brandForm.country} onChange={(e) => setBrandForm({ ...brandForm, country: e.target.value })} className="max-w-[140px]" />
                <Button type="submit" size="sm"><Plus className="h-4 w-4" />Yeni Marka</Button>
              </form>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {brands.map((b) => (
                <div key={b.id} className="rounded-xl border border-border bg-surface-elevated p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-cream">{b.name}</p>
                    <div className="flex gap-2">
                      <Badge variant={b.active ? "success" : "secondary"}>{b.active ? "Aktif" : "Pasif"}</Badge>
                      {canEdit && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={async () => { if (confirm("Silinsin mi?")) { await deleteCatalogItem("brand", b.id); load(); } }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-cream/50">{b.country}</p>
                  <p className="text-sm text-gold mt-2">{b.productCount} ürün</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <p className="text-sm text-cream/40 mb-4">Kategoriler ürün sayılarına göre otomatik hesaplanır.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="rounded-xl border border-border bg-surface-elevated p-5 text-center">
                  <span className="text-3xl">{c.icon}</span>
                  <p className="font-medium text-cream mt-3">{c.name}</p>
                  <p className="text-sm text-cream/50 mt-1">{c.productCount} ürün</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="collections" className="space-y-4">
            {canEdit && (
              <form onSubmit={addCollection} className="flex flex-wrap gap-2 items-end">
                <Input placeholder="Koleksiyon adı" value={colForm.name} onChange={(e) => setColForm({ ...colForm, name: e.target.value })} required className="max-w-xs" />
                <Input placeholder="Emoji" value={colForm.emoji} onChange={(e) => setColForm({ ...colForm, emoji: e.target.value })} className="max-w-[80px]" />
                <Button type="submit" size="sm"><Plus className="h-4 w-4" />Yeni Koleksiyon</Button>
              </form>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {collections.map((col) => (
                <div key={col.id} className="rounded-xl border border-border bg-surface-elevated p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{col.emoji}</span>
                      <p className="font-medium text-cream">{col.name}</p>
                    </div>
                    {canEdit && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={async () => { if (confirm("Silinsin mi?")) { await deleteCatalogItem("collection", col.id); load(); } }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-cream/50">{col.productCount} ürün</p>
                  <Badge variant={col.active ? "success" : "secondary"} className="mt-3">
                    {col.active ? "Yayında" : "Taslak"}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}