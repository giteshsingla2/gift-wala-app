"use server";

import { asc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { int, str } from "@/lib/form";

export async function addCategory(fd: FormData) {
  await requireAdmin();
  const name = str(fd, "name").slice(0, 60);
  if (!name) return;
  const [{ max }] = await db.select({ max: sql<number>`coalesce(max(${schema.categories.sortOrder}), -1)` }).from(schema.categories);
  await db.insert(schema.categories).values({ name, sortOrder: Number(max) + 1 });
  revalidatePath("/admin/categories");
}

export async function renameCategory(fd: FormData) {
  await requireAdmin();
  const name = str(fd, "name").slice(0, 60);
  if (!name) return;
  await db.update(schema.categories).set({ name }).where(eq(schema.categories.id, int(fd, "id")));
  revalidatePath("/admin/categories");
}

/** Moves a category one place up or down by swapping sort order with its neighbour. */
export async function moveCategory(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id");
  const dir = str(fd, "dir") === "up" ? -1 : 1;
  const list = await db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder), asc(schema.categories.id));
  const i = list.findIndex((c) => c.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  for (const [order, c] of list.entries()) {
    await db.update(schema.categories).set({ sortOrder: order }).where(eq(schema.categories.id, c.id));
  }
  revalidatePath("/admin/categories");
}

export async function deleteCategory(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id");
  const [{ n }] = await db.select({ n: sql<number>`count(*)` }).from(schema.giveaways).where(eq(schema.giveaways.categoryId, id));
  if (Number(n) > 0) redirect(`/admin/categories?error=${id}`);
  await db.delete(schema.categories).where(eq(schema.categories.id, id));
  revalidatePath("/admin/categories");
}
