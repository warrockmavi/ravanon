import fs from "fs/promises";
import { AI_CONFIG_JSON } from "@/lib/store/paths";

export interface AIConfig {
  enabled: boolean;
  botName: string;
  welcomeMessage: string;
  quickReplies: string[];
  usePersonalization: boolean;
  logConversations: boolean;
}

const DEFAULT: AIConfig = {
  enabled: true,
  botName: "RAVANON AI Danışman",
  welcomeMessage: "Merhaba! Ben RAVANON AI Güzellik Danışmanınız. Canlı ürün kataloğundan size özel öneriler sunuyorum.",
  quickReplies: ["2026 trendleri", "Glass skin rutini", "Kuru cilt için", "Vegan ürünler"],
  usePersonalization: true,
  logConversations: true,
};

export async function getAIConfig(): Promise<AIConfig> {
  try {
    return { ...DEFAULT, ...JSON.parse(await fs.readFile(AI_CONFIG_JSON, "utf8")) };
  } catch {
    return DEFAULT;
  }
}

export async function saveAIConfig(config: AIConfig): Promise<AIConfig> {
  await fs.mkdir(AI_CONFIG_JSON.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
  await fs.writeFile(AI_CONFIG_JSON, JSON.stringify(config, null, 2), "utf8");
  return config;
}