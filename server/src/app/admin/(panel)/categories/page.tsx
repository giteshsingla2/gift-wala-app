import { sql } from "drizzle-orm";

import { ConfirmButton } from "@/components/admin/confirm-button";
import { buttonClass, Card, EmptyState, FormMessage, inputClass, PageHeader } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { allCategories } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/admin-auth";
import { addCategory, deleteCategory, moveCategory, renameCategory } from "@/server-actions/categories";

export default async function CategoriesPage({ searchParams }: PageProps<"/admin/categories">) {
  await requireAdmin();
  const errorId = Number((await searchParams).error);
  const [categories, counts] = await Promise.all([
    allCategories(),
    db.select({ id: schema.giveaways.categoryId, n: sql<number>`count(*)` }).from(schema.giveaways).groupBy(schema.giveaways.categoryId),
  ]);
  const count = new Map(counts.map((c) => [c.id, Number(c.n)]));
  const blocked = categories.find((c) => c.id === errorId);

  return (
    <>
      <PageHeader title="Categories" description="The filter chips on the app’s Giveaways screen, in this order. “All” is always shown first." />
      {blocked ? (
        <div className="mb-4">
          <FormMessage error={`“${blocked.name}” still has giveaways. Move them to another category first.`} />
        </div>
      ) : null}

      <Card className="mb-6">
        <form action={addCategory} className="flex flex-wrap gap-3">
          <input name="name" required maxLength={60} placeholder="New category name, e.g. Recharge" className={`${inputClass} max-w-xs`} aria-label="New category name" />
          <button className={buttonClass()}>Add category</button>
        </form>
      </Card>

      {categories.length === 0 ? (
        <EmptyState>No categories yet. Users will only see “All”.</EmptyState>
      ) : (
        <ul className="space-y-2">
          {categories.map((c, i) => (
            <li key={c.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-3">
              <div className="flex gap-1">
                <form action={moveCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="dir" value="up" />
                  <button className={buttonClass("secondary")} disabled={i === 0} aria-label={`Move ${c.name} up`}>
                    ↑
                  </button>
                </form>
                <form action={moveCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="dir" value="down" />
                  <button className={buttonClass("secondary")} disabled={i === categories.length - 1} aria-label={`Move ${c.name} down`}>
                    ↓
                  </button>
                </form>
              </div>
              <form action={renameCategory} className="flex flex-1 gap-2">
                <input type="hidden" name="id" value={c.id} />
                <input name="name" defaultValue={c.name} required maxLength={60} className={`${inputClass} max-w-xs`} aria-label={`Name for ${c.name}`} />
                <button className={buttonClass("secondary")}>Rename</button>
              </form>
              <span className="text-sm text-muted">{count.get(c.id) ?? 0} giveaways</span>
              {count.get(c.id) ? (
                <span className="flex items-center gap-2" title="Move its giveaways to another category first">
                  <button type="button" disabled className={buttonClass("danger")}>
                    Delete
                  </button>
                  <span className={`text-xs ${c.id === errorId ? "font-semibold text-red-700" : "text-muted"}`}>Move its giveaways first</span>
                </span>
              ) : (
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <ConfirmButton message={`Delete “${c.name}”?`}>Delete</ConfirmButton>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
