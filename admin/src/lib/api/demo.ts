import type { AdminOrder } from "@/types/admin";
import { unlockOrderAlertAudio } from "@/lib/order-alert-sound";

export async function createDemoOrder(): Promise<AdminOrder> {
  unlockOrderAlertAudio();
  const res = await fetch("/api/orders/demo", { method: "POST" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Demo sipariş oluşturulamadı");
  }
  const json = await res.json();
  const order = json.order as AdminOrder;
  window.dispatchEvent(new CustomEvent("ravanon-demo-order", { detail: order }));
  return order;
}