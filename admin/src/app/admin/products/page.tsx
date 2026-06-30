"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, CheckCircle, AlertTriangle, XCircle, Sparkles, Leaf, RefreshCw } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { KpiCard } from "@/components/admin/kpi-card";
import { ProductsTable } from "@/components/admin/products-table";
import { getProductKpis } from "@/lib/mock/products";
import { fetchProducts } from "@/lib/api/products";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { AdminProduct } from "@/types/admin";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
      setSyncedAt(new Date().toISOString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const kpis = getProductKpis(products);

  return (
    <>
      <AdminHeader
        title="Ürünler"
        description="Kozmetik ürün kataloğu — değişiklikler mağazaya anında yansır"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Yenile
            </Button>
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4" />
                Ürün Yükle
              </Link>
            </Button>
          </div>
        }
      />
      <main className="p-8 space-y-6">
        {syncedAt && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-sm text-emerald-300">
            Mağaza ile senkron — {products.length} ürün · Son güncelleme: {new Date(syncedAt).toLocaleTimeString("tr-TR")}
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard title="Toplam Ürün" value={loading ? "…" : kpis.total} icon={<Package className="h-5 w-5" />} />
          <KpiCard title="Aktif" value={loading ? "…" : kpis.active} icon={<CheckCircle className="h-5 w-5" />} />
          <KpiCard title="Düşük Stok" value={loading ? "…" : kpis.lowStock} icon={<AlertTriangle className="h-5 w-5" />} />
          <KpiCard title="Tükendi" value={loading ? "…" : kpis.outOfStock} icon={<XCircle className="h-5 w-5" />} />
          <KpiCard title="K-Beauty" value={loading ? "…" : kpis.kBeauty} icon={<Sparkles className="h-5 w-5" />} />
          <KpiCard title="Vegan" value={loading ? "…" : kpis.vegan} icon={<Leaf className="h-5 w-5" />} />
        </div>
        {!loading && <ProductsTable products={products} onProductsChange={setProducts} />}
      </main>
    </>
  );
}