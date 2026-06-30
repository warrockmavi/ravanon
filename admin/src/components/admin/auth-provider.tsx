"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { AdminRole } from "@/types/admin";
import { clientHasPermission } from "@/lib/auth/permissions-client";

export interface AdminSessionUser {
  id: string;
  email: string;
  name: string;
  roles: AdminRole[];
  permissions: string[];
}

interface AuthContextValue {
  admin: AdminSessionUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  hasPermission: (perm: string) => boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  admin: null,
  loading: true,
  logout: async () => {},
  hasPermission: () => false,
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminSessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAdmin(data.admin);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAdmin(null);
    window.location.href = "/admin/login";
  };

  const hasPermission = (perm: string) => clientHasPermission(admin, perm);

  return (
    <AuthContext.Provider value={{ admin, loading, logout, hasPermission, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}