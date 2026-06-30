"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteProductApi } from "@/lib/api/products";
import { useAuth } from "@/components/admin/auth-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminProduct } from "@/types/admin";
import { cn, formatCurrency } from "@/lib/utils";

interface ProductsTableProps {
  products: AdminProduct[];
  onProductsChange?: (products: AdminProduct[]) => void;
}

export function ProductsTable({ products, onProductsChange }: ProductsTableProps) {
  const router = useRouter();
  const { hasPermission } = useAuth();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const categories = useMemo(() => [...new Set(products.map((p) => p.categoryLabel))], [products]);

  const filtered = useMemo(() => {
    if (catFilter === "all") return products;
    return products.filter((p) => p.categoryLabel === catFilter);
  }, [products, catFilter]);

  const columns = useMemo<ColumnDef<AdminProduct>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button className="flex items-center gap-1 hover:text-gold" onClick={() => column.toggleSorting()}>
            Ürün <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.images[0] && (
              <img src={row.original.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover border border-border" />
            )}
            <div>
              <p className="font-medium text-cream">{row.original.name}</p>
              <p className="text-xs text-cream/40">{row.original.brand} · {row.original.sku}</p>
            </div>
          </div>
        ),
      },
      { accessorKey: "categoryLabel", header: "Kategori", cell: ({ row }) => <span className="text-cream/70">{row.original.categoryLabel}</span> },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <button className="flex items-center gap-1 hover:text-gold" onClick={() => column.toggleSorting()}>
            Fiyat <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <span className="text-gold font-medium">{formatCurrency(row.original.price)}</span>
            {row.original.originalPrice && (
              <span className="text-xs text-cream/30 line-through ml-2">{formatCurrency(row.original.originalPrice)}</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: "stock",
        header: "Stok",
        cell: ({ row }) => {
          const s = row.original.stock;
          return (
            <Badge variant={s === 0 ? "destructive" : s < 30 ? "warning" : "success"}>
              {s === 0 ? "Tükendi" : s}
            </Badge>
          );
        },
      },
      {
        id: "tags",
        header: "Etiketler",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.kBeauty && <Badge variant="default">K-Beauty</Badge>}
            {row.original.vegan && <Badge variant="success">Vegan</Badge>}
            {row.original.flash && <Badge variant="warning">Flaş</Badge>}
            {row.original.new && <Badge variant="default">Yeni</Badge>}
            {!row.original.active && <Badge variant="destructive">Pasif</Badge>}
          </div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/products/${row.original.id}/edit`);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            {hasPermission("products.delete") && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-400 hover:text-red-300"
              onClick={async (e) => {
                e.stopPropagation();
                if (!confirm(`"${row.original.name}" silinsin mi?`)) return;
                try {
                  await deleteProductApi(row.original.id);
                  onProductsChange?.(products.filter((p) => p.id !== row.original.id));
                } catch {
                  alert("Ürün silinemedi");
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            )}
          </div>
        ),
        size: 64,
      },
    ],
    [router, products, onProductsChange, hasPermission]
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/30" />
          <Input placeholder="Ürün veya marka ara..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCatFilter("all")} className={cn("rounded-full border px-3 py-1 text-xs", catFilter === "all" ? "border-gold/40 bg-gold/10 text-gold" : "border-border text-cream/50")}>Tümü</button>
          {categories.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)} className={cn("rounded-full border px-3 py-1 text-xs", catFilter === c ? "border-gold/40 bg-gold/10 text-gold" : "border-border text-cream/50")}>{c}</button>
          ))}
          <Button asChild>
            <Link href="/admin/products/new"><Plus className="h-4 w-4" />Ürün Yükle</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-border bg-surface-elevated">
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-cream/40">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-0 hover:bg-white/5 cursor-pointer"
                onClick={() => router.push(`/admin/products/${row.original.id}/edit`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-cream/40">{table.getFilteredRowModel().rows.length} ürün</p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="secondary" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}