"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createDemoOrder } from "@/lib/api/demo";

interface DemoOrderButtonProps {
  size?: "sm" | "default";
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

export function DemoOrderButton({ size = "sm", variant = "outline", className }: DemoOrderButtonProps) {
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      await createDemoOrder();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Demo başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={className}
      onClick={run}
      disabled={loading}
      title="Restoran tarzı bildirim demosu — ses + uyarı balonu"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      Demo Sipariş
    </Button>
  );
}