export type TechDebtItem = {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  blocks?: string;
};

export const techDebt: TechDebtItem[] = [
  {
    id: "TD3",
    title: "Dugmad za kontakt ne rade",
    description: "\"Pošalji poruku\", \"Zakaži razgledanje\", \"Prikaži broj telefona\" nemaju funkcionalnost.",
    severity: "high",
    blocks: "M5",
  },
  {
    id: "TD5",
    title: "Favorite (heart) state nije trajan",
    description: "Čuva se samo u React useState — nestaje na refresh stranice.",
    severity: "medium",
    blocks: "S3",
  },
  {
    id: "TD6",
    title: "Nema uploada fotografija",
    description: "Galerija oglasa je placeholder ikonica, ne prave slike. Formular za postavljanje oglasa (M3) namerno ne traži fotografije — to je S1.",
    severity: "medium",
    blocks: "S1",
  },
  {
    id: "TD7",
    title: "/admin stranica nema autentikaciju",
    description: "Auth (M2) je sad gotov, pa se ovo lako rešava vezivanjem za konkretan nalog vlasnika — samo još nije urađeno.",
    severity: "high",
  },
  {
    id: "TD8",
    title: "GitHub Actions runneri javljaju Node 20 deprecation warning",
    description: "actions/checkout@v4 i actions/setup-node@v4 interno koriste Node 20 runtime koji GitHub penzioniše. Ne pada build, ali treba bump na v5 kad se sledeći put dira workflow.",
    severity: "low",
  },
  {
    id: "TD10",
    title: "Nema rate-limitinga na formularu za oglase",
    description: "Bilo koji prijavljeni nalog trenutno može da postavi neograničen broj oglasa bez ograničenja — otvoreno za spam.",
    severity: "medium",
  },
  {
    id: "TD11",
    title: "Supabase env varijable nisu još u Vercel-u",
    description: "NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY su samo u lokalnom .env.local. Dok se ne dodaju u Vercel Environment Variables, produkcija radi na in-memory mock podacima.",
    severity: "high",
  },
];
