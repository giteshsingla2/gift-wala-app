import { asc } from "drizzle-orm";

import { db, schema } from "@/db";
import { handle, json } from "@/lib/http";
import { getSettings } from "@/lib/settings";

// GET /api/v1/config — no login needed. Settings and filter categories.
export const GET = handle(async () => {
  const [settings, categories] = await Promise.all([
    getSettings(),
    db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder), asc(schema.categories.id)),
  ]);
  return json({
    ...settings,
    categories: categories.map((c) => ({ id: String(c.id), name: c.name })),
  });
});
