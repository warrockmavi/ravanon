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
  type RowSelectionState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreHorizontal,
  Search,
  UserX,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getRoleLabel, getRoleColor } from "@/lib/roles";
import { bulkBanUsers, exportUsersCsv } from "@/lib/api/users";
import { useAuth } from "@/components/admin/auth-provider";
import type { AdminUser, UserStatus } from "@/types/admin";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

interface UsersTableProps {
  users: AdminUser[];
  onUserClick: (user: AdminUser) => void;
  onUsersChange: (users: AdminUser[]) => void;
}

const STATUS_FILTERS: { value: UserStatus | "all"; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "active", label: "Aktif" },
  { value: "banned", label: "Banlı" },
  { value: "pending", label: "Beklemede" },
  { value: "invited", label: "Davetli" },
];

const STATUS_BADGE: Record<UserStatus, { label: string; variant: "success" | "destructive" | "warning" | "secondary" }> = {
  active: { label: "Aktif", variant: "success" },
  banned: { label: "Banlı", variant: "destructive" },
  pending: { label: "Beklemede", variant: "warning" },
  invited: { label: "Davetli", variant: "secondary" },
};

export function UsersTable({ users, onUserClick, onUsersChange }: UsersTableProps) {
  const { hasPermission } = useAuth();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");

  const filteredData = useMemo(() => {
    if (statusFilter === "all") return users;
    return users.filter((u) => u.status === statusFilter);
  }, [users, statusFilter]);

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
        size: 40,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button className="flex items-center gap-1 hover:text-gold" onClick={() => column.toggleSorting()}>
            Kullanıcı <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 text-sm font-medium text-gold">
              {row.original.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-cream">{row.original.name}</p>
              <p className="text-xs text-cream/40">{row.original.email}</p>
              {row.original.phone && (
                <p className="text-xs text-cream/30">{row.original.phone}</p>
              )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Durum",
        cell: ({ row }) => {
          const s = STATUS_BADGE[row.original.status];
          return <Badge variant={s.variant}>{s.label}</Badge>;
        },
      },
      {
        id: "roles",
        header: "Roller",
        cell: ({ row }) =>
          row.original.roles.length ? (
            <div className="flex flex-wrap gap-1">
              {row.original.roles.map((r) => (
                <span key={r} className={cn("rounded-full border px-2 py-0.5 text-[10px]", getRoleColor(r))}>
                  {getRoleLabel(r)}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-cream/30">Müşteri</span>
          ),
      },
      {
        accessorKey: "clubTier",
        header: "Club",
        cell: ({ row }) =>
          row.original.isClubMember ? (
            <span className="text-xs uppercase text-gold">{row.original.clubTier}</span>
          ) : (
            <span className="text-xs text-cream/30">—</span>
          ),
      },
      {
        accessorKey: "clubPoints",
        header: ({ column }) => (
          <button className="flex items-center gap-1 hover:text-gold" onClick={() => column.toggleSorting()}>
            Puan <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => <span className="text-cream">{row.original.clubPoints}</span>,
      },
      {
        accessorKey: "lifetimeSpend",
        header: ({ column }) => (
          <button className="flex items-center gap-1 hover:text-gold" onClick={() => column.toggleSorting()}>
            Harcama <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => <span className="text-cream/70">{formatCurrency(row.original.lifetimeSpend)}</span>,
      },
      {
        accessorKey: "lastLoginAt",
        header: "Son Giriş",
        cell: ({ row }) => (
          <span className="text-xs text-cream/40">
            {row.original.lastLoginAt ? formatDate(row.original.lastLoginAt) : "—"}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onUserClick(row.original);
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        ),
        size: 40,
      },
    ],
    [onUserClick]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = filterValue.toLowerCase();
      const digits = filterValue.replace(/\D/g, "");
      const u = row.original;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (!!digits && !!u.phone && u.phone.replace(/\D/g, "").includes(digits))
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  const selectedIds = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id);

  const handleBulkBan = async () => {
    try {
      const updated = await bulkBanUsers(selectedIds);
      const map = new Map(updated.map((u) => [u.id, u]));
      onUsersChange(users.map((u) => map.get(u.id) || u));
      setRowSelection({});
    } catch {
      alert("Toplu ban uygulanamadı");
    }
  };

  const handleExport = async () => {
    const csv = await exportUsersCsv(selectedIds.length ? selectedIds : undefined);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ravanon-users.csv";
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/30" />
          <Input
            placeholder="İsim, e-posta veya telefon ara..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-all",
                statusFilter === f.value
                  ? "border-gold/40 bg-gold/10 text-gold"
                  : "border-border text-cream/50 hover:border-gold/20"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-gold/20 bg-gold/5 px-4 py-2">
          <span className="text-sm text-gold">{selectedIds.length} seçili</span>
          {hasPermission("users.ban") && (
          <Button size="sm" variant="destructive" onClick={handleBulkBan}>
            <UserX className="h-3.5 w-3.5" />
            Toplu Ban
          </Button>
          )}
          <Button size="sm" variant="secondary" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-border bg-surface-elevated">
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-cream/40">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-0 hover:bg-white/5 cursor-pointer transition-colors"
                onClick={() => onUserClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-cream/40">
          {table.getFilteredRowModel().rows.length} kullanıcı · Sayfa {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}