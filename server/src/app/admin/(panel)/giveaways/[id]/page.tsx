import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq, gte, sql } from "drizzle-orm";

import { ConfirmButton } from "@/components/admin/confirm-button";
import { GiveawayForm } from "@/components/admin/giveaway-form";
import { Badge, buttonClass, Card, FormMessage, inputClass, PageHeader, tableClass } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { allCategories, formatIstDateTime, giveawayFormValues } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteGiveaway, pickWinners } from "@/server-actions/giveaways";

const ERRORS: Record<string, string> = {
  "has-winners": "This giveaway has winners, so it can't be deleted. Set its status to Ended instead.",
  "no-eligible": "Nobody is eligible yet: no user has finished every haazri day (or all of them have already been picked).",
};

export default async function EditGiveawayPage({ params, searchParams }: PageProps<"/admin/giveaways/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  const sp = await searchParams;
  const [values, categories] = await Promise.all([giveawayFormValues(id), allCategories()]);
  if (!values) notFound();

  const [[stats], draws, winners] = await Promise.all([
    db
      .select({
        started: sql<number>`count(*)`,
        finished: sql<number>`sum(${schema.progress.daysCompleted} >= ${values.haazriDays})`,
      })
      .from(schema.progress)
      .where(eq(schema.progress.giveawayId, id)),
    db.select().from(schema.draws).where(eq(schema.draws.giveawayId, id)).orderBy(desc(schema.draws.runAt)),
    db.select().from(schema.winners).where(eq(schema.winners.giveawayId, id)).orderBy(desc(schema.winners.wonAt)),
  ]);
  const [{ eligible }] = await db
    .select({ eligible: sql<number>`count(*)` })
    .from(schema.progress)
    .innerJoin(schema.users, eq(schema.users.id, schema.progress.userId))
    .where(
      and(
        eq(schema.progress.giveawayId, id),
        gte(schema.progress.daysCompleted, values.haazriDays),
        eq(schema.users.isBlocked, false),
        sql`${schema.users.id} not in (select w.user_id from winners w where w.giveaway_id = ${id} and w.user_id is not null)`,
      ),
    );
  const remaining = Math.max(0, values.winnersCount - winners.length);

  return (
    <>
      <PageHeader
        title={values.title}
        description={`${Number(stats?.started ?? 0)} users started · ${Number(stats?.finished ?? 0)} finished every day`}
        action={
          <Link href="/admin/giveaways" className={buttonClass("secondary")}>
            All giveaways
          </Link>
        }
      />
      <div className="mb-6 space-y-2">
        <FormMessage error={sp.error ? ERRORS[String(sp.error)] : undefined} success={sp.saved ? "Giveaway created." : undefined} />
      </div>

      <Card title="Random draw" className="mb-6">
        <p className="mb-4 text-sm text-muted">
          Picks at random from users who finished all {values.haazriDays} haazri day{values.haazriDays === 1 ? "" : "s"}, skipping blocked users and anyone already picked. Picks are saved as hidden winners for you to review and publish.
        </p>
        <form action={pickWinners} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="id" value={id} />
          <label className="block">
            <span className="mb-1 block text-sm font-medium">How many to pick</span>
            <input type="number" name="count" min={1} defaultValue={remaining || 1} className={`${inputClass} w-32`} />
          </label>
          <button type="submit" className={buttonClass("gold")} disabled={Number(eligible) === 0}>
            Pick random winners
          </button>
          <span className="pb-2 text-sm text-muted">
            {Number(eligible)} eligible · {winners.length} of {values.winnersCount} winners chosen
          </span>
        </form>
        {draws.length > 0 ? (
          <div className="mt-5 overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th>Draw</th>
                  <th>Eligible</th>
                  <th>Picked</th>
                </tr>
              </thead>
              <tbody>
                {draws.map((d) => (
                  <tr key={d.id}>
                    <td>{formatIstDateTime(d.runAt)}</td>
                    <td>{d.eligibleCount}</td>
                    <td>{d.pickedUserIds.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {winners.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {winners.map((w) => (
              <Link key={w.id} href={`/admin/winners/${w.id}`} className="rounded-full border border-line px-3 py-1 text-sm hover:bg-canvas">
                {w.displayName} {w.isPublished ? <Badge color="green">Published</Badge> : <Badge>Hidden</Badge>}
              </Link>
            ))}
          </div>
        ) : null}
      </Card>

      <GiveawayForm initial={values} categories={categories.map((c) => ({ id: c.id, name: c.name }))} />

      <Card title="Delete giveaway" className="mt-6">
        <form action={deleteGiveaway} className="flex flex-wrap items-center gap-3">
          <input type="hidden" name="id" value={id} />
          <p className="text-sm text-muted">Deletes the giveaway, its day plan and everyone’s progress. Giveaways with winners can’t be deleted.</p>
          <ConfirmButton message={`Delete “${values.title}” and everyone's progress in it? This can't be undone.`}>Delete</ConfirmButton>
        </form>
      </Card>
    </>
  );
}
