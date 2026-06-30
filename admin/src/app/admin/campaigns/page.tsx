"use client";

import { useEffect, useState } from "react";
import { Tag, Percent, RefreshCw, CheckCircle2, Plus, Trash2, Pencil } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchCampaigns, toggleCampaignApi } from "@/lib/api/store";
import type { Campaign } from "@/types/admin";
import { formatDate } from "@/lib/utils";

const TYPE_LABELS = { percent: "% İndirim", fixed: "Sabit TL", shipping: "Ücretsiz Kargo", points: "Puan Çarpanı" };

const EMPTY: Omit<Campaign, "id"> = {
  name: "",
  code: "",
  type: "percent",
  value: 10,
  minOrder: 250,
  usageCount: 0,
  active: true,
  startsAt: new Date().toISOString().slice(0, 10),
  endsAt: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
};

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setCampaigns(await fetchCampaigns());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (id: string) => {
    const updated = await toggleCampaignApi(id);
    setCampaigns((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setSynced(true);
    setTimeout(() => setSynced(false), 2000);
  };

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const { campaign } = await res.json();
      setCampaigns((prev) => [...prev, campaign]);
      setShowForm(false);
      setForm(EMPTY);
      setSynced(true);
      setTimeout(() => setSynced(false), 2000);
    } catch {
      alert("Kampanya oluşturulamadı");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (c: Campaign) => {
    setEditingId(c.id);
    setForm({ name: c.name, code: c.code, type: c.type, value: c.value, minOrder: c.minOrder, usageCount: c.usageCount, usageLimit: c.usageLimit, active: c.active, startsAt: c.startsAt, endsAt: c.endsAt });
    setShowForm(false);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/campaigns/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editingId }),
      });
      if (!res.ok) throw new Error();
      const { campaign } = await res.json();
      setCampaigns((prev) => prev.map((c) => (c.id === editingId ? campaign : c)));
      setEditingId(null);
      setForm(EMPTY);
      setSynced(true);
      setTimeout(() => setSynced(false), 2000);
    } catch {
      alert("Kampanya güncellenemedi");
    } finally {
      setSaving(false);
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm("Bu kampanyayı silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      setSynced(true);
      setTimeout(() => setSynced(false), 2000);
    }
  };

  return (
    <>
      <AdminHeader
        title="İndirimler & Kampanyalar"
        description="Kupon kodları mağazada anında aktif/pasif olur"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Yenile
            </Button>
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              Yeni Kampanya
            </Button>
          </div>
        }
      />
      <main className="p-8 space-y-4">
        {synced && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Mağazaya senkronize edildi
          </div>
        )}

        {editingId && (
          <Card>
            <CardContent className="p-5">
              <form onSubmit={saveEdit} className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Kampanya adı" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <Input placeholder="Kupon kodu" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
                <select className="select-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Campaign["type"] })}>
                  <option value="percent">Yüzde İndirim</option>
                  <option value="fixed">Sabit TL</option>
                  <option value="shipping">Ücretsiz Kargo</option>
                  <option value="points">Puan Çarpanı</option>
                </select>
                <Input type="number" placeholder="Değer" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} required />
                <Input type="number" placeholder="Min. sipariş (TL)" value={form.minOrder ?? ""} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} />
                <Input type="date" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
                <Input type="date" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
                <div className="md:col-span-2 flex gap-2">
                  <Button type="submit" disabled={saving}>{saving ? "Kaydediliyor..." : "Güncelle"}</Button>
                  <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm(EMPTY); }}>İptal</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {showForm && (
          <Card>
            <CardContent className="p-5">
              <form onSubmit={createCampaign} className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Kampanya adı" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <Input placeholder="Kupon kodu" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
                <select className="select-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Campaign["type"] })}>
                  <option value="percent">Yüzde İndirim</option>
                  <option value="fixed">Sabit TL</option>
                  <option value="shipping">Ücretsiz Kargo</option>
                  <option value="points">Puan Çarpanı</option>
                </select>
                <Input type="number" placeholder="Değer" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} required />
                <Input type="number" placeholder="Min. sipariş (TL)" value={form.minOrder ?? ""} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} />
                <Input type="date" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
                <Input type="date" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
                <div className="md:col-span-2 flex gap-2">
                  <Button type="submit" disabled={saving}>{saving ? "Kaydediliyor..." : "Oluştur"}</Button>
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>İptal</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <p className="text-cream/50">Yükleniyor...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-cream/50 text-center py-12">Henüz kampanya yok — Yeni Kampanya ile ekleyin</p>
        ) : (
          campaigns.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold shrink-0">
                  {c.type === "percent" ? <Percent className="h-5 w-5" /> : <Tag className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-cream">{c.name}</h3>
                    <Badge variant={c.active ? "success" : "secondary"}>{c.active ? "Aktif" : "Pasif"}</Badge>
                  </div>
                  <p className="text-sm text-gold font-mono mt-1">{c.code}</p>
                  <p className="text-xs text-cream/40 mt-1">
                    {TYPE_LABELS[c.type]} · {c.value}{c.type === "percent" ? "%" : c.type === "points" ? "x" : ""}
                    {c.minOrder ? ` · Min. ${c.minOrder} TL` : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-cream">{c.usageCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""} kullanım</p>
                  <p className="text-xs text-cream/40">{formatDate(c.startsAt)} — {formatDate(c.endsAt)}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(c)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant={c.active ? "secondary" : "default"} size="sm" onClick={() => toggleActive(c.id)}>
                    {c.active ? "Durdur" : "Aktifleştir"}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => deleteCampaign(c.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </>
  );
}