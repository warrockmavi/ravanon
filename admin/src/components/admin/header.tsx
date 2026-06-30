"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/admin/global-search";
import { NotificationsPanel } from "@/components/admin/notifications-panel";

interface AdminHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-8">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-medium text-cream truncate">{title}</h1>
          {description && (
            <p className="text-xs text-cream/40 mt-0.5 truncate">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <GlobalSearch />
          <NotificationsPanel />
          <Button variant="outline" size="sm" asChild>
            <a href="http://localhost:8765" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Mağaza
            </a>
          </Button>
          {actions}
        </div>
      </div>
    </header>
  );
}