import fs from "fs/promises";
import type { PaymentBankAccount, PaymentProvider } from "@/types/admin";
import { PAYMENTS_JSON } from "./paths";
import { MOCK_PAYMENT_PROVIDERS } from "@/lib/mock/payments";

interface PaymentsFile {
  version: number;
  updatedAt: string;
  providers: PaymentProvider[];
  bankAccount?: PaymentBankAccount;
}

const DEFAULT_BANK: PaymentBankAccount = {
  bank: "Ziraat Bankası",
  iban: "TR33 0001 0009 9901 4444 5555 01",
  holder: "RAVANON KOZMETİK TİC. A.Ş.",
  branch: "Kadıköy / İstanbul",
};

function maskKey(key?: string) {
  if (!key) return "—";
  if (key.length <= 8) return "****";
  return `${key.slice(0, 7)}****${key.slice(-4)}`;
}

function sanitizeProvider(p: PaymentProvider): PaymentProvider {
  const { apiSecret: _s, ...rest } = p;
  return { ...rest, apiKeyMasked: maskKey(p.apiKey) };
}

async function read(): Promise<PaymentsFile> {
  try {
    const data = JSON.parse(await fs.readFile(PAYMENTS_JSON, "utf8")) as PaymentsFile;
    if (!data.providers?.length) {
      data.providers = MOCK_PAYMENT_PROVIDERS;
      await write(data);
    }
    if (!data.bankAccount) data.bankAccount = DEFAULT_BANK;
    return data;
  } catch {
    const seed: PaymentsFile = {
      version: 1,
      updatedAt: new Date().toISOString(),
      providers: MOCK_PAYMENT_PROVIDERS,
      bankAccount: DEFAULT_BANK,
    };
    await write(seed);
    return seed;
  }
}

async function write(data: PaymentsFile) {
  data.updatedAt = new Date().toISOString();
  await fs.mkdir(PAYMENTS_JSON.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
  await fs.writeFile(PAYMENTS_JSON, JSON.stringify(data, null, 2), "utf8");
}

export async function getPaymentProviders(): Promise<PaymentProvider[]> {
  return (await read()).providers;
}

export async function getPaymentProvidersPublic(): Promise<PaymentProvider[]> {
  return (await read()).providers.map(sanitizeProvider);
}

export async function getProviderById(id: string): Promise<PaymentProvider | null> {
  return (await read()).providers.find((p) => p.id === id) ?? null;
}

export async function getBankAccount(): Promise<PaymentBankAccount> {
  const file = await read();
  return file.bankAccount ?? DEFAULT_BANK;
}

export async function savePaymentProviders(providers: PaymentProvider[]): Promise<PaymentProvider[]> {
  const file = await read();
  file.providers = providers.map((incoming) => {
    const existing = file.providers.find((p) => p.id === incoming.id);
    const merged = { ...existing, ...incoming };
    if (!incoming.apiKey && existing?.apiKey) merged.apiKey = existing.apiKey;
    if (!incoming.apiSecret && existing?.apiSecret) merged.apiSecret = existing.apiSecret;
    merged.apiKeyMasked = maskKey(merged.apiKey);
    return merged;
  });
  await write(file);
  return file.providers.map(sanitizeProvider);
}

export async function updateProviderCredentials(
  id: string,
  creds: { apiKey?: string; apiSecret?: string; merchantId?: string; testMode?: boolean }
): Promise<PaymentProvider | null> {
  const file = await read();
  const p = file.providers.find((x) => x.id === id);
  if (!p) return null;
  if (creds.apiKey !== undefined) p.apiKey = creds.apiKey;
  if (creds.apiSecret !== undefined) p.apiSecret = creds.apiSecret;
  if (creds.merchantId !== undefined) p.merchantId = creds.merchantId;
  if (creds.testMode !== undefined) p.testMode = creds.testMode;
  p.apiKeyMasked = maskKey(p.apiKey);
  await write(file);
  return sanitizeProvider(p);
}

export async function saveBankAccount(bank: PaymentBankAccount): Promise<PaymentBankAccount> {
  const file = await read();
  file.bankAccount = bank;
  await write(file);
  return bank;
}

export async function togglePaymentProvider(id: string): Promise<PaymentProvider | null> {
  const file = await read();
  const p = file.providers.find((x) => x.id === id);
  if (!p) return null;
  p.active = !p.active;
  await write(file);
  return sanitizeProvider(p);
}