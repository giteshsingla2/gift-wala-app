import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";

import { ConfirmButton } from "@/components/admin/confirm-button";
import { WinnerForm } from "@/components/admin/winner-form";
import { buttonClass, Card, FormMessage, PageHeader } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { dateToIstLocal } from "@/lib/form";
import { deleteWinner } from "@/server-actions/winners";

export default async function EditWinnerPage({ params, searchParams }: PageProps<"/admin/winners/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  const saved = (await searchParams).saved;
  const [[row], giveaways] = await Promise.all([
    db
      .select({ w: schema.winners, phone: schema.users.phone })
      .from(schema.winners)
      .leftJoin(schema.users, eq(schema.users.id, schema.winners.userId))
      .where(eq(schema.winners.id, id)),
    db
      .select({ id: schema.giveaways.id, title: schema.giveaways.title, prizeValue: schema.giveaways.prizeValue })
      .from(schema.giveaways)
      .orderBy(desc(schema.giveaways.id)),
  ]);
  if (!row) notFound();
  const { w, phone } = row;

  return (
    <>
      <PageHeader
        title={w.displayName}
        description={w.drawId ? "Picked by a random draw." : "Added by hand."}
        action={
          <Link href="/admin/winners" className={buttonClass("secondary")}>
            All winners
          </Link>
        }
      />
      {saved ? (
        <div className="mb-4">
          <FormMessage success="Winner added." />
        </div>
      ) : null}
      <WinnerForm
        giveaways={giveaways}
        initial={{
          id: w.id,
          giveawayId: w.giveawayId,
          phone: phone ?? "",
          displayName: w.displayName,
          town: w.town,
          prizeLabel: w.prizeLabel,
          prizeValue: w.prizeValue,
          wonAt: dateToIstLocal(w.wonAt),
          photoUrl: w.photoUrl,
          videoUrl: w.videoUrl ?? "",
          isPublished: w.isPublished,
          isSpotlight: w.isSpotlight,
          isPinnedHome: w.isPinnedHome,
          sortOrder: w.sortOrder,
        }}
      />
      <Card title="Delete" className="mt-6">
        <form action={deleteWinner} className="flex flex-wrap items-center gap-3">
          <input type="hidden" name="id" value={w.id} />
          <p className="text-sm text-muted">Only for mistakes. To take a real winner off the app, untick Published instead so the record is kept.</p>
          <ConfirmButton message={`Delete ${w.displayName} permanently?`}>Delete</ConfirmButton>
        </form>
      </Card>
    </>
  );
}
