import { eq } from "drizzle-orm";
import { z } from "zod";

import { db, schema } from "@/db";
import { requireUser, serializeUser } from "@/lib/app-auth";
import { ApiError, handle, json, readJson } from "@/lib/http";
import { walletTotal } from "@/lib/winners";

// GET /api/v1/me
export const GET = handle(async (request: Request) => {
  const user = await requireUser(request);
  return json({ user: serializeUser(user), wallet: await walletTotal(user.id) });
});

const Profile = z.object({
  name: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional(),
  state: z.string().trim().max(80).optional(),
  pincode: z
    .string()
    .trim()
    .regex(/^(\d{6})?$/, "Pincode must be 6 digits")
    .optional(),
  reminderEnabled: z.boolean().optional(),
  reminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be HH:MM")
    .optional(),
});

// PATCH /api/v1/me { name?, city?, state?, pincode?, reminderEnabled?, reminderTime? }
export const PATCH = handle(async (request: Request) => {
  const user = await requireUser(request);
  const parsed = Profile.safeParse(await readJson(request));
  if (!parsed.success) throw new ApiError(400, "invalid", parsed.error.issues[0]?.message ?? "Invalid details.");
  if (Object.keys(parsed.data).length > 0) {
    await db.update(schema.users).set(parsed.data).where(eq(schema.users.id, user.id));
  }
  const [updated] = await db.select().from(schema.users).where(eq(schema.users.id, user.id));
  return json({ user: serializeUser(updated) });
});
