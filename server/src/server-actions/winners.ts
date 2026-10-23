"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { normalizePhone } from "@/lib/app-auth";
import { bool, errorMessage, file, int, istLocalToDate, str, type ActionState } from "@/lib/form";
import { saveImage } from "@/lib/uploads";

const WinnerInput = z.object({
  giveawayId: z.number().int().positive("Choose the giveaway"),
  displayName: z.string().trim().min(1, "Name is required").max(80),
  town: z.string().trim().max(80),
  prizeLabel: z.string().trim().min(1, "Prize is required").max(120),
  prizeValue: z.number().int().min(0),
  wonAt: z.date({ message: "Pick when they won" }),
  videoUrl: z.union([z.literal(""), z.url({ message: "Video link must be a full https:// link" })]),
  isPublished: z.boolean(),
  isSpotlight: z.boolean(),
  isPinnedHome: z.boolean(),
  sortOrder: z.number().int(),
});

export async function saveWinner(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = int(fd, "id");
  const parsed = WinnerInput.safeParse({
    giveawayId: int(fd, "giveawayId"),
    displayName: str(fd, "displayName"),
    town: str(fd, "town"),
    prizeLabel: str(fd, "prizeLabel"),
    prizeValue: int(fd, "prizeValue"),
    wonAt: istLocalToDate(str(fd, "wonAt")) ?? undefined,
    videoUrl: str(fd, "videoUrl"),
    isPublished: bool(fd, "isPublished"),
    isSpotlight: bool(fd, "isSpotlight"),
    isPinnedHome: bool(fd, "isPinnedHome"),
    sortOrder: int(fd, "sortOrder"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  // Link to an app user by phone so the win counts in their total winnings.
  const phoneInput = str(fd, "phone");
  let userId: number | null = null;
  if (phoneInput) {
    const phone = normalizePhone(phoneInput);
    if (!phone) return { error: "That isn't a valid 10-digit mobile number." };
    const [u] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.phone, phone));
    if (!u) return { error: "No app user has that phone number. Leave it empty to add the winner without linking." };
    userId = u.id;
  }

  let newId = id;
  try {
    const uploaded = await saveImage(file(fd, "photo"), "photo");
    const photoUrl = uploaded ?? (bool(fd, "removePhoto") ? null : undefined);
    const values = { ...parsed.data, videoUrl: parsed.data.videoUrl || null, userId, ...(photoUrl !== undefined ? { photoUrl } : {}) };
    if (id) await db.update(schema.winners).set(values).where(eq(schema.winners.id, id));
    else newId = (await db.insert(schema.winners).values(values))[0].insertId;
  } catch (e) {
    return { error: errorMessage(e) };
  }
  revalidatePath("/admin/winners");
  if (!id) redirect(`/admin/winners/${newId}?saved=1`);
  return { success: "Saved." };
}

export async function setWinnerPublished(fd: FormData) {
  await requireAdmin();
  await db.update(schema.winners).set({ isPublished: bool(fd, "publish") }).where(eq(schema.winners.id, int(fd, "id")));
  revalidatePath("/admin/winners");
}

/** For mistakes only. To take a real winner off the app, hide them instead (keeps the record). */
export async function deleteWinner(fd: FormData) {
  await requireAdmin();
  await db.delete(schema.winners).where(eq(schema.winners.id, int(fd, "id")));
  revalidatePath("/admin/winners");
  redirect("/admin/winners");
}
