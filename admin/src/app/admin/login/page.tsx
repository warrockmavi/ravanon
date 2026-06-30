"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("admin@ravanon.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Giriş başarısız");
        return;
      }
      const next = searchParams.get("next") || "/admin";
      router.push(next);
      router.refresh();
    } catch {
      setError("Sunucuya bağlanılamadı");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-surface-elevated p-8 shadow-2xl">
      <div className="flex flex-col items-center mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-rose-gold mb-4">
          <Sparkles className="h-7 w-7 text-navy" />
        </div>
        <h1 className="font-display text-2xl text-cream">RAVANON Admin</h1>
        <p className="text-sm text-cream/40 mt-1">Yönetim paneline giriş yapın</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-cream/50 mb-1.5 block">E-posta</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
        </div>
        <div>
          <label className="text-xs text-cream/50 mb-1.5 block">Şifre</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          <Lock className="h-4 w-4" />
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>

      <p className="text-[10px] text-cream/30 text-center mt-6">
        Varsayılan: admin@ravanon.com / Ravanon2026!
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Suspense fallback={<div className="text-cream/40">Yükleniyor...</div>}>
        <LoginForm />
      </Suspense>
      <p className="mt-6 max-w-md text-center text-[10px] leading-relaxed text-cream/30">
        Site tasarımı ve admin paneli{" "}
        <span className="font-medium text-gold/70">Bafralı Oğuzhan</span>
        &apos;a aittir.
      </p>
    </div>
  );
}