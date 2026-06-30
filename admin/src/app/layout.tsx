import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAVANON Admin",
  description: "RAVANON Premium Kozmetik — Yönetim Paneli",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}