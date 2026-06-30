"use client";

import { AdminHeader } from "@/components/admin/header";
import { ProductEditor } from "@/components/admin/product-editor";
import { EMPTY_PRODUCT } from "@/lib/mock/products";
import type { AdminProduct } from "@/types/admin";

export default function NewProductPage() {
  const product: AdminProduct = {
    ...EMPTY_PRODUCT,
    id: Date.now(),
    sku: `RVN-NEW-${Date.now().toString().slice(-4)}`,
  };

  return (
    <>
      <AdminHeader
        title="Yeni Kozmetik Ürünü"
        description="Kozmetik sektörüne özel alanlarla ürün yükleyin — mağazaya anında senkronize edilir"
      />
      <main className="p-8">
        <ProductEditor initial={product} isNew />
      </main>
    </>
  );
}