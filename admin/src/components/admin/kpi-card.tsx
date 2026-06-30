import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function KpiCard({ title, value, change, icon, className }: KpiCardProps) {
  const positive = change !== undefined && change >= 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface-elevated p-5 transition-all hover:border-gold/20 hover:shadow-glow",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-cream/40">{title}</p>
          <p className="font-display text-2xl font-semibold text-cream mt-2">{value}</p>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 mt-2 text-xs", positive ? "text-emerald-400" : "text-red-400")}>
              {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{positive ? "+" : ""}{change}% bu ay</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}