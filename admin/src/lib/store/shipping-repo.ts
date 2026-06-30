import fs from "fs/promises";
import type { ShippingCarrier, ShippingServiceRate } from "@/types/admin";
import { SHIPPING_JSON } from "./paths";

interface ShippingFile {
  version: number;
  updatedAt: string;
  carriers: ShippingCarrier[];
}

const DEFAULT_WAREHOUSE = {
  name: "RAVANON Depo",
  address: "Bağdat Cad. No:123",
  city: "İstanbul",
  phone: "+902161234567",
};

const DEFAULT_SERVICES: Record<string, ShippingServiceRate[]> = {
  hepsijet: [
    { id: "express", name: "Hızlı Teslimat", basePrice: 89.9, etaDays: 1, active: true },
    { id: "standard", name: "Standart", basePrice: 49.9, etaDays: 2, active: true },
  ],
  yurtici: [{ id: "standard", name: "Standart", basePrice: 44.9, etaDays: 2, active: true }],
  aras: [{ id: "standard", name: "Standart", basePrice: 42.9, etaDays: 2, active: true }],
  mng: [{ id: "standard", name: "Standart", basePrice: 39.9, etaDays: 3, active: true }],
  ptt: [{ id: "standard", name: "Standart", basePrice: 35.9, etaDays: 4, active: true }],
};

const DEFAULT_CARRIERS: ShippingCarrier[] = [
  { id: "hepsijet", name: "HepsiJet", code: "HJ", logo: "⚡", trackingUrl: "https://www.hepsijet.com/takip/", active: true, testMode: true, avgDeliveryDays: 1, apiKeyMasked: "—", services: DEFAULT_SERVICES.hepsijet, warehouse: DEFAULT_WAREHOUSE },
  { id: "yurtici", name: "Yurtiçi Kargo", code: "YK", logo: "📦", trackingUrl: "https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=", active: true, testMode: true, avgDeliveryDays: 2, apiKeyMasked: "—", services: DEFAULT_SERVICES.yurtici, warehouse: DEFAULT_WAREHOUSE },
  { id: "aras", name: "Aras Kargo", code: "AR", logo: "🚚", trackingUrl: "https://www.araskargo.com.tr/trmm.aspx?q=", active: true, testMode: true, avgDeliveryDays: 2, apiKeyMasked: "—", services: DEFAULT_SERVICES.aras, warehouse: DEFAULT_WAREHOUSE },
  { id: "mng", name: "MNG Kargo", code: "MNG", logo: "📮", trackingUrl: "https://www.mngkargo.com.tr/tracking?code=", active: true, testMode: true, avgDeliveryDays: 3, apiKeyMasked: "—", services: DEFAULT_SERVICES.mng, warehouse: DEFAULT_WAREHOUSE },
  { id: "ptt", name: "PTT Kargo", code: "PTT", logo: "✉️", trackingUrl: "https://gonderitakip.ptt.gov.tr/", active: true, testMode: true, avgDeliveryDays: 4, apiKeyMasked: "—", services: DEFAULT_SERVICES.ptt, warehouse: DEFAULT_WAREHOUSE },
];

function maskKey(key?: string) {
  if (!key) return "—";
  if (key.length <= 8) return "****";
  return `${key.slice(0, 6)}****${key.slice(-4)}`;
}

function mergeCarrier(existing: ShippingCarrier | undefined, incoming: Partial<ShippingCarrier>): ShippingCarrier {
  const base = existing || DEFAULT_CARRIERS.find((c) => c.id === incoming.id)!;
  const merged = { ...base, ...incoming };
  if (!incoming.apiKey && existing?.apiKey) merged.apiKey = existing.apiKey;
  if (!incoming.apiSecret && existing?.apiSecret) merged.apiSecret = existing.apiSecret;
  if (!merged.services?.length) merged.services = DEFAULT_SERVICES[merged.id] || [{ id: "standard", name: "Standart", basePrice: 49.9, etaDays: 2, active: true }];
  merged.apiKeyMasked = maskKey(merged.apiKey);
  return merged;
}

function sanitize(carrier: ShippingCarrier): ShippingCarrier {
  const { apiSecret: _s, apiKey: _k, ...rest } = carrier;
  return { ...rest, apiKeyMasked: maskKey(carrier.apiKey) };
}

async function read(): Promise<ShippingFile> {
  try {
    const data = JSON.parse(await fs.readFile(SHIPPING_JSON, "utf8")) as ShippingFile;
    if (!data.carriers?.length) {
      data.carriers = DEFAULT_CARRIERS;
      await write(data);
      return data;
    }
    data.carriers = data.carriers.map((c) => mergeCarrier(c, c));
    return data;
  } catch {
    const seed: ShippingFile = { version: 1, updatedAt: new Date().toISOString(), carriers: DEFAULT_CARRIERS };
    await write(seed);
    return seed;
  }
}

async function write(data: ShippingFile) {
  data.updatedAt = new Date().toISOString();
  await fs.mkdir(SHIPPING_JSON.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
  await fs.writeFile(SHIPPING_JSON, JSON.stringify(data, null, 2), "utf8");
}

export async function getCarriers(): Promise<ShippingCarrier[]> {
  return (await read()).carriers;
}

export async function getCarriersPublic(): Promise<ShippingCarrier[]> {
  return (await read()).carriers.map(sanitize);
}

export async function getCarrierById(id: string): Promise<ShippingCarrier | null> {
  return (await read()).carriers.find((c) => c.id === id) ?? null;
}

export async function saveCarriers(carriers: ShippingCarrier[]): Promise<ShippingCarrier[]> {
  const file = await read();
  file.carriers = carriers.map((c) => mergeCarrier(file.carriers.find((x) => x.id === c.id), c));
  await write(file);
  return file.carriers.map(sanitize);
}

export async function toggleCarrier(id: string): Promise<ShippingCarrier | null> {
  const file = await read();
  const c = file.carriers.find((x) => x.id === id);
  if (!c) return null;
  c.active = !c.active;
  await write(file);
  return sanitize(c);
}

export async function updateCarrierCredentials(
  id: string,
  creds: { apiKey?: string; apiSecret?: string; customerCode?: string; testMode?: boolean }
): Promise<ShippingCarrier | null> {
  const file = await read();
  const c = file.carriers.find((x) => x.id === id);
  if (!c) return null;
  if (creds.apiKey !== undefined) c.apiKey = creds.apiKey;
  if (creds.apiSecret !== undefined) c.apiSecret = creds.apiSecret;
  if (creds.customerCode !== undefined) c.customerCode = creds.customerCode;
  if (creds.testMode !== undefined) c.testMode = creds.testMode;
  c.apiKeyMasked = maskKey(c.apiKey);
  await write(file);
  return sanitize(c);
}

export function getCarrierByCode(carriers: ShippingCarrier[], code: string) {
  return carriers.find((c) => c.code === code);
}