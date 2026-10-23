import { randomBytes } from "node:crypto";

import { eq } from "drizzle-orm";

import { db, schema } from "@/db";
import { ApiError } from "./http";

// App login: phone number only for now (no OTP). Anyone who knows a number can log in as it,
// so add OTP before a public launch.

/** Normalises an Indian mobile number to 10 digits, or returns null if it isn't one. */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export async function loginWithPhone(phoneInput: string) {
  const phone = normalizePhone(phoneInput);
  if (!phone) throw new ApiError(400, "bad_phone", "Enter a valid 10-digit mobile number.");

  let [user] = await db.select().from(schema.users).where(eq(schema.users.phone, phone));
  const isNew = !user;
  if (!user) {
    await db.insert(schema.users).values({ phone });
    [user] = await db.select().from(schema.users).where(eq(schema.users.phone, phone));
  }
  if (user.isBlocked) throw new ApiError(403, "blocked", "This account has been blocked.");

  const token = randomBytes(32).toString("hex");
  await db.insert(schema.sessions).values({ token, userId: user.id });
  return { token, user, isNew };
}

export type AppUser = typeof schema.users.$inferSelect;

/** The logged-in user for an API request, or throws 401. */
export async function requireUser(request: Request): Promise<AppUser> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) throw new ApiError(401, "unauthorized", "Please log in.");

  const [row] = await db
    .select({ user: schema.users, lastUsedAt: schema.sessions.lastUsedAt })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(eq(schema.sessions.token, token));
  if (!row) throw new ApiError(401, "unauthorized", "Please log in again.");
  if (row.user.isBlocked) throw new ApiError(403, "blocked", "This account has been blocked.");

  // Touch "last seen" at most every 10 minutes.
  if (Date.now() - row.lastUsedAt.getTime() > 10 * 60_000) {
    const now = new Date();
    await db.update(schema.sessions).set({ lastUsedAt: now }).where(eq(schema.sessions.token, token));
    await db.update(schema.users).set({ lastSeenAt: now }).where(eq(schema.users.id, row.user.id));
  }
  return row.user;
}

export function serializeUser(u: AppUser) {
  return {
    id: u.id,
    phone: u.phone,
    name: u.name ?? "",
    city: u.city ?? "",
    state: u.state ?? "",
    pincode: u.pincode ?? "",
    reminderEnabled: u.reminderEnabled,
    reminderTime: u.reminderTime,
  };
}
