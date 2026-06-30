import fs from "fs/promises";
import type { AdminOrder, AdminRole, AdminUser, ClubTier, ClubTierHistory } from "@/types/admin";
import { getClubData } from "./club-repo";
import { USERS_JSON } from "./paths";
import { getOrders } from "./orders-repo";
import { MOCK_USERS } from "@/lib/mock/users";

export interface StoreUserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  points?: number;
  tier?: string;
  lifetimeSpend?: number;
  totalOrders?: number;
  birthday?: string;
  clubJoinedAt?: number;
  createdAt: number | string;
  lastLoginAt?: number | string;
  status?: AdminUser["status"];
  bannedAt?: string;
  bannedReason?: string;
  pointHistory?: { id: number; type: string; amount: number; description: string; orderId?: string; createdAt: number }[];
  roles?: AdminRole[];
  permissions?: string[];
  inviteToken?: string;
  inviteExpiresAt?: number;
  tierHistory?: ClubTierHistory[];
}

interface UsersFile {
  version: number;
  updatedAt: string;
  users: StoreUserRecord[];
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "").slice(-10);
}

async function resolveTierFromPoints(points: number): Promise<ClubTier> {
  const { tiers } = await getClubData();
  const sorted = [...tiers].sort((a, b) => b.minPoints - a.minPoints);
  const match = sorted.find((t) => points >= t.minPoints);
  return (match?.id as ClubTier) ?? "bronze";
}

function appendTierHistory(
  user: StoreUserRecord,
  from: ClubTier,
  to: ClubTier,
  reason: string
) {
  if (from === to) return;
  user.tierHistory = user.tierHistory ?? [];
  user.tierHistory.unshift({
    id: `th_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId: user.id,
    from,
    to,
    reason,
    createdAt: new Date().toISOString(),
  });
  if (user.tierHistory.length > 20) user.tierHistory = user.tierHistory.slice(0, 20);
}

function toAdminUser(u: StoreUserRecord, orders: AdminOrder[]): AdminUser {
  const userOrders = orders.filter(
    (o) => o.userId === u.id || o.customerEmail.toLowerCase() === u.email.toLowerCase()
  );
  const spend = userOrders.reduce((s, o) => s + o.total, 0) || u.lifetimeSpend || 0;
  const tier = (u.tier as ClubTier) || "bronze";
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    status: u.status ?? "active",
    roles: u.roles ?? [],
    permissions: u.permissions ?? [],
    isClubMember: true,
    clubTier: tier,
    clubPoints: u.points ?? 0,
    lifetimeSpend: spend,
    totalOrders: userOrders.length || u.totalOrders || 0,
    lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt).toISOString() : new Date(u.createdAt).toISOString(),
    createdAt: new Date(u.createdAt).toISOString(),
    bannedAt: u.bannedAt,
    bannedReason: u.bannedReason,
  };
}

async function read(): Promise<UsersFile> {
  try {
    const data = JSON.parse(await fs.readFile(USERS_JSON, "utf8")) as UsersFile;
    if (!data.users?.length) {
      data.users = MOCK_USERS.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        points: m.clubPoints,
        tier: m.clubTier,
        lifetimeSpend: m.lifetimeSpend,
        totalOrders: m.totalOrders,
        status: m.status,
        bannedAt: m.bannedAt,
        bannedReason: m.bannedReason,
        createdAt: m.createdAt,
        lastLoginAt: m.lastLoginAt,
        clubJoinedAt: Date.parse(m.createdAt),
        roles: m.roles,
        permissions: m.permissions,
      }));
      await write(data);
    }
    return data;
  } catch {
    const seed: UsersFile = {
      version: 1,
      updatedAt: new Date().toISOString(),
      users: MOCK_USERS.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        points: m.clubPoints,
        tier: m.clubTier,
        lifetimeSpend: m.lifetimeSpend,
        totalOrders: m.totalOrders,
        status: m.status,
        createdAt: m.createdAt,
        lastLoginAt: m.lastLoginAt,
        roles: m.roles,
        permissions: m.permissions,
      })),
    };
    await write(seed);
    return seed;
  }
}

async function write(data: UsersFile) {
  data.updatedAt = new Date().toISOString();
  await fs.mkdir(USERS_JSON.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
  await fs.writeFile(USERS_JSON, JSON.stringify(data, null, 2), "utf8");
}

export async function getUsers(): Promise<AdminUser[]> {
  const [file, orders] = await Promise.all([read(), getOrders()]);
  return file.users.map((u) => toAdminUser(u, orders));
}

export async function getUserById(id: string): Promise<AdminUser | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function getUserOrders(userId: string, email: string): Promise<AdminOrder[]> {
  const orders = await getOrders();
  return orders.filter(
    (o) => o.userId === userId || o.customerEmail.toLowerCase() === email.toLowerCase()
  );
}

export async function upsertStoreUser(raw: StoreUserRecord): Promise<AdminUser> {
  const file = await read();
  const id = String(raw.id);
  const idx = file.users.findIndex((u) => u.id === id);
  const existing = idx >= 0 ? file.users[idx] : null;
  const merged: StoreUserRecord = {
    ...existing,
    ...raw,
    id,
    email: raw.email?.toLowerCase() ?? existing?.email ?? "",
    createdAt: existing?.createdAt ?? raw.createdAt ?? Date.now(),
    lastLoginAt: raw.lastLoginAt ?? Date.now(),
    status: existing?.status ?? "active",
    tierHistory: existing?.tierHistory ?? [],
  };
  const oldTier = (existing?.tier as ClubTier) ?? "bronze";
  const newPoints = merged.points ?? existing?.points ?? 0;
  const computedTier = await resolveTierFromPoints(newPoints);
  merged.tier = (raw.tier as ClubTier) ?? computedTier;
  if (merged.tier !== oldTier) {
    appendTierHistory(merged, oldTier, merged.tier as ClubTier, "Puan eşiği güncellendi");
  }
  if (idx >= 0) file.users[idx] = merged;
  else file.users.push(merged);
  await write(file);
  const orders = await getOrders();
  return toAdminUser(merged, orders);
}

export async function registerStoreUser(data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  birthday?: string;
  points?: number;
}): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  const file = await read();
  if (file.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, error: "Bu e-posta zaten kayıtlı" };
  }
  if (data.phone) {
    const np = normalizePhone(data.phone);
    if (file.users.some((u) => u.phone && normalizePhone(u.phone) === np)) {
      return { success: false, error: "Bu telefon numarası zaten kayıtlı" };
    }
  }
  const id = String(Date.now());
  const record: StoreUserRecord = {
    id,
    name: data.name,
    email: data.email.toLowerCase(),
    phone: data.phone,
    password: data.password,
    points: data.points ?? 100,
    tier: "bronze",
    lifetimeSpend: 0,
    totalOrders: 0,
    birthday: data.birthday,
    clubJoinedAt: Date.now(),
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
    status: "active",
  };
  file.users.push(record);
  await write(file);
  return { success: true, user: toAdminUser(record, []) };
}

export async function loginStoreUser(identifier: string, password: string): Promise<{ success: boolean; error?: string; user?: StoreUserRecord }> {
  const file = await read();
  const idLower = identifier.toLowerCase().trim();
  const phoneNorm = normalizePhone(identifier);
  const user = file.users.find((u) => {
    if (u.status === "banned") return false;
    if (u.email.toLowerCase() === idLower && u.password === password) return true;
    if (u.phone && normalizePhone(u.phone) === phoneNorm && u.password === password) return true;
    return false;
  });
  if (!user) return { success: false, error: "E-posta/telefon veya şifre hatalı" };
  if (user.status === "banned") return { success: false, error: "Hesabınız askıya alınmış" };
  user.lastLoginAt = Date.now();
  await write(file);
  return { success: true, user };
}

export async function updateUserAdmin(id: string, patch: Partial<AdminUser>): Promise<AdminUser | null> {
  const file = await read();
  const idx = file.users.findIndex((u) => u.id === id);
  if (idx < 0) return null;
  const u = file.users[idx];
  if (patch.name) u.name = patch.name;
  if (patch.email) u.email = patch.email;
  if (patch.phone !== undefined) u.phone = patch.phone;
  if (patch.status) u.status = patch.status;
  if (patch.bannedAt !== undefined) u.bannedAt = patch.bannedAt;
  if (patch.bannedReason !== undefined) u.bannedReason = patch.bannedReason;
  const oldTier = (u.tier as ClubTier) ?? "bronze";
  if (patch.clubPoints !== undefined) u.points = patch.clubPoints;
  if (patch.clubTier) u.tier = patch.clubTier;
  else if (patch.clubPoints !== undefined) u.tier = await resolveTierFromPoints(patch.clubPoints);
  const newTier = (u.tier as ClubTier) ?? "bronze";
  if (newTier !== oldTier) {
    appendTierHistory(u, oldTier, newTier, "Admin tarafından güncellendi");
  }
  if (patch.roles) u.roles = patch.roles;
  if (patch.permissions) u.permissions = patch.permissions;
  await write(file);
  return toAdminUser(u, await getOrders());
}

export async function bulkBanUsers(ids: string[]): Promise<AdminUser[]> {
  const file = await read();
  const now = new Date().toISOString();
  const updated: AdminUser[] = [];
  for (const id of ids) {
    const u = file.users.find((x) => x.id === id);
    if (!u) continue;
    u.status = "banned";
    u.bannedAt = now;
    u.bannedReason = "Toplu ban — admin";
    updated.push(toAdminUser(u, []));
  }
  await write(file);
  const orders = await getOrders();
  return updated.map((u) => toAdminUser(file.users.find((x) => x.id === u.id)!, orders));
}

export async function inviteStoreUser(data: {
  name: string;
  email: string;
  roles?: AdminRole[];
}): Promise<{ success: boolean; error?: string; user?: AdminUser; inviteToken?: string }> {
  const file = await read();
  if (file.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, error: "Bu e-posta zaten kayıtlı" };
  }
  const id = String(Date.now());
  const inviteToken = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const record: StoreUserRecord = {
    id,
    name: data.name,
    email: data.email.toLowerCase(),
    points: 0,
    tier: "bronze",
    lifetimeSpend: 0,
    totalOrders: 0,
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
    status: "invited",
    roles: data.roles ?? [],
    permissions: [],
    inviteToken,
    inviteExpiresAt: Date.now() + 7 * 86400000,
  };
  file.users.push(record);
  await write(file);
  return { success: true, user: toAdminUser(record, []), inviteToken };
}

export async function findByEmailOrPhone(identifier: string): Promise<AdminUser | null> {
  const file = await read();
  const idLower = identifier.toLowerCase().trim();
  const phoneNorm = normalizePhone(identifier);
  const found = file.users.find(
    (u) => u.email.toLowerCase() === idLower || (u.phone && normalizePhone(u.phone) === phoneNorm)
  );
  if (!found) return null;
  return toAdminUser(found, await getOrders());
}

export async function getStoreUserRecord(id: string): Promise<StoreUserRecord | null> {
  const file = await read();
  return file.users.find((u) => u.id === id) ?? null;
}

export async function acceptInviteStoreUser(data: {
  token: string;
  password: string;
  phone?: string;
  birthday?: string;
}): Promise<{ success: boolean; error?: string; user?: StoreUserRecord }> {
  const file = await read();
  const user = file.users.find((u) => u.inviteToken === data.token);
  if (!user) return { success: false, error: "Geçersiz veya süresi dolmuş davet" };
  if (user.inviteExpiresAt && Date.now() > user.inviteExpiresAt) {
    return { success: false, error: "Davet süresi dolmuş" };
  }
  if (user.status !== "invited") return { success: false, error: "Bu davet zaten kullanılmış" };
  if (data.phone) {
    const np = normalizePhone(data.phone);
    if (file.users.some((u) => u.id !== user.id && u.phone && normalizePhone(u.phone) === np)) {
      return { success: false, error: "Bu telefon numarası zaten kayıtlı" };
    }
    user.phone = data.phone;
  }
  const welcomeBonus = (await getClubData()).settings.welcomeBonus ?? 100;
  user.password = data.password;
  user.birthday = data.birthday;
  user.status = "active";
  user.points = welcomeBonus;
  user.tier = "bronze";
  user.clubJoinedAt = Date.now();
  user.lastLoginAt = Date.now();
  user.pointHistory = [{
    id: Date.now(),
    type: "welcome",
    amount: welcomeBonus,
    description: "RAVANON Club hoş geldin bonusu",
    createdAt: Date.now(),
  }];
  delete user.inviteToken;
  delete user.inviteExpiresAt;
  await write(file);
  const { password: _pw, ...safe } = user;
  return { success: true, user: safe as StoreUserRecord };
}