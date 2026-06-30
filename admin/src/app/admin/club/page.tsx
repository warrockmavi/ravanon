"use client";

import { useEffect, useState } from "react";
import { Crown, Users, Gift, Settings, CheckCircle2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { fetchClub, saveClubApi } from "@/lib/api/store";
import type { ClubTierConfig } from "@/types/admin";
import type { ClubSettings } from "@/lib/store/club-repo";

export default function AdminClubPage() {
  const [tiers, setTiers] = useState<ClubTierConfig[]>([]);
  const [settings, setSettings] = useState<ClubSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchClub().then((data) => {
      setTiers(data.tiers);
      setSettings(data.settings);
      setLoading(false);
    });
  }, []);

  const totalMembers = tiers.reduce((s, t) => s + t.memberCount, 0);

  const updateTier = (id: string, field: keyof ClubTierConfig, value: number) => {
    setTiers((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await saveClubApi(tiers, settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <>
        <AdminHeader title="RAVANON Club" />
        <main className="p-8 text-cream/50">Yükleniyor...</main>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="RAVANON Club" description="Tier ve puan ayarları mağazaya anında yansır" />
      <main className="p-8 space-y-8">
        {saved && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Club ayarları mağazaya senkronize edildi
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Users className="h-5 w-5" />} label="Toplam Üye" value={totalMembers.toLocaleString("tr-TR")} />
          <StatCard icon={<Crown className="h-5 w-5" />} label="Platinum" value={tiers.find((t) => t.id === "platinum")?.memberCount ?? 0} />
          <StatCard icon={<Gift className="h-5 w-5" />} label="Hoş Geldin Bonusu" value={`${settings.welcomeBonus} puan`} />
          <StatCard icon={<Settings className="h-5 w-5" />} label="Ücretsiz Kargo" value={`${settings.freeShippingMin} TL+`} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Genel Ayarlar</CardTitle>
            <CardDescription>Mağaza checkout ve üyelik sistemi</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <SettingField label="Hoş Geldin Bonusu (puan)">
              <Input type="number" value={settings.welcomeBonus} onChange={(e) => setSettings({ ...settings, welcomeBonus: Number(e.target.value) })} />
            </SettingField>
            <SettingField label="Ücretsiz Kargo Alt Limiti (TL)">
              <Input type="number" value={settings.freeShippingMin} onChange={(e) => setSettings({ ...settings, freeShippingMin: Number(e.target.value) })} />
            </SettingField>
            <SettingField label="Min. Kullanım Puanı">
              <Input type="number" value={settings.minRedeemPoints} onChange={(e) => setSettings({ ...settings, minRedeemPoints: Number(e.target.value) })} />
            </SettingField>
            <SettingField label="Puan Geçerlilik (ay)">
              <Input type="number" value={settings.pointExpiryMonths} onChange={(e) => setSettings({ ...settings, pointExpiryMonths: Number(e.target.value) })} />
            </SettingField>
            <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
              <span className="text-sm text-cream/70">Otomatik Tier Yükseltme</span>
              <Switch checked={settings.autoTierUpgrade} onCheckedChange={(v) => setSettings({ ...settings, autoTierUpgrade: v })} />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full border-2 flex items-center justify-center font-display font-semibold" style={{ borderColor: tier.color, color: tier.color }}>
                    {tier.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle>{tier.name}</CardTitle>
                    <CardDescription>{tier.memberCount} üye · Her {tier.pointRate} TL = 1 puan</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <SettingField label="Min. Puan Eşiği">
                  <Input type="number" value={tier.minPoints} onChange={(e) => updateTier(tier.id, "minPoints", Number(e.target.value))} />
                </SettingField>
                <SettingField label="Puan Kazanım Oranı (TL/puan)">
                  <Input type="number" value={tier.pointRate} onChange={(e) => updateTier(tier.id, "pointRate", Number(e.target.value))} />
                </SettingField>
                <SettingField label="Doğum Günü İndirimi (%)">
                  <Input type="number" value={tier.birthdayDiscount} onChange={(e) => updateTier(tier.id, "birthdayDiscount", Number(e.target.value))} />
                </SettingField>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Senkronize ediliyor..." : saved ? "Kaydedildi!" : "Kaydet & Mağazaya Gönder"}
          </Button>
        </div>
      </main>
    </>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-cream/40">{label}</p>
          <p className="font-display text-2xl text-cream mt-2">{value}</p>
        </div>
        <div className="text-gold">{icon}</div>
      </div>
    </div>
  );
}

function SettingField({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs text-cream/50 mb-1.5 block">{label}</label>{children}</div>;
}