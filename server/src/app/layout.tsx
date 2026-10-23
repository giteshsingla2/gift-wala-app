import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gift Wala Admin",
  description: "Manage giveaways, haazri plans and winners for the Gift Wala app.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
