import type { Metadata } from "next";
import "./globals.css";
import "./prosparrow.css";

export const metadata: Metadata = {
  title: "ProSparrow — Nekretnine bez posrednika",
  description:
    "Kupuj i prodaj nekretnine direktno od vlasnika. Bez provizije agenciji, bez skrivenih troškova — samo oglas, kontakt i dogovor.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sr" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
