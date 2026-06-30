import fs from "fs/promises";
import type { AdminRole } from "@/types/admin";
import { ADMINS_JSON } from "./paths";
import { hashPassword } from "@/lib/auth/session";

export interface AdminAccount {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  roles: AdminRole[];
  permissions?: string[];
  active: boolean;
}

interface AdminsFile {
  version: number;
  updatedAt: string;
  admins: AdminAccount[];
}

const DEFAULT_ADMINS: AdminAccount[] = [
  {
    id: "admin-1",
    email: "admin@ravanon.com",
    passwordHash: hashPassword("Ravanon2026!"),
    name: "Oğuzhan Mavi Bafralı",
    roles: ["super_admin"],
    active: true,
  },
];

async function read(): Promise<AdminsFile> {
  try {
    const data = JSON.parse(await fs.readFile(ADMINS_JSON, "utf8")) as AdminsFile;
    if (!data.admins?.length) {
      data.admins = DEFAULT_ADMINS;
      await write(data);
    }
    return data;
  } catch {
    const seed: AdminsFile = { version: 1, updatedAt: new Date().toISOString(), admins: DEFAULT_ADMINS };
    await write(seed);
    return seed;
  }
}

async function write(data: AdminsFile) {
  data.updatedAt = new Date().toISOString();
  await fs.mkdir(ADMINS_JSON.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
  await fs.writeFile(ADMINS_JSON, JSON.stringify(data, null, 2), "utf8");
}

export async function authenticateAdmin(email: string, password: string): Promise<AdminAccount | null> {
  const file = await read();
  const hash = hashPassword(password);
  const admin = file.admins.find(
    (a) => a.active && a.email.toLowerCase() === email.toLowerCase() && a.passwordHash === hash
  );
  return admin ?? null;
}

export async function getAdminById(id: string): Promise<AdminAccount | null> {
  const file = await read();
  return file.admins.find((a) => a.id === id) ?? null;
}