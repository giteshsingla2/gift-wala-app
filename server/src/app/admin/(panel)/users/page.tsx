import { desc, like, sql } from "drizzle-orm";

import { Badge, buttonClass, EmptyState, inputClass, PageHeader, tableClass } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { formatIstDateTime } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/admin-auth";
import { setUserBlocked } from "@/server-actions/users-settings";

export default async function UsersPage({ searchParams }: PageProps<"/admin/users">) {
  await requireAdmin();
  const q = String((await searchParams).q ?? "").replace(/\D/g, "").slice(-10);
  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        u: schema.users,
        started: sql<number>`(select count(*) from progress p where p.user_id = ${schema.users.id})`,
        finished: sql<number>`(select count(*) from progress p join giveaways g on g.id = p.giveaway_id where p.user_id = ${schema.users.id} and p.days_completed >= g.haazri_days)`,
        wins: sql<number>`(select count(*) from winners w where w.user_id = ${schema.users.id})`,
      })
      .from(schema.users)
      .where(q ? like(schema.users.phone, `%${q}%`) : undefined)
      .orderBy(desc(schema.users.lastSeenAt))
      .limit(200),
    db.select({ total: sql<number>`count(*)` }).from(schema.users),
  ]);

  return (
    <>
      <PageHeader title="Users" description={`${Number(total)} people have logged in to the app.`} />
      <form className="mb-4 flex gap-3">
        <input name="q" defaultValue={q} inputMode="tel" placeholder="Search by phone number" className={`${inputClass} max-w-xs`} aria-label="Search by phone number" />
        <button className={buttonClass("secondary")}>Search</button>
      </form>
      {rows.length === 0 ? (
        <EmptyState>{q ? "No user with that number." : "No users yet."}</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className={tableClass}>
            <thead>
              <tr>
                <th>User</th>
                <th>Haazri</th>
                <th>Wins</th>
                <th>Last seen</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map(({ u, started, finished, wins }) => (
                <tr key={u.id}>
                  <td>
                    <span className="block font-semibold">{u.name || "No name yet"}</span>
                    <span className="block text-xs text-muted">
                      {u.phone}
                      {u.city ? ` · ${u.city}` : ""}
                      {u.state ? `, ${u.state}` : ""}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-xs">
                    {Number(started)} started · {Number(finished)} finished
                  </td>
                  <td>{Number(wins)}</td>
                  <td className="whitespace-nowrap text-xs text-muted">{formatIstDateTime(u.lastSeenAt)}</td>
                  <td className="text-right">
                    <form action={setUserBlocked} className="inline-flex items-center gap-2">
                      {u.isBlocked ? <Badge color="red">Blocked</Badge> : null}
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="blocked" value={u.isBlocked ? "false" : "true"} />
                      <button className={buttonClass(u.isBlocked ? "secondary" : "danger")}>{u.isBlocked ? "Unblock" : "Block"}</button>
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
