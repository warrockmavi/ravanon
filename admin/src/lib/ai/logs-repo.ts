import fs from "fs/promises";
import { AI_LOGS_JSON } from "@/lib/store/paths";

export interface AIChatLog {
  id: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  message: string;
  response: string;
  intent: string;
  productIds: number[];
  createdAt: string;
}

interface LogsFile {
  version: number;
  updatedAt: string;
  logs: AIChatLog[];
}

const DEFAULT: LogsFile = { version: 1, updatedAt: new Date().toISOString(), logs: [] };

async function read(): Promise<LogsFile> {
  try {
    return JSON.parse(await fs.readFile(AI_LOGS_JSON, "utf8")) as LogsFile;
  } catch {
    return { ...DEFAULT };
  }
}

async function write(data: LogsFile) {
  data.updatedAt = new Date().toISOString();
  if (data.logs.length > 500) data.logs = data.logs.slice(0, 500);
  await fs.mkdir(AI_LOGS_JSON.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
  await fs.writeFile(AI_LOGS_JSON, JSON.stringify(data, null, 2), "utf8");
}

export async function addLog(entry: Omit<AIChatLog, "id" | "createdAt">): Promise<AIChatLog> {
  const file = await read();
  const log: AIChatLog = { ...entry, id: `ai-${Date.now()}`, createdAt: new Date().toISOString() };
  file.logs.unshift(log);
  await write(file);
  return log;
}

export async function getLogs(limit = 50): Promise<AIChatLog[]> {
  return (await read()).logs.slice(0, limit);
}

export async function getLogsForUser(userId: string, email: string): Promise<AIChatLog[]> {
  const logs = await getLogs(200);
  return logs.filter((l) => l.userId === userId || l.userEmail?.toLowerCase() === email.toLowerCase());
}

export async function getAIStats() {
  const logs = await getLogs(200);
  const intents: Record<string, number> = {};
  logs.forEach((l) => { intents[l.intent] = (intents[l.intent] || 0) + 1; });
  return { totalChats: logs.length, todayChats: logs.filter((l) => l.createdAt.startsWith(new Date().toISOString().slice(0, 10))).length, topIntents: Object.entries(intents).sort((a, b) => b[1] - a[1]).slice(0, 5) };
}