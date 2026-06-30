# RAVANON Admin Panel

Modern SaaS yönetim paneli — Next.js + TypeScript + Tailwind + TanStack Table + Recharts.

## Başlatma

```bash
cd admin
npm run dev
```

Tarayıcı: **http://localhost:3000/admin**

## Sayfalar

| Rota | Açıklama |
|------|----------|
| `/admin` | Dashboard — KPI, satış grafikleri, Club artışı |
| `/admin/users` | Kullanıcı yönetimi — tablo, filtre, bulk actions, detay drawer |

## Özellikler

- **RBAC**: Super Admin, Platform Admin, Support Agent, Content Manager, Finance
- **Granular Permissions**: 25+ izin, gruplandırılmış yönetim
- **Kullanıcı Detay**: Aktivite timeline, audit log, Club tier/puan geçmişi
- **Impersonation**: Support için demo butonu
- **Export**: CSV dışa aktarma
- **Mock Data**: Gerçek API için `src/lib/api/` yorumlu stub'lar hazır

## Teknoloji

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- TanStack Table v8
- Recharts
- Radix UI primitives