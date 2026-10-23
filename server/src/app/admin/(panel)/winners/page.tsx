import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";

import { Badge, buttonClass, EmptyState, FormMessage, inputClass, LinkButton, PageHeader, tableClass } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { formatIstDateTime } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/admin-auth";
import { setWinnerPublished } from "@/server-actions/winners";

export default async function WinnersPage({ searchParams }: PageProps<"/admin/winners">) {
  await requireAdmin();
  const sp = await searchParams;
  const giveawayId = Number(sp.giveaway) || undefined;
  const show = sp.show === "hidden" ? "hidden" : sp.show === "published" ? "published" : "all";

  const where = [
    giveawayId ? eq(schema.winners.giveawayId, giveawayId) : undefined,
    show === "all" ? undefined : eq(schema.winners.isPublished, show === "published"),
  ];
  const [rows, giveaways] = await Promise.all([
    db
      .select({ w: schema.winners, giveaway: schema.giveaways.title, phone: schema.users.phone })
      .from(schema.winners)
      .innerJoin(schema.giveaways, eq(schema.giveaways.id, schema.winners.giveawayId))
      .leftJoin(schema.users, eq(schema.users.id, schema.winners.userId))
      .where(and(...where))
      .orderBy(desc(schema.winners.wonAt))
      .limit(300),
    db.select({ id: schema.giveaways.id, title: schema.giveaways.title }).from(schema.giveaways).orderBy(desc(schema.giveaways.id)),
  ]);

  return (
    <>
      <PageHeader
        title="Winners"
        description="Only published winners appear in the app. Phone numbers stay here and are never shown to users."
        action={<LinkButton href={`/admin/winners/new${giveawayId ? `?giveaway=${giveawayId}` : ""}`}>Add winner by hand</LinkButton>}
      />
      {sp.drawn ? (
        <div className="mb-4">
          <FormMessage success={`Picked ${sp.drawn} winner(s) at random. They’re hidden until you review and publish them.`} />
        </div>
      ) : null}

      <form className="mb-4 flex flex-wrap gap-3">
        <select name="giveaway" defaultValue={giveawayId ?? ""} className={`${inputClass} max-w-xs`} aria-label="Filter by giveaway">
          <option value="">All giveaways</option>
          {giveaways.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
        <select name="show" defaultValue={show} className={`${inputClass} max-w-[180px]`} aria-label="Filter by status">
          <option value="all">Published and hidden</option>
          <option value="published">Published only</option>
          <option value="hidden">Hidden only</option>
        </select>
        <button className={buttonClass("secondary")}>Filter</button>
      </form>

      {rows.length === 0 ? (
        <EmptyState>No winners here yet.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className={tableClass}>
            <thead>
              <tr>
                <th>Winner</th>
                <th>Prize</th>
                <th>Won</th>
                <th>Shows</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map(({ w, giveaway, phone }) => (
                <tr key={w.id} className="hover:bg-canvas">
                  <td>
                    <Link href={`/admin/winners/${w.id}`} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-tint text-xs font-bold text-brand-dark">
                        {w.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={w.photoUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          w.displayName.slice(0, 2).toUpperCase()
                        )}
                      </span>
                      <span>
                        <span className="block font-semibold">{w.displayName}</span>
                        <span className="block text-xs text-muted">
                          {w.town || "—"} {phone ? `· ${phone}` : "· not linked"}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td>
                    <span className="block">{w.prizeLabel}</span>
                    <span className="block text-xs text-muted">{giveaway}</span>
                  </td>
                  <td className="whitespace-nowrap text-xs text-muted">{formatIstDateTime(w.wonAt)}</td>
                  <td className="space-x-1 whitespace-nowrap">
                    {w.isPublished ? <Badge color="green">Published</Badge> : <Badge>Hidden</Badge>}
                    {w.isPinnedHome ? <Badge color="blue">Home</Badge> : null}
                    {w.isSpotlight ? <Badge color="amber">Spotlight</Badge> : null}
                    {w.drawId ? <Badge>Draw</Badge> : null}
                  </td>
                  <td className="text-right">
                    <form action={setWinnerPublished}>
                      <input type="hidden" name="id" value={w.id} />
                      <input type="hidden" name="publish" value={w.isPublished ? "false" : "true"} />
                      <button className={buttonClass("secondary")}>{w.isPublished ? "Hide" : "Publish"}</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
