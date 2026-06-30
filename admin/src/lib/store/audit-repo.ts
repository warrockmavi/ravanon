import fs from "fs/promises";
import type { ActivityEvent, AuditLogEntry } from "@/types/admin";
import { AUDIT_JSON } from "./paths";

interface AuditFile {
  version: number;
  updatedAt: string;
  logs: AuditLogEntry[];
  activities: ActivityEvent[];
}

async function read(): Promise<AuditFile> {
  try {
    return JSON.parse(await fs.readFile(AUDIT_JSON, "utf8")) as AuditFile;
  } catch {
    return { version: 1, updatedAt: new Date().toISOString(), logs: [], activities: [] };
  }
}

async function write(data: AuditFile) {
  data.updatedAt = new Date().toISOString();
  await fs.mkdir(AUDIT_JSON.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
  await fs.writeFile(AUDIT_JSON, JSON.stringify(data, null, 2), "utf8");
}

export async function addAuditLog(entry: Omit<AuditLogEntry, "id" | "createdAt">) {
  const file = await read();
  const log: AuditLogEntry = {
    ...entry,
    id: `aud-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  file.logs.unshift(log);
  if (file.logs.length > 500) file.logs = file.logs.slice(0, 500);
  await write(file);
  return log;
}

export async function addActivity(entry: Omit<ActivityEvent, "id" | "createdAt">) {
  const file = await read();
  const act: ActivityEvent = {
    ...entry,
    id: `act-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  file.activities.unshift(act);
  if (file.activities.length > 1000) file.activities = file.activities.slice(0, 1000);
  await write(file);
  return act;
}

export async function getAuditLogs(limit = 100, userId?: string): Promise<AuditLogEntry[]> {
  const file = await read();
  let logs = file.logs;
  if (userId) logs = logs.filter((l) => l.userId === userId);
  return logs.slice(0, limit);
}

export async function getActivities(userId?: string, limit = 50): Promise<ActivityEvent[]> {
  const file = await read();
  let acts = file.activities;
  if (userId) acts = acts.filter((a) => a.userId === userId);
  return acts.slice(0, limit);
}