import { inArray } from "drizzle-orm";

import { db, schema } from "@/db";
import { SECTION_KEYS, type AppSettings, type SectionKey } from "./settings-shared";

export { SECTION_KEYS, SECTION_LABELS, type AppSettings, type SectionKey } from "./settings-shared";

// App-wide settings, stored as key/value strings.
const DEFAULTS: Record<string, string> = {
  whatsapp_channel_url: "",
  min_app_version: "1.0.0",
  ...Object.fromEntries(SECTION_KEYS.map((k) => [`section_${k}`, "true"])),
};

export async function getSettings(): Promise<AppSettings> {
  const rows = await db.select().from(schema.settings).where(inArray(schema.settings.key, Object.keys(DEFAULTS)));
  const map = { ...DEFAULTS, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) };
  return {
    whatsappChannelUrl: map.whatsapp_channel_url,
    minAppVersion: map.min_app_version,
    sections: Object.fromEntries(SECTION_KEYS.map((k) => [k, map[`section_${k}`] === "true"])) as Record<SectionKey, boolean>,
  };
}

export async function saveSettings(s: AppSettings) {
  const rows = [
    { key: "whatsapp_channel_url", value: s.whatsappChannelUrl },
    { key: "min_app_version", value: s.minAppVersion },
    ...SECTION_KEYS.map((k) => ({ key: `section_${k}`, value: String(s.sections[k]) })),
  ];
  for (const row of rows) {
    await db.insert(schema.settings).values(row).onDuplicateKeyUpdate({ set: { value: row.value } });
  }
}
