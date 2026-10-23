import Link from "next/link";
import { and, asc, eq, gte, lte, sql } from "drizzle-orm";

import { Card, LinkButton, PageHeader } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { formatIstDate } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/admin-auth";
import { addDays, istDate } from "@/lib/dates";

function Stat({ label, value, href }: { label: string; value: number | string; href?: string }) {
  const body = (
    <div className="rounded-xl border border-line bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
  return href ? (
    <Link href={href} className="block hover:opacity-90">
      {body}
    </Link>
  ) : (
    body
  );
}

export default async function DashboardPage() {
  await requireAdmin();
  const today = istDate();
  const count = sql<number>`count(*)`;

  const [[users], [activeToday], [haazriToday], [hiddenWinners], live, endingSoon] = await Promise.all([
    db.select({ n: count }).from(schema.users),
    db.select({ n: sql<number>`count(distinct ${schema.haazriAttempts.userId})` }).from(schema.haazriAttempts).where(eq(schema.haazriAttempts.dayDate, today)),
    db.select({ n: count }).from(schema.progress).where(eq(schema.progress.lastDoneOn, today)),
    db.select({ n: count }).from(schema.winners).where(eq(schema.winners.isPublished, false)),
    db
      .select({ id: schema.giveaways.id })
      .from(schema.giveaways)
      .where(and(eq(schema.giveaways.status, "live"), lte(schema.giveaways.startDate, today), gte(schema.giveaways.lastDate, today))),
    db
      .select({
        g: schema.giveaways,
        finished: sql<number>`(select count(*) from progress p where p.giveaway_id = ${schema.giveaways.id} and p.days_completed >= ${schema.giveaways.haazriDays})`,
        winners: sql<number>`(select count(*) from winners w where w.giveaway_id = ${schema.giveaways.id})`,
      })
      .from(schema.giveaways)
      .where(and(eq(schema.giveaways.status, "live"), lte(schema.giveaways.lastDate, addDays(today, 3))))
      .orderBy(asc(schema.giveaways.lastDate)),
  ]);

  return (
    <>
      <PageHeader title="Dashboard" description={`Today in India: ${formatIstDate(today)}`} action={<LinkButton href="/admin/giveaways/new">New giveaway</LinkButton>} />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Giveaways in the app today" value={live.length} href="/admin/giveaways" />
        <Stat label="Users" value={Number(users.n)} href="/admin/users" />
        <Stat label="Users active today" value={Number(activeToday.n)} />
        <Stat label="Haazri done today" value={Number(haazriToday.n)} />
        <Stat label="Winners waiting to publish" value={Number(hiddenWinners.n)} href="/admin/winners?show=hidden" />
      </div>

      <Card title="Ending soon or ready to draw">
        {endingSoon.length === 0 ? (
          <p className="text-sm text-muted">No live giveaway ends in the next 3 days.</p>
        ) : (
          <ul className="divide-y divide-line">
            {endingSoon.map(({ g, finished, winners }) => (
              <li key={g.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <Link href={`/admin/giveaways/${g.id}`} className="font-semibold hover:text-brand">
                    {g.title}
                  </Link>
                  <p className="text-xs text-muted">
                    Last date {formatIstDate(g.lastDate)} · {Number(finished)} finished every day · {Number(winners)} of {g.winnersCount} winners chosen
                  </p>
                </div>
                <LinkButton href={`/admin/giveaways/${g.id}`} variant={g.lastDate < today ? "gold" : "secondary"}>
                  {g.lastDate < today ? "Run the draw" : "Open"}
                </LinkButton>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
