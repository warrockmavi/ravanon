import type { PaymentProvider, PaymentTransaction } from "@/types/admin";

export const MOCK_PAYMENT_PROVIDERS: PaymentProvider[] = [
  { id: "iyzico", name: "iyzico", type: "card", logo: "💳", active: true, testMode: false, commission: 2.49, supportedInstallments: [1, 2, 3, 6, 9, 12], apiKeyMasked: "iyz_live_****7K2m" },
  { id: "paytr", name: "PayTR", type: "card", logo: "🏦", active: true, testMode: true, commission: 2.89, supportedInstallments: [1, 3, 6, 9], apiKeyMasked: "ptr_test_****9Xp1" },
  { id: "stripe", name: "Stripe", type: "card", logo: "🌐", active: false, testMode: true, commission: 2.9, supportedInstallments: [1], apiKeyMasked: "sk_test_****Wq8n" },
  { id: "papara", name: "Papara", type: "wallet", logo: "📱", active: true, testMode: false, commission: 1.5, supportedInstallments: [1], apiKeyMasked: "ppr_****3Lm9" },
  { id: "havale", name: "Havale / EFT", type: "transfer", logo: "🏛️", active: true, testMode: false, commission: 0, supportedInstallments: [1], apiKeyMasked: "—" },
  { id: "taksit", name: "Banka Taksit", type: "installment", logo: "📊", active: true, testMode: false, commission: 3.2, supportedInstallments: [3, 6, 9, 12], apiKeyMasked: "—" },
];

export const MOCK_TRANSACTIONS: PaymentTransaction[] = [
  { id: "tx1", orderId: "RVN-P9L2K1", provider: "iyzico", amount: 3396, status: "paid", customerName: "Zeynep Arslan", installment: 3, createdAt: "2026-06-29T18:00:00Z" },
  { id: "tx2", orderId: "RVN-A3F8W9", provider: "iyzico", amount: 1213, status: "paid", customerName: "Fatma İnce", createdAt: "2026-06-30T09:15:00Z" },
  { id: "tx3", orderId: "RVN-B5H2Q7", provider: "PayTR", amount: 1148, status: "paid", customerName: "Selin Yıldız", createdAt: "2026-06-30T12:30:00Z" },
  { id: "tx4", orderId: "RVN-C1D4E6", provider: "Havale / EFT", amount: 4299, status: "pending", customerName: "Deniz Mavi", createdAt: "2026-06-30T13:45:00Z" },
  { id: "tx5", orderId: "RVN-D8G3F1", provider: "iyzico", amount: 438, status: "refunded", customerName: "Can Öztürk", createdAt: "2026-05-20T10:00:00Z" },
  { id: "tx6", orderId: "RVN-M2K8X4", provider: "Papara", amount: 1488, status: "paid", customerName: "Elif Kaya", createdAt: "2026-06-28T14:30:00Z" },
];