"use client";

import { useEffect, useState } from "react";
import { Bot, MessageSquare, TrendingUp, Settings, Save } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { KpiCard } from "@/components/admin/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AIConfig } from "@/lib/ai/config-repo";
import type { AIChatLog } from "@/lib/ai/logs-repo";
import { formatDateTime } from "@/lib/utils";

export default function AdminAIPage() {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [logs, setLogs] = useState<AIChatLog[]>([]);
  const [stats, setStats] = useState<{ totalChats: number; todayChats: number; topIntents: [string, number][] } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [cfg, logData] = await Promise.all([
      fetch("/api/ai/config").then((r) => r.json()),
      fetch("/api/ai/logs").then((r) => r.json()),
    ]);
    setConfig(cfg);
    setLogs(logData.logs);
    setStats(logData.stats);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    await fetch("/api/ai/config", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
    setSaving(false);
  };

  if (!config) return <AdminHeader title="AI Yükleniyor..." />;

  return (
    <>
      <AdminHeader title="AI Güzellik Danışmanı" description="Mağaza AI chatbot — canlı katalog ve kullanıcı kişiselleştirmesi" />
      <main className="p-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Toplam Sohbet" value={stats?.totalChats ?? 0} icon={<MessageSquare className="h-5 w-5" />} />
          <KpiCard title="Bugün" value={stats?.todayChats ?? 0} icon={<TrendingUp className="h-5 w-5" />} />
          <KpiCard title="AI Durumu" value={config.enabled ? "Aktif" : "Kapalı"} icon={<Bot className="h-5 w-5" />} />
          <KpiCard title="Kişiselleştirme" value={config.usePersonalization ? "Açık" : "Kapalı"} icon={<Settings className="h-5 w-5" />} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>AI Ayarları</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
                <span className="text-sm text-cream/70">AI Danışman Aktif</span>
                <Switch checked={config.enabled} onCheckedChange={(v) => setConfig({ ...config, enabled: v })} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
                <span className="text-sm text-cream/70">Kullanıcı Kişiselleştirmesi</span>
                <Switch checked={config.usePersonalization} onCheckedChange={(v) => setConfig({ ...config, usePersonalization: v })} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
                <span className="text-sm text-cream/70">Sohbet Kaydı</span>
                <Switch checked={config.logConversations} onCheckedChange={(v) => setConfig({ ...config, logConversations: v })} />
              </div>
              <div>
                <label className="text-xs text-cream/50 mb-1.5 block">Bot Adı</label>
                <Input value={config.botName} onChange={(e) => setConfig({ ...config, botName: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-cream/50 mb-1.5 block">Karşılama Mesajı</label>
                <Input value={config.welcomeMessage} onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })} />
              </div>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4" /> {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Popüler Konular</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {(stats?.topIntents ?? []).map(([intent, count]) => (
                <div key={intent} className="flex justify-between text-sm py-2 border-b border-border">
                  <span className="text-cream capitalize">{intent.replace(/_/g, " ")}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
              {!stats?.topIntents?.length && <p className="text-cream/40 text-sm">Henüz sohbet yok</p>}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Son AI Sohbetleri</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="rounded-lg border border-border bg-surface p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-cream/50">{log.userName || log.userEmail || "Misafir"}</span>
                    <Badge variant="default">{log.intent}</Badge>
                  </div>
                  <p className="text-sm text-cream"><span className="text-gold">S:</span> {log.message}</p>
                  <p className="text-sm text-cream/70 mt-1"><span className="text-rose-gold">AI:</span> {log.response.slice(0, 120)}...</p>
                  <p className="text-[10px] text-cream/30 mt-2">{formatDateTime(log.createdAt)} · {log.productIds.length} ürün önerildi</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}