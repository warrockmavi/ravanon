import fs from "fs/promises";
import type { ShippingCarrier } from "@/types/admin";
import { SHIPPING_JSON } from "./paths";

interface ShippingFile {
  version: number;
  updatedAt: string;
  carriers: ShippingCarrier[];
}

const DEFAULT_CARRIERS: ShippingCarrier[] = [
  { id: "hepsijet", name: "HepsiJet", code: "HJ", logo: "⚡", trackingUrl: "https://www.hepsijet.com/takip/", active: true, avgDeliveryDays: 1 },
  { id: "yurtici", name: "Yurtiçi Kargo", code: "YK", logo: "📦", trackingUrl: "https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=", active: true, avgDeliveryDays: 2 },
  { id: "aras", name: "Aras Kargo", code: "AR", logo: "🚚", trackingUrl: "https://www.araskargo.com.tr/trmm.aspx?q=", active: true, avgDeliveryDays: 2 },
  { id: "mng", name: "MNG Kargo", code: "MNG", logo: "📮", trackingUrl: "https://www.mngkargo.com.tr/tracking?code=", active: true, avgDeliveryDays: 3 },
  { id: "ptt", name: "PTT Kargo", code: "PTT", logo: "✉️", trackingUrl: "https://gonderitakip.ptt.gov.tr/", active: false, avgDeliveryDays: 4 },
];

async function read(): Promise<ShippingFile> {
  try {
    const data = JSON.parse(await fs.readFile(SHIPPING_JSON, "utf8")) as ShippingFile;
    if (!data.carriers?.length) {
      data.carriers = DEFAULT_CARRIERS;
      await write(data);
    }
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

export async function saveCarriers(carriers: ShippingCarrier[]): Promise<ShippingCarrier[]> {
  const file = await read();
  file.carriers = carriers;
  await write(file);
  return carriers;
}

export async function toggleCarrier(id: string): Promise<ShippingCarrier | null> {
  const file = await read();
  const c = file.carriers.find((x) => x.id === id);
  if (!c) return null;
  c.active = !c.active;
  await write(file);
  return c;
}

export function getCarrierByCode(carriers: ShippingCarrier[], code: string) {
  return carriers.find((c) => c.code === code);
}