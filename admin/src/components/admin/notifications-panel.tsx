"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

interface NotificationItem {
  id: string;
  type: "order" | "stock";
  title: string;
  message: string;
  href: string;
  createdAt: string;
}

export function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const load = async () => {
    const res = await fetch("/api/notifications", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
      setUnread(data.unread);
    }
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button variant="ghost" size="icon" className="relative" onClick={() => { setOpen(!open); if (!open) load(); }}>
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-gold text-[9px] font-bold text-navy">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-surface-elevated shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-cream">Bildirimler</p>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-cream/40 text-center py-8">Yeni bildirim yok</p>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block px-4 py-3 hover:bg-white/5 border-b border-border last:border-0"
                  onClick={() => setOpen(false)}
                >
                  <p className="text-sm text-cream">{item.title}</p>
                  <p className="text-xs text-cream/50 mt-0.5">{item.message}</p>
                  <p className="text-[10px] text-cream/30 mt-1">{formatDateTime(item.createdAt)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}