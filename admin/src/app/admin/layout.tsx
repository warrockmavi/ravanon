"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AuthProvider } from "@/components/admin/auth-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <div className="pl-64">{children}</div>
      </div>
    </AuthProvider>
  );
}