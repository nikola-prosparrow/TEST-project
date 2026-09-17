import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Svetao dvosoban stan sa terasom — Vračar, Beograd | ProSparrow",
  description:
    "Svetao dvosoban stan sa terasom, Njegoševa 18, Vračar, Beograd. 64 m², 2 sobe, €189.000.",
};

export default function ListingLayout({ children }: { children: ReactNode }) {
  return children;
}
