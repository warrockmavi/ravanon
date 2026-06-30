"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchResult {
  type: string;
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

const TYPE_LABELS: Record<string, string> = {
  user: "Kullanıcı",
  order: "Sipariş",
  product: "Ürün",
};

export function GlobalSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
        setOpen(true);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative hidden md:block" ref={ref}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/30 z-10" />
      <Input
        placeholder="Ürün, sipariş veya kullanıcı ara..."
        className="w-64 pl-9 h-9 bg-surface-elevated"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
      />
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-xl border border-border bg-surface-elevated shadow-2xl overflow-hidden z-50">
          {results.map((r) => (
            <button
              key={`${r.type}-${r.id}`}
              className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-border last:border-0"
              onClick={() => {
                router.push(r.href);
                setOpen(false);
                setQ("");
              }}
            >
              <p className="text-sm text-cream">{r.title}</p>
              <p className="text-xs text-cream/40">{TYPE_LABELS[r.type]} · {r.subtitle}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}