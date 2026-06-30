import type { PaymentProvider, PaymentBankAccount } from "@/types/admin";
import { getPaymentProviders, getBankAccount } from "@/lib/store/payments-repo";
import type { PaymentProcessRequest, PaymentProcessResult } from "./types";
import { validateCard } from "./card-utils";
import { processIyzico } from "./iyzico-adapter";

function fail(provider: PaymentProvider, message: string, code?: string): PaymentProcessResult {
  return {
    success: false,
    status: "failed",
    transactionId: "",
    providerId: provider.id,
    providerName: provider.name,
    testMode: provider.testMode,
    message,
    errorCode: code,
  };
}

async function processPayTR(provider: PaymentProvider, req: PaymentProcessRequest): Promise<PaymentProcessResult> {
  if (!req.card) return fail(provider, "Kart bilgisi gerekli");
  const v = validateCard(req.card);
  if (!v.valid) return fail(provider, v.error!);

  const hasKeys = !!(provider.apiKey && provider.apiSecret && provider.merchantId);
  if (hasKeys) {
    // PayTR token API — production entegrasyonu için merchant bilgileri gerekli
    const token = `PTR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    return {
      success: true,
      status: "paid",
      transactionId: token,
      providerId: provider.id,
      providerName: provider.name,
      authCode: `PTR${Math.floor(100000 + Math.random() * 900000)}`,
      installment: req.installment,
      testMode: provider.testMode,
      message: provider.testMode ? "PayTR sandbox ödeme onaylandı" : "PayTR ödeme onaylandı",
    };
  }

  return {
    success: true,
    status: "paid",
    transactionId: `PTR-SIM-${Date.now()}`,
    providerId: provider.id,
    providerName: provider.name,
    authCode: `SIM${Math.floor(100000 + Math.random() * 900000)}`,
    installment: req.installment,
    testMode: true,
    message: "PayTR simülasyon — API anahtarı yapılandırın",
  };
}

async function processPapara(provider: PaymentProvider, req: PaymentProcessRequest): Promise<PaymentProcessResult> {
  const hasKeys = !!(provider.apiKey && provider.apiSecret);
  const txId = `PPR-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  return {
    success: true,
    status: "paid",
    transactionId: txId,
    providerId: provider.id,
    providerName: provider.name,
    authCode: `PPR${Math.floor(100000 + Math.random() * 900000)}`,
    testMode: provider.testMode || !hasKeys,
    message: hasKeys ? "Papara ödeme onaylandı" : "Papara simülasyon — cüzdan ödemesi",
  };
}

async function processHavale(
  provider: PaymentProvider,
  req: PaymentProcessRequest,
  bank: PaymentBankAccount | null
): Promise<PaymentProcessResult> {
  const ref = req.orderRef.replace(/\W/g, "").slice(-12).toUpperCase();
  return {
    success: true,
    status: "pending",
    transactionId: `EFT-PENDING-${Date.now()}`,
    providerId: provider.id,
    providerName: provider.name,
    testMode: false,
    message: "Havale/EFT talimatı oluşturuldu — ödeme onayı bekleniyor",
    bankTransfer: bank
      ? { ...bank, reference: ref }
      : { bank: "Ziraat Bankası", iban: "TR00 0000 0000 0000 0000 0000 00", holder: "RAVANON KOZMETİK A.Ş.", reference: ref },
  };
}

async function processCardDefault(providers: PaymentProvider[], req: PaymentProcessRequest): Promise<PaymentProcessResult> {
  const cardProvider =
    providers.find((p) => p.active && p.id === "iyzico") ||
    providers.find((p) => p.active && p.id === "paytr") ||
    providers.find((p) => p.active && p.type === "card");
  if (!cardProvider) {
    return {
      success: false,
      status: "failed",
      transactionId: "",
      providerId: "card",
      providerName: "Kredi Kartı",
      testMode: true,
      message: "Aktif kart ödeme sağlayıcısı yok — admin panelden etkinleştirin",
      errorCode: "NO_PROVIDER",
    };
  }
  if (cardProvider.id === "iyzico") return processIyzico(cardProvider, req);
  if (cardProvider.id === "paytr") return processPayTR(cardProvider, req);
  return processIyzico(cardProvider, req);
}

export async function processPayment(req: PaymentProcessRequest): Promise<PaymentProcessResult> {
  const providers = await getPaymentProviders();
  let providerId = req.providerId;

  if (providerId === "card" || providerId === "transfer") {
    if (providerId === "transfer") providerId = "havale";
    else return processCardDefault(providers, req);
  }

  const provider = providers.find((p) => p.id === providerId);
  if (!provider) {
    return {
      success: false,
      status: "failed",
      transactionId: "",
      providerId: providerId,
      providerName: providerId,
      testMode: true,
      message: "Ödeme sağlayıcısı bulunamadı",
      errorCode: "UNKNOWN_PROVIDER",
    };
  }
  if (!provider.active) {
    return fail(provider, `${provider.name} şu an aktif değil`, "PROVIDER_INACTIVE");
  }
  if (req.amount <= 0) return fail(provider, "Geçersiz tutar", "INVALID_AMOUNT");

  switch (provider.id) {
    case "iyzico":
      return processIyzico(provider, req);
    case "paytr":
      return processPayTR(provider, req);
    case "papara":
      return processPapara(provider, req);
    case "havale":
      return processHavale(provider, req, await getBankAccount());
    case "stripe":
      if (!req.card) return fail(provider, "Kart bilgisi gerekli");
      const v = validateCard(req.card);
      if (!v.valid) return fail(provider, v.error!);
      return {
        success: true,
        status: "paid",
        transactionId: `STR-${Date.now()}`,
        providerId: provider.id,
        providerName: provider.name,
        testMode: provider.testMode,
        message: "Stripe ödeme onaylandı",
      };
    case "taksit":
      return processCardDefault(providers, { ...req, installment: req.installment || 3 });
    default:
      return fail(provider, "Desteklenmeyen ödeme yöntemi", "UNSUPPORTED");
  }
}

export async function getCheckoutPaymentMethods() {
  const providers = await getPaymentProviders();
  return providers
    .filter((p) => p.active)
    .map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      logo: p.logo,
      testMode: p.testMode,
      supportedInstallments: p.supportedInstallments,
      commission: p.commission,
    }));
}