import { requireAdmin } from "@/lib/admin-auth";
import { adminLogout } from "@/server-actions/auth";
import { NavLinks } from "./nav-links";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-line bg-white md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-r md:border-b-0">
        <div className="flex items-center gap-2 px-5 py-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold" aria-hidden>
            🎁
          </span>
          <span className="font-bold">Gift Wala Admin</span>
        </div>
        <NavLinks />
        <form action={adminLogout} className="px-3 pb-4 md:absolute md:bottom-0 md:w-60">
          <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-canvas">Sign out</button>
        </form>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
