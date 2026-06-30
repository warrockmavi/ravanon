"use client";

import { useEffect, useState } from "react";
import { CreditCard, Wallet, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { KpiCard } from "@/components/admin/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { PaymentProvider, PaymentStatus, PaymentTransaction } from "@/types/admin";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";

const TYPE_LABELS: Record<PaymentProvider["type"], string> = {
  card: "Kredi Kartı",
  wallet: "Dijital Cüzdan",
  transfer: "Havale/EFT",
  installment: "Taksit",
};

const TX_STATUS: Record<PaymentStatus, { label: string; variant: "success" | "warning" | "destructive" | "default" }> = {
  paid: { label: "Ödendi", variant: "success" },
  pending: { label: "Bekliyor", variant: "warning" },
  failed: { label: "Başarısız", variant: "destructive" },
  refunded: { label: "İade", variant: "default" },
  partial_refund: { label: "Kısmi İade", variant: "default" },
};

export default function PaymentsPage() {
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments", { cache: "no-store" });
      const data = await res.json();
      setProviders(data.providers);
      setTransactions(data.transactions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const kpis = {
    activeProviders: providers.filter((p) => p.active).length,
    paid: transactions.filter((t) => t.status === "paid").length,
    pending: transactions.filter((t) => t.status === "pending").length,
    volume: transactions.filter((t) => t.status === "paid").reduce((s, t) => s + t.amount, 0),
  };

  const toggleProvider = async (id: string) => {
    const res = await fetch("/api/payments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", id }),
    });
    if (res.ok) {
      const { provider } = await res.json();
      setProviders((prev) => prev.map((p) => (p.id === id ? provider : p)));
    }
  };

  return (
    <>
      <AdminHeader
        title="Ödeme Altyapısı"
        description="Ödeme sağlayıcıları ve siparişlerden türetilen işlem geçmişi"
        actions={
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Yenile
          </Button>
        }
      />
      <main className="p-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Aktif Sağlayıcı" value={kpis.activeProviders} icon={<CreditCard className="h-5 w-5" />} />
          <KpiCard title="Başarılı İşlem" value={kpis.paid} icon={<CheckCircle className="h-5 w-5" />} />
          <KpiCard title="Bekleyen Ödeme" value={kpis.pending} icon={<Clock className="h-5 w-5" />} />
          <KpiCard title="İşlem Hacmi" value={formatCurrency(kpis.volume)} icon={<Wallet className="h-5 w-5" />} />
        </div>

        <section>
          <h2 className="font-display text-lg text-cream mb-4">Ödeme Sağlayıcıları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {providers.map((p) => (
              <div key={p.id} className={cn("rounded-xl border p-5 transition-all", p.active ? "border-gold/20 bg-surface-elevated" : "border-border bg-surface opacity-70")}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.logo}</span>
                    <div>
                      <p className="font-medium text-cream">{p.name}</p>
                      <p className="text-xs text-cream/40">{TYPE_LABELS[p.type]}</p>
                    </div>
                  </div>
                  <Switch checked={p.active} onCheckedChange={() => toggleProvider(p.id)} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-cream/60">
                    <span>Komisyon</span>
                    <span className="text-cream">%{p.commission}</span>
                  </div>
                  <div className="flex justify-between text-cream/60">
                    <span>API Anahtarı</span>
                    <span className="font-mono text-xs text-cream/50">{p.apiKeyMasked}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {p.testMode && <Badge variant="warning">Test Modu</Badge>}
                    {p.active && <Badge variant="success">Aktif</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg text-cream mb-4">Son İşlemler</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            {loading ? (
              <p className="text-center py-12 text-cream/40">Yükleniyor...</p>
            ) : transactions.length === 0 ? (
              <p className="text-center py-12 text-cream/40">Henüz işlem yok</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-elevated">
                    {["İşlem ID", "Sipariş", "Müşteri", "Sağlayıcı", "Tutar", "Durum", "Tarih"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-cream/40">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const st = TX_STATUS[tx.status];
                    return (
                      <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-white/5">
                        <td className="px-4 py-3 font-mono text-xs text-cream/60">{tx.id}</td>
                        <td className="px-4 py-3 text-sm text-gold">{tx.orderId}</td>
                        <td className="px-4 py-3 text-sm text-cream">{tx.customerName}</td>
                        <td className="px-4 py-3 text-sm text-cream/70">{tx.provider}</td>
                        <td className="px-4 py-3 text-sm text-cream font-medium">
                          {formatCurrency(tx.amount)}
                          {tx.installment && <span className="text-xs text-cream/40 ml-1">({tx.installment}x)</span>}
                        </td>
                        <td className="px-4 py-3"><Badge variant={st.variant}>{st.label}</Badge></td>
                        <td className="px-4 py-3 text-xs text-cream/50">{formatDateTime(tx.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </>
  );
}