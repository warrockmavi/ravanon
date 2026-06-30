"use client";

import { useEffect, useState } from "react";
import { Store, Truck, Bell, Shield, CheckCircle2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchSettings, saveSettingsApi } from "@/lib/api/settings";
import type { StoreSettings } from "@/lib/store/settings-repo";

const CARRIERS = [
  { id: "hepsijet", label: "HepsiJet" },
  { id: "yurtici", label: "Yurtiçi Kargo" },
  { id: "aras", label: "Aras Kargo" },
  { id: "mng", label: "MNG Kargo" },
  { id: "ptt", label: "PTT Kargo" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  const save = async (patch: Partial<StoreSettings>) => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await saveSettingsApi(patch);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Ayarlar kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <>
        <AdminHeader title="Ayarlar" description="Mağaza, kargo ve bildirim yapılandırması" />
        <main className="p-8 flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Ayarlar" description="Mağaza, kargo ve bildirim yapılandırması — mağazaya senkronize edilir" />
      <main className="p-8">
        {saved && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Ayarlar kaydedildi
          </div>
        )}
        <Tabs defaultValue="store">
          <TabsList className="mb-6">
            <TabsTrigger value="store">Mağaza</TabsTrigger>
            <TabsTrigger value="shipping">Kargo</TabsTrigger>
            <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
            <TabsTrigger value="security">Güvenlik</TabsTrigger>
          </TabsList>

          <TabsContent value="store">
            <div className="rounded-xl border border-border bg-surface-elevated p-6 max-w-xl space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Store className="h-5 w-5 text-gold" />
                <h3 className="font-medium text-cream">Genel Bilgiler</h3>
              </div>
              <Field label="Mağaza Adı">
                <Input value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} />
              </Field>
              <Field label="Destek E-postası">
                <Input type="email" value={settings.storeEmail} onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })} />
              </Field>
              <Field label="Mağaza URL">
                <Input value={settings.storeUrl} readOnly className="opacity-60" />
              </Field>
              <Button onClick={() => save({ storeName: settings.storeName, storeEmail: settings.storeEmail })} disabled={saving}>
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="shipping">
            <div className="rounded-xl border border-border bg-surface-elevated p-6 max-w-xl space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Truck className="h-5 w-5 text-gold" />
                <h3 className="font-medium text-cream">Kargo Ayarları</h3>
              </div>
              <ToggleRow label="Ücretsiz Kargo" checked={settings.freeShipping} onChange={(v) => setSettings({ ...settings, freeShipping: v })} />
              {settings.freeShipping && (
                <Field label="Ücretsiz Kargo Alt Limiti (TL)">
                  <Input type="number" value={settings.freeShippingMin} onChange={(e) => setSettings({ ...settings, freeShippingMin: Number(e.target.value) })} />
                </Field>
              )}
              <Field label="Varsayılan Kargo Firması">
                <select
                  className="select-field"
                  value={settings.defaultCarrier}
                  onChange={(e) => setSettings({ ...settings, defaultCarrier: e.target.value })}
                >
                  {CARRIERS.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </Field>
              <Button onClick={() => save({ freeShipping: settings.freeShipping, freeShippingMin: settings.freeShippingMin, defaultCarrier: settings.defaultCarrier })} disabled={saving}>
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="rounded-xl border border-border bg-surface-elevated p-6 max-w-xl space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <Bell className="h-5 w-5 text-gold" />
                <h3 className="font-medium text-cream">Bildirimler</h3>
              </div>
              <ToggleRow label="Yeni sipariş bildirimi" checked={settings.orderNotifications} onChange={(v) => setSettings({ ...settings, orderNotifications: v })} />
              <ToggleRow label="Düşük stok uyarısı" checked={settings.lowStockAlerts} onChange={(v) => setSettings({ ...settings, lowStockAlerts: v })} />
              <ToggleRow label="Ödeme hatası bildirimi" checked={settings.paymentErrorAlerts} onChange={(v) => setSettings({ ...settings, paymentErrorAlerts: v })} />
              <ToggleRow label="Haftalık rapor e-postası" checked={settings.weeklyReportEmail} onChange={(v) => setSettings({ ...settings, weeklyReportEmail: v })} />
              <Button className="mt-4" onClick={() => save({
                orderNotifications: settings.orderNotifications,
                lowStockAlerts: settings.lowStockAlerts,
                paymentErrorAlerts: settings.paymentErrorAlerts,
                weeklyReportEmail: settings.weeklyReportEmail,
              })} disabled={saving}>
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="rounded-xl border border-border bg-surface-elevated p-6 max-w-xl space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-gold" />
                <h3 className="font-medium text-cream">Güvenlik & API</h3>
              </div>
              <Field label="Admin Oturum Süresi (saat)">
                <Input type="number" value={settings.sessionHours} onChange={(e) => setSettings({ ...settings, sessionHours: Number(e.target.value) })} />
              </Field>
              <ToggleRow label="İki faktörlü doğrulama (2FA)" checked={settings.twoFactorEnabled} onChange={(v) => setSettings({ ...settings, twoFactorEnabled: v })} />
              <p className="text-sm text-cream/50">Ödeme API anahtarları Ödeme Altyapısı sayfasından yönetilir.</p>
              <Button onClick={() => save({ sessionHours: settings.sessionHours, twoFactorEnabled: settings.twoFactorEnabled })} disabled={saving}>
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs text-cream/50 mb-1.5 block">{label}</label>{children}</div>;
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
      <span className="text-sm text-cream/70">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}