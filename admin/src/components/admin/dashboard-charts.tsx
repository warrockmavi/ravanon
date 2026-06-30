"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ClubGrowthPoint, SalesDataPoint, TopProduct } from "@/types/admin";
import { formatCurrency } from "@/lib/utils";

const tooltipStyle = {
  backgroundColor: "#161622",
  border: "1px solid rgba(201,169,110,0.2)",
  borderRadius: "8px",
  color: "#F5F0E8",
};

export function SalesChart({ data }: { data: SalesDataPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Satış Grafiği</CardTitle>
        <CardDescription>Son 7 gün gelir ve sipariş trendi (canlı)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A96E" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#C9A96E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => [
                  name === "revenue" ? formatCurrency(Number(value)) : value,
                  name === "revenue" ? "Gelir" : "Sipariş",
                ]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#C9A96E" fill="url(#goldGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function ClubGrowthChart({ data }: { data: ClubGrowthPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Club Üye Artışı</CardTitle>
        <CardDescription>Kayıtlı kullanıcı sayısı (canlı)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, "Üye"]} />
              <Bar dataKey="members" fill="#E8B4B8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function TopProductsTable({ products }: { products: TopProduct[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>En Çok Satan Ürünler</CardTitle>
        <CardDescription>Bu ayki sipariş verilerinden</CardDescription>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-sm text-cream/40 text-center py-8">Bu ay henüz satış yok</p>
        ) : (
          <div className="space-y-3">
            {products.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3 hover:border-gold/20 transition-colors">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-sm font-semibold text-gold">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cream truncate">{p.name}</p>
                  <p className="text-xs text-cream/40">{p.brand}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gold">{formatCurrency(p.revenue)}</p>
                  <p className="text-xs text-cream/40">{p.sales} satış</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}