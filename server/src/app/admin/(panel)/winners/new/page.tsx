import { desc } from "drizzle-orm";

import { WinnerForm } from "@/components/admin/winner-form";
import { PageHeader } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { dateToIstLocal } from "@/lib/form";

export default async function NewWinnerPage({ searchParams }: PageProps<"/admin/winners/new">) {
  await requireAdmin();
  const giveawayId = Number((await searchParams).giveaway) || null;
  const giveaways = await db
    .select({ id: schema.giveaways.id, title: schema.giveaways.title, prizeValue: schema.giveaways.prizeValue })
    .from(schema.giveaways)
    .orderBy(desc(schema.giveaways.id));
  const g = giveaways.find((x) => x.id === giveawayId);

  return (
    <>
      <PageHeader title="Add winner" description="For winners chosen outside the random draw. Starts hidden unless you tick Published." />
      <WinnerForm
        giveaways={giveaways}
        initial={{
          giveawayId,
          phone: "",
          displayName: "",
          town: "",
          prizeLabel: g?.title ?? "",
          prizeValue: g?.prizeValue ?? 0,
          wonAt: dateToIstLocal(new Date()),
          photoUrl: null,
          videoUrl: "",
          isPublished: false,
          isSpotlight: false,
          isPinnedHome: false,
          sortOrder: 0,
        }}
      />
    </>
  );
}
