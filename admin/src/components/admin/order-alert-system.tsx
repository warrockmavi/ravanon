"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BellRing, Package, Volume2, VolumeX, X } from "lucide-react";
import type { AdminOrder } from "@/types/admin";
import {
  isOrderAlertSoundEnabled,
  playNewOrderChime,
  setOrderAlertSoundEnabled,
  unlockOrderAlertAudio,
} from "@/lib/order-alert-sound";
import { formatCurrency } from "@/lib/utils";

const POLL_MS = 6000;
const TOAST_TTL_MS = 14000;

interface OrderToast {
  id: string;
  order: AdminOrder;
  createdAt: number;
}

function showBrowserNotification(order: AdminOrder) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    const n = new Notification("Yeni Sipariş — RAVANON", {
      body: `${order.customerName} · ${order.total.toLocaleString("tr-TR")} TL · ${order.items.length} ürün`,
      icon: "/favicon.ico",
      tag: `order-${order.id}`,
      requireInteraction: true,
    });
    n.onclick = () => {
      window.focus();
      window.location.href = "/admin/orders";
      n.close();
    };
  } catch {
    /* optional */
  }
}

export function OrderAlertSystem() {
  const knownIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);
  const [toasts, setToasts] = useState<OrderToast[]>([]);
  const [soundOn, setSoundOn] = useState(true);
  const [live, setLive] = useState(false);

  const pushToast = useCallback((order: AdminOrder) => {
    setToasts((prev) => [
      { id: `${order.id}-${Date.now()}`, order, createdAt: Date.now() },
      ...prev.slice(0, 4),
    ]);
  }, []);

  const alertNewOrder = useCallback(
    (order: AdminOrder) => {
      playNewOrderChime();
      pushToast(order);
      showBrowserNotification(order);
      window.dispatchEvent(new CustomEvent("ravanon-new-order", { detail: order }));
    },
    [pushToast]
  );

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) return;
      const { orders } = (await res.json()) as { orders: AdminOrder[] };
      setLive(true);

      if (!initialized.current) {
        orders.forEach((o) => knownIds.current.add(o.id));
        initialized.current = true;
        return;
      }

      const fresh = orders.filter((o) => !knownIds.current.has(o.id));
      for (const order of fresh) {
        knownIds.current.add(order.id);
        if (order.status === "processing" || order.status === "confirmed" || order.status === "pending") {
          alertNewOrder(order);
        }
      }
    } catch {
      setLive(false);
    }
  }, [alertNewOrder]);

  useEffect(() => {
    setSoundOn(isOrderAlertSoundEnabled());

    const unlock = () => unlockOrderAlertAudio();
    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });

    if ("Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission();
    }

    void poll();
    const iv = setInterval(poll, POLL_MS);
    return () => {
      clearInterval(iv);
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, [poll]);

  useEffect(() => {
    const iv = setInterval(() => {
      const cutoff = Date.now() - TOAST_TTL_MS;
      setToasts((prev) => prev.filter((t) => t.createdAt > cutoff));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setOrderAlertSoundEnabled(next);
    if (next) {
      unlockOrderAlertAudio();
      playNewOrderChime();
    }
  };

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <>
      {/* Canlı izleme göstergesi */}
      <div className="fixed bottom-4 left-[17rem] z-[60] flex items-center gap-2 rounded-full border border-border bg-surface-elevated/95 px-3 py-1.5 shadow-lg backdrop-blur-md">
        <span
          className={`h-2 w-2 rounded-full ${live ? "bg-emerald-400 animate-pulse" : "bg-cream/30"}`}
        />
        <span className="text-[11px] text-cream/60">
          {live ? "Sipariş dinleniyor" : "Bağlantı bekleniyor"}
        </span>
        <button
          type="button"
          onClick={toggleSound}
          className="ml-1 rounded-md p-1 text-cream/50 hover:bg-white/5 hover:text-gold transition-colors"
          title={soundOn ? "Bildirim sesini kapat" : "Bildirim sesini aç"}
        >
          {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Uyarı balonları */}
      <div className="fixed bottom-4 right-4 z-[70] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t, i) => (
          <div
            key={t.id}
            className="pointer-events-auto order-alert-toast rounded-2xl border-2 border-gold/50 bg-surface-elevated shadow-2xl overflow-hidden animate-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="bg-gradient-to-r from-gold/20 to-rose-gold/10 px-4 py-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-gold">
                <BellRing className="h-4 w-4 animate-bounce" />
                <span className="text-sm font-semibold tracking-wide">YENİ SİPARİŞ</span>
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="text-cream/40 hover:text-cream p-0.5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-4 py-3">
              <p className="font-medium text-cream">{t.order.customerName}</p>
              <p className="text-xs text-cream/50 mt-0.5 font-mono">{t.order.id}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-semibold text-gold">{formatCurrency(t.order.total)}</span>
                <span className="text-xs text-cream/40 flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  {t.order.items.length} ürün · Kargoya hazır
                </span>
              </div>
              <Link
                href="/admin/orders"
                onClick={() => dismiss(t.id)}
                className="mt-3 block w-full text-center py-2.5 rounded-xl bg-gold text-navy text-sm font-semibold hover:bg-gold-light transition-colors"
              >
                Siparişi Aç & Kargola
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}