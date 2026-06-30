"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/header";
import { ProductEditor } from "@/components/admin/product-editor";
import { fetchProduct } from "@/lib/api/products";
import { Button } from "@/components/ui/button";
import type { AdminProduct } from "@/types/admin";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct(Number(id)).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <>
        <AdminHeader title="Yükleniyor..." />
        <main className="p-8 text-cream/50">Ürün verisi mağazadan alınıyor...</main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <AdminHeader title="Ürün Bulunamadı" />
        <main className="p-8 text-center">
          <p className="text-cream/50 mb-4">Bu ID ile ürün bulunamadı.</p>
          <Button asChild><Link href="/admin/products">Ürünlere Dön</Link></Button>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title={`Düzenle: ${product.name}`}
        description={`${product.brand} · ${product.sku} — Kayıt mağazaya senkronize edilir`}
      />
      <main className="p-8">
        <ProductEditor initial={product} />
      </main>
    </>
  );
}