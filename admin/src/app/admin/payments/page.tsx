"use client";

import { useEffect, useState } from "react";
import { CreditCard, Wallet, CheckCircle, Clock, RefreshCw, Settings, Building2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { KpiCard } from "@/components/admin/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PaymentBankAccount, PaymentProvider, PaymentStatus, PaymentTransaction } from "@/types/admin";
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

const NEEDS_KEYS = new Set(["iyzico", "paytr", "stripe", "papara"]);

export default function PaymentsPage() {
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [bankAccount, setBankAccount] = useState<PaymentBankAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [configProvider, setConfigProvider] = useState<PaymentProvider | null>(null);
  const [creds, setCreds] = useState({ apiKey: "", apiSecret: "", merchantId: "", testMode: true });
  const [saving, setSaving] = useState(false);
  const [bankForm, setBankForm] = useState<PaymentBankAccount>({ bank: "", iban: "", holder: "", branch: "" });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments", { cache: "no-store" });
      const data = await res.json();
      setProviders(data.providers);
      setTransactions(data.transactions);
      if (data.bankAccount) {
        setBankAccount(data.bankAccount);
        setBankForm(data.bankAccount);
      }
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

  const openConfig = (p: PaymentProvider) => {
    setConfigProvider(p);
    setCreds({ apiKey: "", apiSecret: "", merchantId: p.merchantId || "", testMode: p.testMode });
  };

  const saveCredentials = async () => {
    if (!configProvider) return;
    setSaving(true);
    try {
      const res = await fetch("/api/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "credentials",
          id: configProvider.id,
          apiKey: creds.apiKey || undefined,
          apiSecret: creds.apiSecret || undefined,
          merchantId: creds.merchantId || undefined,
          testMode: creds.testMode,
        }),
      });
      if (!res.ok) throw new Error("Kaydedilemedi");
      const { provider } = await res.json();
      setProviders((prev) => prev.map((p) => (p.id === provider.id ? provider : p)));
      setConfigProvider(null);
    } catch {
      alert("API anahtarları kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const saveBank = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bank", bankAccount: bankForm }),
      });
      if (!res.ok) throw new Error("Kaydedilemedi");
      const { bankAccount: saved } = await res.json();
      setBankAccount(saved);
      alert("Banka hesabı kaydedildi");
    } catch {
      alert("Banka bilgileri kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const confirmPayment = async (orderId: string) => {
    if (!confirm(`${orderId} siparişinin havale ödemesini onaylıyor musunuz?`)) return;
    const res = await fetch("/api/payments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "confirmPayment", orderId }),
    });
    if (res.ok) await load();
    else alert("Ödeme onaylanamadı");
  };

  return (
    <>
      <AdminHeader
        title="Ödeme Altyapısı"
        description="Gerçek ödeme sağlayıcıları — API anahtarlarını yapılandırın, işlemleri takip edin"
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
                  <div className="flex gap-2 pt-2 flex-wrap">
                    {p.testMode && <Badge variant="warning">Test Modu</Badge>}
                    {p.active && <Badge variant="success">Aktif</Badge>}
                    {!p.apiKeyMasked || p.apiKeyMasked === "—" ? (
                      NEEDS_KEYS.has(p.id) ? <Badge variant="default">Anahtar gerekli</Badge> : null
                    ) : (
                      <Badge variant="success">Yapılandırıldı</Badge>
                    )}
                  </div>
                  {NEEDS_KEYS.has(p.id) && (
                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => openConfig(p)}>
                      <Settings className="h-3.5 w-3.5" />
                      API Yapılandır
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-cream/40 mt-4">
            iyzico sandbox: sandbox-merchant.iyzipay.com üzerinden API Key + Secret alın. Test kartı: 5528 7900 0000 0008
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-cream mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Havale / EFT Banka Hesabı
          </h2>
          <div className="rounded-xl border border-border bg-surface-elevated p-6 max-w-2xl space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-cream/50 mb-1.5 block">Banka</label>
                <Input value={bankForm.bank} onChange={(e) => setBankForm({ ...bankForm, bank: e.target.value })} placeholder="Ziraat Bankası" />
              </div>
              <div>
                <label className="text-xs text-cream/50 mb-1.5 block">Şube</label>
                <Input value={bankForm.branch || ""} onChange={(e) => setBankForm({ ...bankForm, branch: e.target.value })} placeholder="Kadıköy" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-cream/50 mb-1.5 block">IBAN</label>
                <Input value={bankForm.iban} onChange={(e) => setBankForm({ ...bankForm, iban: e.target.value })} placeholder="TR00 0000 0000 0000 0000 0000 00" className="font-mono" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-cream/50 mb-1.5 block">Hesap Sahibi</label>
                <Input value={bankForm.holder} onChange={(e) => setBankForm({ ...bankForm, holder: e.target.value })} placeholder="RAVANON KOZMETİK A.Ş." />
              </div>
            </div>
            <Button onClick={saveBank} disabled={saving}>
              {saving ? "Kaydediliyor..." : "Banka Hesabını Kaydet"}
            </Button>
            {bankAccount && (
              <p className="text-xs text-cream/40">Müşterilere gösterilen IBAN: <span className="font-mono text-cream/60">{bankAccount.iban}</span></p>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg text-cream mb-4">Son İşlemler</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            {loading ? (
              <p className="text-center py-12 text-cream/40">Yükleniyor...</p>
            ) : transactions.length === 0 ? (
              <p className="text-center py-12 text-cream/40">Henüz işlem yok — mağazadan test siparişi verin</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-elevated">
                    {["İşlem ID", "Sipariş", "Müşteri", "Sağlayıcı", "Tutar", "Durum", "Tarih", ""].map((h) => (
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
                        <td className="px-4 py-3">
                          {tx.status === "pending" && (
                            <Button size="sm" variant="outline" onClick={() => confirmPayment(tx.orderId)}>
                              Onayla
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {configProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfigProvider(null)} />
          <div className="relative w-full max-w-md rounded-xl border border-border bg-surface-elevated p-6 shadow-2xl">
            <h2 className="font-display text-lg text-cream mb-1">{configProvider.name} — API Yapılandırma</h2>
            <p className="text-sm text-cream/40 mb-6">Boş bırakılan alanlar mevcut değerleri korur</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-cream/50 mb-1.5 block">API Key</label>
                <Input value={creds.apiKey} onChange={(e) => setCreds({ ...creds, apiKey: e.target.value })} placeholder="sandbox-..." className="font-mono text-sm" />
              </div>
              <div>
                <label className="text-xs text-cream/50 mb-1.5 block">API Secret</label>
                <Input type="password" value={creds.apiSecret} onChange={(e) => setCreds({ ...creds, apiSecret: e.target.value })} placeholder="••••••••" className="font-mono text-sm" />
              </div>
              {configProvider.id === "paytr" && (
                <div>
                  <label className="text-xs text-cream/50 mb-1.5 block">Merchant ID</label>
                  <Input value={creds.merchantId} onChange={(e) => setCreds({ ...creds, merchantId: e.target.value })} placeholder="123456" />
                </div>
              )}
              <label className="flex items-center gap-3 cursor-pointer">
                <Switch checked={creds.testMode} onCheckedChange={(v) => setCreds({ ...creds, testMode: v })} />
                <span className="text-sm text-cream">Test / Sandbox modu</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setConfigProvider(null)}>İptal</Button>
              <Button className="flex-1" onClick={saveCredentials} disabled={saving}>
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}