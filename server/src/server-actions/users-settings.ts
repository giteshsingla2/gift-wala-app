"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { bool, int, str, type ActionState } from "@/lib/form";
import { saveSettings, SECTION_KEYS, type SectionKey } from "@/lib/settings";

export async function setUserBlocked(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id");
  const blocked = bool(fd, "blocked");
  await db.update(schema.users).set({ isBlocked: blocked }).where(eq(schema.users.id, id));
  // Blocking also signs them out everywhere.
  if (blocked) await db.delete(schema.sessions).where(eq(schema.sessions.userId, id));
  revalidatePath("/admin/users");
}

export async function updateSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const whatsappChannelUrl = str(fd, "whatsappChannelUrl");
  const minAppVersion = str(fd, "minAppVersion");
  if (whatsappChannelUrl && !/^https:\/\/\S+$/.test(whatsappChannelUrl)) return { error: "The WhatsApp link must start with https://" };
  if (!/^\d+\.\d+\.\d+$/.test(minAppVersion)) return { error: "Minimum app version must look like 1.0.0" };
  await saveSettings({
    whatsappChannelUrl,
    minAppVersion,
    sections: Object.fromEntries(SECTION_KEYS.map((k) => [k, bool(fd, `section_${k}`)])) as Record<SectionKey, boolean>,
  });
  revalidatePath("/admin/settings");
  return { success: "Settings saved. The app picks them up the next time it loads." };
}
