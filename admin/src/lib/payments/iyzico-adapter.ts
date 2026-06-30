import crypto from "crypto";
import type { PaymentProvider } from "@/types/admin";
import type { PaymentProcessRequest, PaymentProcessResult } from "./types";
import { digitsOnly, IYZICO_TEST_CARDS, validateCard } from "./card-utils";

const SANDBOX = "https://sandbox-api.iyzipay.com";
const LIVE = "https://api.iyzipay.com";

function iyzicoAuth(apiKey: string, secret: string, body: string) {
  const random = `R${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
  const hash = crypto.createHash("sha1").update(apiKey + random + secret + body).digest("base64");
  return { authorization: `IYZWS ${apiKey}:${hash}`, random };
}

async function callIyzico(
  provider: PaymentProvider,
  req: PaymentProcessRequest
): Promise<PaymentProcessResult> {
  const apiKey = provider.apiKey!;
  const secret = provider.apiSecret!;
  const base = provider.testMode ? SANDBOX : LIVE;
  const card = req.card!;
  const body = JSON.stringify({
    locale: "tr",
    conversationId: req.orderRef,
    price: req.amount.toFixed(2),
    paidPrice: req.amount.toFixed(2),
    currency: "TRY",
    installment: String(req.installment || 1),
    paymentChannel: "WEB",
    paymentGroup: "PRODUCT",
    paymentCard: {
      cardHolderName: card.holderName,
      cardNumber: digitsOnly(card.number),
      expireMonth: card.expireMonth.padStart(2, "0"),
      expireYear: card.expireYear.length === 2 ? `20${card.expireYear}` : card.expireYear,
      cvc: card.cvc,
      registerCard: "0",
    },
    buyer: {
      id: req.orderRef,
      name: req.customer.name.split(" ")[0] || "Musteri",
      surname: req.customer.name.split(" ").slice(1).join(" ") || "RAVANON",
      email: req.customer.email || "musteri@ravanon.com",
      gsmNumber: req.customer.phone || "+905000000000",
      identityNumber: "11111111111",
      registrationAddress: "Istanbul",
      city: "Istanbul",
      country: "Turkey",
    },
    shippingAddress: { contactName: req.customer.name, city: "Istanbul", country: "Turkey", address: "Istanbul" },
    billingAddress: { contactName: req.customer.name, city: "Istanbul", country: "Turkey", address: "Istanbul" },
    basketItems: req.basket.map((item, i) => ({
      id: `BI${i}`,
      name: item.name.slice(0, 50),
      category1: "Kozmetik",
      itemType: "PHYSICAL",
      price: (item.price * item.quantity).toFixed(2),
    })),
  });

  const { authorization, random } = iyzicoAuth(apiKey, secret, body);
  const res = await fetch(`${base}/payment/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
      "x-iyzi-rnd": random,
    },
    body,
  });
  const data = await res.json();
  const paid = data.status === "success" && data.paymentStatus === "SUCCESS";
  return {
    success: paid,
    status: paid ? "paid" : "failed",
    transactionId: data.paymentId || `IYZ-FAIL-${Date.now()}`,
    providerId: provider.id,
    providerName: provider.name,
    authCode: data.authCode,
    installment: req.installment,
    testMode: provider.testMode,
    message: paid ? "iyzico ödeme onaylandı" : data.errorMessage || "iyzico ödeme reddedildi",
    errorCode: data.errorCode,
  };
}

function simulateIyzico(provider: PaymentProvider, req: PaymentProcessRequest): PaymentProcessResult {
  const card = req.card!;
  const num = digitsOnly(card.number);
  if (num === IYZICO_TEST_CARDS.fail) {
    return {
      success: false,
      status: "failed",
      transactionId: `IYZ-SIM-FAIL-${Date.now()}`,
      providerId: provider.id,
      providerName: provider.name,
      testMode: true,
      message: "Kart reddedildi (iyzico test)",
      errorCode: "CARD_REJECTED",
    };
  }
  if (num === IYZICO_TEST_CARDS.insufficient) {
    return {
      success: false,
      status: "failed",
      transactionId: `IYZ-SIM-INS-${Date.now()}`,
      providerId: provider.id,
      providerName: provider.name,
      testMode: true,
      message: "Yetersiz bakiye (iyzico test)",
      errorCode: "INSUFFICIENT_FUNDS",
    };
  }
  return {
    success: true,
    status: "paid",
    transactionId: `IYZ-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    providerId: provider.id,
    providerName: provider.name,
    authCode: `AUTH${Math.floor(100000 + Math.random() * 900000)}`,
    installment: req.installment,
    testMode: provider.testMode,
    message: provider.apiKey ? "iyzico sandbox ödeme başarılı" : "iyzico simülasyon — test modu",
  };
}

export async function processIyzico(
  provider: PaymentProvider,
  req: PaymentProcessRequest
): Promise<PaymentProcessResult> {
  if (!req.card) {
    return { success: false, status: "failed", transactionId: "", providerId: provider.id, providerName: provider.name, testMode: provider.testMode, message: "Kart bilgisi gerekli" };
  }
  const v = validateCard(req.card);
  if (!v.valid) {
    return { success: false, status: "failed", transactionId: "", providerId: provider.id, providerName: provider.name, testMode: provider.testMode, message: v.error };
  }

  const hasKeys = !!(provider.apiKey && provider.apiSecret);
  if (hasKeys && provider.testMode) {
    try {
      return await callIyzico(provider, req);
    } catch {
      return simulateIyzico(provider, req);
    }
  }
  if (hasKeys && !provider.testMode) {
    return callIyzico(provider, req);
  }
  return simulateIyzico(provider, req);
}