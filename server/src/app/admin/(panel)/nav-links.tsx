"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/giveaways", label: "Giveaways" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/winners", label: "Winners" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings", label: "App settings" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${active ? "bg-brand-tint text-brand-dark" : "text-ink hover:bg-canvas"}`}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
