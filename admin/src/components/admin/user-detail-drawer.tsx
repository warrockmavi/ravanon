"use client";

import { useEffect, useState } from "react";
import {
  Crown,
  Shield,
  Clock,
  FileText,
  UserCog,
  Ban,
  CheckCircle,
  Package,
  Loader2,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PermissionManager } from "@/components/admin/permission-manager";
import { fetchUserDetail, impersonateUser, updateUser } from "@/lib/api/users";
import type { ClubTierHistory } from "@/types/admin";
import { useAuth } from "@/components/admin/auth-provider";
import type { ActivityEvent, AuditLogEntry } from "@/types/admin";
import { getRoleLabel, getRoleColor } from "@/lib/roles";
import type { AdminOrder, AdminRole, AdminUser } from "@/types/admin";
import { cn, formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

interface UserDetailDrawerProps {
  user: AdminUser | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (user: AdminUser) => void;
}

const STATUS_MAP = {
  active: { label: "Aktif", variant: "success" as const },
  banned: { label: "Banlı", variant: "destructive" as const },
  pending: { label: "Beklemede", variant: "warning" as const },
  invited: { label: "Davetli", variant: "secondary" as const },
};

const TIER_COLORS: Record<string, string> = {
  bronze: "text-amber-600",
  silver: "text-gray-300",
  gold: "text-gold",
  platinum: "text-rose-gold",
};

const ORDER_STATUS_LABEL: Record<string, string> = {
  processing: "Hazırlanıyor",
  confirmed: "Onaylandı",
  shipped: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal",
  refunded: "İade",
};

export function UserDetailDrawer({ user, open, onClose, onUpdate }: UserDetailDrawerProps) {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [pointHistory, setPointHistory] = useState<{ id: number; type: string; amount: number; description: string; createdAt: number }[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [tierHistory, setTierHistory] = useState<ClubTierHistory[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { hasPermission } = useAuth();

  useEffect(() => {
    if (user) {
      setRoles(user.roles);
      setPermissions(user.permissions);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !open) return;
    setOrdersLoading(true);
    fetchUserDetail(user.id)
      .then((data) => {
        setOrders(data.orders);
        setPointHistory(data.pointHistory ?? []);
        setActivities(data.activities ?? []);
        setAuditLogs(data.auditLogs ?? []);
        setTierHistory(data.tierHistory ?? []);
      })
      .catch(() => {
        setOrders([]);
        setPointHistory([]);
        setActivities([]);
        setAuditLogs([]);
        setTierHistory([]);
      })
      .finally(() => setOrdersLoading(false));
  }, [user, open]);

  if (!user) return null;

  const status = STATUS_MAP[user.status];

  const handleSavePermissions = async () => {
    setSaving(true);
    try {
      const updated = await updateUser(user.id, { roles, permissions });
      onUpdate(updated);
    } catch {
      alert("İzinler kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const handleImpersonate = async () => {
    const { url } = await impersonateUser(user.id);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleToggleBan = async () => {
    const next = user.status === "banned" ? "active" : "banned";
    setSaving(true);
    try {
      const updated = await updateUser(user.id, {
        status: next,
        bannedAt: next === "banned" ? new Date().toISOString() : undefined,
        bannedReason: next === "banned" ? "Admin tarafından banlandı" : undefined,
      });
      onUpdate(updated);
    } catch {
      alert("Kullanıcı durumu güncellenemedi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="p-0 overflow-hidden">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-border bg-surface-elevated p-6 pr-14">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold/30 to-rose-gold/30 border border-gold/20 text-xl font-display text-gold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-xl text-cream">{user.name}</h2>
                <p className="text-sm text-cream/50">{user.email}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  {user.isClubMember && (
                    <Badge variant="default">
                      <Crown className="h-3 w-3 mr-1" />
                      Club · {user.clubTier}
                    </Badge>
                  )}
                  {user.roles.map((r) => (
                    <span key={r} className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium", getRoleColor(r))}>
                      {getRoleLabel(r)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="rounded-lg bg-surface border border-border p-3 text-center">
                <p className="text-xs text-cream/40">Puan</p>
                <p className={cn("text-lg font-semibold", TIER_COLORS[user.clubTier])}>{user.clubPoints}</p>
              </div>
              <div className="rounded-lg bg-surface border border-border p-3 text-center">
                <p className="text-xs text-cream/40">Harcama</p>
                <p className="text-lg font-semibold text-cream">{formatCurrency(user.lifetimeSpend)}</p>
              </div>
              <div className="rounded-lg bg-surface border border-border p-3 text-center">
                <p className="text-xs text-cream/40">Sipariş</p>
                <p className="text-lg font-semibold text-cream">{user.totalOrders}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {hasPermission("users.impersonate") && (
                <Button size="sm" variant="outline" onClick={handleImpersonate}>
                  <UserCog className="h-3.5 w-3.5" />
                  Mağazada Aç
                </Button>
              )}
              {hasPermission("users.ban") && (
              <Button size="sm" variant={user.status === "banned" ? "default" : "destructive"} onClick={handleToggleBan} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : user.status === "banned" ? (
                  <><CheckCircle className="h-3.5 w-3.5" /> Ban Kaldır</>
                ) : (
                  <><Ban className="h-3.5 w-3.5" /> Banla</>
                )}
              </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-1 overflow-y-auto p-6">
            <Tabs defaultValue="info">
              <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
                <TabsTrigger value="info">Bilgiler</TabsTrigger>
                <TabsTrigger value="orders">
                  Siparişler
                  {orders.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-gold/20 px-1.5 text-[10px] text-gold">{orders.length}</span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="permissions">Roller & İzinler</TabsTrigger>
                <TabsTrigger value="activity">Aktivite</TabsTrigger>
                <TabsTrigger value="audit">Audit Log</TabsTrigger>
                <TabsTrigger value="club">Club</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <InfoRow label="Telefon" value={user.phone ?? "—"} />
                <InfoRow label="Kayıt Tarihi" value={formatDate(user.createdAt)} />
                <InfoRow label="Son Giriş" value={user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "—"} />
                <InfoRow label="Club Tier" value={user.clubTier.toUpperCase()} />
                {user.bannedAt && (
                  <>
                    <InfoRow label="Ban Tarihi" value={formatDateTime(user.bannedAt)} />
                    <InfoRow label="Ban Nedeni" value={user.bannedReason ?? "—"} />
                  </>
                )}
              </TabsContent>

              <TabsContent value="orders">
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12 text-cream/40">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Siparişler yükleniyor...
                  </div>
                ) : orders.length === 0 ? (
                  <EmptyState icon={<Package className="h-8 w-8" />} text="Bu kullanıcının siparişi yok" />
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="rounded-lg border border-border bg-surface p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-mono text-gold">{order.id}</p>
                            <p className="text-xs text-cream/40 mt-0.5">{formatDateTime(order.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-cream">{formatCurrency(order.total)}</p>
                            <Badge variant="secondary" className="mt-1 text-[10px]">
                              {ORDER_STATUS_LABEL[order.status] ?? order.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-xs text-cream/70">
                              <span className="truncate pr-2">
                                {item.quantity}× {item.name}
                                {item.brand ? <span className="text-cream/40"> · {item.brand}</span> : null}
                              </span>
                              <span className="shrink-0 text-cream/50">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="permissions">
                <PermissionManager
                  roles={roles}
                  permissions={permissions}
                  onRolesChange={setRoles}
                  onPermissionsChange={setPermissions}
                />
                <Button className="mt-4 w-full" onClick={handleSavePermissions} disabled={saving}>
                  <Shield className="h-4 w-4" />
                  {saving ? "Kaydediliyor..." : "İzinleri Kaydet"}
                </Button>
              </TabsContent>

              <TabsContent value="activity">
                {activities.length === 0 ? (
                  <EmptyState icon={<Clock className="h-8 w-8" />} text="Henüz aktivite yok" />
                ) : (
                  <div className="space-y-3">
                    {activities.map((a) => (
                      <div key={a.id} className="flex gap-3 rounded-lg border border-border bg-surface p-3">
                        <ActivityIcon type={a.type} />
                        <div>
                          <p className="text-sm font-medium text-cream">{a.title}</p>
                          <p className="text-xs text-cream/40">{a.description}</p>
                          <p className="text-[10px] text-cream/30 mt-1">{formatDateTime(a.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="audit">
                {auditLogs.length === 0 ? (
                  <EmptyState icon={<FileText className="h-8 w-8" />} text="Audit kaydı yok" />
                ) : (
                  <div className="space-y-3">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="rounded-lg border border-border bg-surface p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-mono text-gold">{log.action}</p>
                          <p className="text-[10px] text-cream/30">{formatDateTime(log.createdAt)}</p>
                        </div>
                        <p className="text-sm text-cream mt-1">{log.details}</p>
                        <p className="text-xs text-cream/40 mt-1">İşlemi yapan: {log.actorName}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="club" className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-cream mb-3">Tier Geçmişi</h4>
                  {tierHistory.length === 0 ? (
                    <p className="text-sm text-cream/40">Tier değişikliği yok</p>
                  ) : (
                    tierHistory.map((t) => (
                      <div key={t.id} className="flex items-center gap-2 text-sm text-cream/70 py-2 border-b border-border last:border-0">
                        <span className="uppercase text-gold">{t.from}</span>
                        <span>→</span>
                        <span className="uppercase text-rose-gold">{t.to}</span>
                        <span className="text-cream/30 ml-auto text-xs">{formatDate(t.createdAt)}</span>
                      </div>
                    ))
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-cream mb-3">Puan Geçmişi</h4>
                  {pointHistory.length === 0 ? (
                    <p className="text-sm text-cream/40">Puan hareketi yok</p>
                  ) : (
                    pointHistory.map((p) => (
                      <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm text-cream">{p.description}</p>
                          <p className="text-[10px] text-cream/30">{formatDateTime(new Date(p.createdAt).toISOString())}</p>
                        </div>
                        <span className={cn("text-sm font-semibold", p.amount > 0 ? "text-emerald-400" : "text-red-400")}>
                          {p.amount > 0 ? "+" : ""}{p.amount}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border">
      <span className="text-sm text-cream/50">{label}</span>
      <span className="text-sm text-cream font-medium">{value}</span>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-cream/30">
      {icon}
      <p className="text-sm mt-3">{text}</p>
    </div>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const colors: Record<string, string> = {
    login: "bg-blue-500/20 text-blue-300",
    order: "bg-gold/20 text-gold",
    club: "bg-rose-gold/20 text-rose-gold",
    profile: "bg-emerald-500/20 text-emerald-300",
    support: "bg-purple-500/20 text-purple-300",
    admin: "bg-red-500/20 text-red-300",
  };
  return (
    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", colors[type] ?? "bg-white/10")}>
      <Clock className="h-4 w-4" />
    </div>
  );
}