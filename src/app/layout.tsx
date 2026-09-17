import type { Metadata } from "next";
import "./globals.css";
import "./prosparrow.css";

export const metadata: Metadata = {
  title: "ProSparrow — Pronađi dom koji ti sedne",
  description:
    "ProSparrow — provereni oglasi nekretnina, jasne cene, pretraga koja stvarno ide brzo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
