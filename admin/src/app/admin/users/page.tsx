"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, UserX, Crown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "@/components/admin/header";
import { KpiCard } from "@/components/admin/kpi-card";
import { UsersTable } from "@/components/admin/users-table";
import { UserDetailDrawer } from "@/components/admin/user-detail-drawer";
import { InviteUserDialog } from "@/components/admin/invite-user-dialog";
import { fetchUsers } from "@/lib/api/users";
import { getUserKpis } from "@/lib/mock/users";
import type { AdminUser } from "@/types/admin";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
      setSyncedAt(new Date().toISOString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const kpis = getUserKpis(users);

  const handleUserClick = (user: AdminUser) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleUserUpdate = (updated: AdminUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setSelectedUser(updated);
  };

  return (
    <>
      <AdminHeader
        title="Kullanıcılar"
        description="Mağazada e-posta veya telefon ile kayıt olan aboneler — sipariş geçmişi ve AI logları"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Yenile
            </Button>
            <InviteUserDialog onInvited={load} />
          </div>
        }
      />

      <main className="p-8 space-y-6">
        {syncedAt && !loading && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-sm text-emerald-300">
            Mağaza aboneleri ile senkron — {users.length} kullanıcı · E-posta veya telefon ile kayıt olanlar burada görünür · Son güncelleme: {new Date(syncedAt).toLocaleTimeString("tr-TR")}
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Toplam Kullanıcı" value={kpis.total} icon={<Users className="h-5 w-5" />} />
          <KpiCard title="Aktif" value={kpis.active} icon={<UserCheck className="h-5 w-5" />} />
          <KpiCard title="Banlı" value={kpis.banned} icon={<UserX className="h-5 w-5" />} />
          <KpiCard title="Club Üyesi" value={kpis.club} icon={<Crown className="h-5 w-5" />} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
          </div>
        ) : (
          <UsersTable
            users={users}
            onUserClick={handleUserClick}
            onUsersChange={setUsers}
          />
        )}
      </main>

      <UserDetailDrawer
        user={selectedUser}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdate={handleUserUpdate}
      />
    </>
  );
}