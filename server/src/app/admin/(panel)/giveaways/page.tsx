import Link from "next/link";
import { asc, desc, eq, sql } from "drizzle-orm";

import { Badge, EmptyState, LinkButton, PageHeader, tableClass } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { formatIstDate } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/admin-auth";
import { istDate } from "@/lib/dates";

const STATUS_BADGE = { draft: "gray", live: "green", ended: "amber", results_out: "blue" } as const;
const STATUS_LABEL = { draft: "Draft", live: "Live", ended: "Ended", results_out: "Results out" } as const;

export default async function GiveawaysPage() {
  await requireAdmin();
  const today = istDate();
  const rows = await db
    .select({
      g: schema.giveaways,
      category: schema.categories.name,
      started: sql<number>`(select count(*) from progress p where p.giveaway_id = ${schema.giveaways.id})`,
      finished: sql<number>`(select count(*) from progress p where p.giveaway_id = ${schema.giveaways.id} and p.days_completed >= ${schema.giveaways.haazriDays})`,
    })
    .from(schema.giveaways)
    .leftJoin(schema.categories, eq(schema.categories.id, schema.giveaways.categoryId))
    .orderBy(desc(schema.giveaways.isFeatured), asc(schema.giveaways.sortOrder), desc(schema.giveaways.id));

  return (
    <>
      <PageHeader title="Giveaways" description="Everything users can take part in. Only Live ones between start and last date show in the app." action={<LinkButton href="/admin/giveaways/new">New giveaway</LinkButton>} />
      {rows.length === 0 ? (
        <EmptyState>No giveaways yet. Create the first one.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className={tableClass}>
            <thead>
              <tr>
                <th>Giveaway</th>
                <th>Status</th>
                <th>Haazri</th>
                <th>Dates</th>
                <th>Users</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ g, category, started, finished }) => {
                const showing = g.status === "live" && g.startDate <= today && g.lastDate >= today;
                return (
                  <tr key={g.id} className="hover:bg-canvas">
                    <td>
                      <Link href={`/admin/giveaways/${g.id}`} className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg" style={{ background: `linear-gradient(160deg, ${g.tileColorFrom}, ${g.tileColorTo})` }}>
                          {g.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={g.imageUrl} alt="" className="h-9 w-9 object-contain" />
                          ) : null}
                        </span>
                        <span>
                          <span className="block font-semibold text-ink">{g.title}</span>
                          <span className="block text-xs text-muted">
                            {category ?? "No category"} · {g.tagText} · {g.winnersCount} winner{g.winnersCount === 1 ? "" : "s"}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="space-x-1 whitespace-nowrap">
                      <Badge color={STATUS_BADGE[g.status]}>{STATUS_LABEL[g.status]}</Badge>
                      {g.isFeatured ? <Badge color="amber">Mega Draw</Badge> : null}
                      {g.status === "live" && !showing ? <Badge color="gray">Not in app today</Badge> : null}
                    </td>
                    <td className="whitespace-nowrap">{g.haazriDays} day{g.haazriDays === 1 ? "" : "s"}</td>
                    <td className="whitespace-nowrap text-xs text-muted">
                      {formatIstDate(g.startDate)} → {formatIstDate(g.lastDate)}
                    </td>
                    <td className="whitespace-nowrap text-xs">
                      {Number(started)} started · <span className="font-semibold">{Number(finished)} finished</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
