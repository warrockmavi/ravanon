"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ADMIN_ROLES } from "@/lib/roles";
import type { AdminRole } from "@/types/admin";
import { inviteUser } from "@/lib/api/users";
import { cn } from "@/lib/utils";

interface InviteUserDialogProps {
  onInvited?: () => void;
}

export function InviteUserDialog({ onInvited }: InviteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await inviteUser({ name, email, roles });
      if (result.inviteLink) {
        navigator.clipboard?.writeText(result.inviteLink);
        alert(`Davet oluşturuldu!\n\nDavet linki panoya kopyalandı:\n${result.inviteLink}`);
      }
      setOpen(false);
      setName("");
      setEmail("");
      setRoles([]);
      onInvited?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Davet gönderilemedi");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" />
        Kullanıcı Davet Et
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-surface-elevated p-6 shadow-2xl">
        <h2 className="font-display text-lg text-cream mb-1">Yeni Kullanıcı Davet Et</h2>
        <p className="text-sm text-cream/40 mb-6">E-posta ile davet linki gönderilir</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-cream/50 mb-1.5 block">Ad Soyad</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ayşe Yılmaz" />
          </div>
          <div>
            <label className="text-xs text-cream/50 mb-1.5 block">E-posta</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ayse@email.com" />
          </div>
          <div>
            <label className="text-xs text-cream/50 mb-1.5 block">Roller (opsiyonel)</label>
            <div className="flex flex-wrap gap-2">
              {ADMIN_ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() =>
                    setRoles((prev) =>
                      prev.includes(r.id) ? prev.filter((x) => x !== r.id) : [...prev, r.id]
                    )
                  }
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-all",
                    roles.includes(r.id)
                      ? "border-gold/40 bg-gold/10 text-gold"
                      : "border-border text-cream/50 hover:border-gold/20"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Gönderiliyor..." : "Davet Gönder"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}