import { GiveawayForm } from "@/components/admin/giveaway-form";
import { PageHeader } from "@/components/admin/ui";
import { allCategories, newGiveawayValues } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/admin-auth";

export default async function NewGiveawayPage() {
  await requireAdmin();
  const categories = await allCategories();
  return (
    <>
      <PageHeader title="New giveaway" description="Saved as a draft until you set the status to Live." />
      <GiveawayForm initial={newGiveawayValues()} categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </>
  );
}
