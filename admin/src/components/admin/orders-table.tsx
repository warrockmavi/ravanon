"use client";

import { useMemo, useState } from "react";
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
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminOrder, OrderStatus } from "@/types/admin";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";

const STATUS_MAP: Record<OrderStatus, { label: string; variant: "success" | "destructive" | "warning" | "secondary" | "default" }> = {
  pending: { label: "Beklemede", variant: "warning" },
  confirmed: { label: "Onaylandı", variant: "default" },
  processing: { label: "Hazırlanıyor", variant: "default" },
  shipped: { label: "Kargoda", variant: "secondary" },
  delivered: { label: "Teslim Edildi", variant: "success" },
  cancelled: { label: "İptal", variant: "destructive" },
  refunded: { label: "İade", variant: "destructive" },
};

const STATUS_FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "pending", label: "Beklemede" },
  { value: "processing", label: "Hazırlanıyor" },
  { value: "shipped", label: "Kargoda" },
  { value: "delivered", label: "Teslim" },
  { value: "refunded", label: "İade" },
];

interface OrdersTableProps {
  orders: AdminOrder[];
  onOrderClick: (order: AdminOrder) => void;
}

export function OrdersTable({ orders, onOrderClick }: OrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const columns = useMemo<ColumnDef<AdminOrder>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Sipariş No",
        cell: ({ row }) => <span className="font-mono text-sm text-gold">{row.original.id}</span>,
      },
      {
        accessorKey: "customerName",
        header: "Müşteri",
        cell: ({ row }) => (
          <div>
            <p className="text-cream font-medium">{row.original.customerName}</p>
            <p className="text-xs text-cream/40">{row.original.customerEmail}</p>
          </div>
        ),
      },
      {
        id: "items",
        header: "Ürün",
        cell: ({ row }) => (
          <span className="text-cream/70 text-sm">
            {row.original.items.length} ürün
          </span>
        ),
      },
      {
        accessorKey: "total",
        header: ({ column }) => (
          <button className="flex items-center gap-1 hover:text-gold" onClick={() => column.toggleSorting()}>
            Tutar <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => <span className="text-cream font-medium">{formatCurrency(row.original.total)}</span>,
      },
      {
        id: "payment",
        header: "Ödeme",
        cell: ({ row }) => {
          const st = row.original.payment.status;
          const variant = st === "paid" ? "success" : st === "pending" ? "warning" : "default";
          const label = st === "paid" ? "Ödendi" : st === "pending" ? "Bekliyor" : st === "refunded" ? "İade" : st;
          return <Badge variant={variant}>{label}</Badge>;
        },
      },
      {
        id: "tracking",
        header: "Kargo",
        cell: ({ row }) => {
          const tn = row.original.shippingInfo.trackingNumber;
          if (tn === "—") return <span className="text-cream/30 text-xs">—</span>;
          return <span className="font-mono text-xs text-cream/60">{tn}</span>;
        },
      },
      {
        accessorKey: "status",
        header: "Durum",
        cell: ({ row }) => {
          const s = STATUS_MAP[row.original.status];
          return <Badge variant={s.variant}>{s.label}</Badge>;
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <button className="flex items-center gap-1 hover:text-gold" onClick={() => column.toggleSorting()}>
            Tarih <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => <span className="text-xs text-cream/40">{formatDateTime(row.original.createdAt)}</span>,
      },
    ],
    []
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
          <Input placeholder="Sipariş no veya müşteri ara..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)} className={cn("rounded-full border px-3 py-1 text-xs transition-all", statusFilter === f.value ? "border-gold/40 bg-gold/10 text-gold" : "border-border text-cream/50")}>
              {f.label}
            </button>
          ))}
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
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-white/5 cursor-pointer" onClick={() => onOrderClick(row.original)}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-cream/40">{table.getFilteredRowModel().rows.length} sipariş</p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="secondary" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}