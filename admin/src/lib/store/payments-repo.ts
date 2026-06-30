import fs from "fs/promises";
import type { PaymentProvider } from "@/types/admin";
import { PAYMENTS_JSON } from "./paths";
import { MOCK_PAYMENT_PROVIDERS } from "@/lib/mock/payments";

interface PaymentsFile {
  version: number;
  updatedAt: string;
  providers: PaymentProvider[];
}

async function read(): Promise<PaymentsFile> {
  try {
    const data = JSON.parse(await fs.readFile(PAYMENTS_JSON, "utf8")) as PaymentsFile;
    if (!data.providers?.length) {
      data.providers = MOCK_PAYMENT_PROVIDERS;
      await write(data);
    }
    return data;
  } catch {
    const seed: PaymentsFile = {
      version: 1,
      updatedAt: new Date().toISOString(),
      providers: MOCK_PAYMENT_PROVIDERS,
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

export async function savePaymentProviders(providers: PaymentProvider[]): Promise<PaymentProvider[]> {
  const file = await read();
  file.providers = providers;
  await write(file);
  return providers;
}

export async function togglePaymentProvider(id: string): Promise<PaymentProvider | null> {
  const file = await read();
  const p = file.providers.find((x) => x.id === id);
  if (!p) return null;
  p.active = !p.active;
  await write(file);
  return p;
}