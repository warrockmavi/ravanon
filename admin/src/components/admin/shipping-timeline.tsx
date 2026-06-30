"use client";

import { cn, formatDateTime } from "@/lib/utils";
import type { ShippingTrackingEvent, ShipmentStatus } from "@/types/admin";
import { Package, Truck, MapPin, CheckCircle2 } from "lucide-react";

const STATUS_ICONS: Record<ShipmentStatus, React.ReactNode> = {
  preparing: <Package className="h-4 w-4" />,
  picked_up: <Truck className="h-4 w-4" />,
  in_transit: <Truck className="h-4 w-4" />,
  out_for_delivery: <MapPin className="h-4 w-4" />,
  delivered: <CheckCircle2 className="h-4 w-4" />,
  returned: <Package className="h-4 w-4" />,
};

interface ShippingTimelineProps {
  events: ShippingTrackingEvent[];
  compact?: boolean;
}

export function ShippingTimeline({ events, compact }: ShippingTimelineProps) {
  if (events.length === 0) {
    return <p className="text-sm text-cream/40">Henüz kargo hareketi yok.</p>;
  }

  const sorted = [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="relative space-y-0">
      {sorted.map((event, i) => {
        const isFirst = i === 0;
        return (
          <div key={event.id} className={cn("relative flex gap-3", !compact && "pb-5")}>
            {i < sorted.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
            )}
            <div
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                isFirst
                  ? "border-gold/40 bg-gold/15 text-gold"
                  : "border-border bg-surface text-cream/40"
              )}
            >
              {STATUS_ICONS[event.status]}
            </div>
            <div className="min-w-0 pt-0.5">
              <p className={cn("text-sm", isFirst ? "text-cream font-medium" : "text-cream/70")}>
                {event.title}
              </p>
              <p className="text-xs text-cream/40 mt-0.5">{event.location}</p>
              {!compact && (
                <p className="text-[10px] text-cream/30 mt-1">{formatDateTime(event.createdAt)}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}