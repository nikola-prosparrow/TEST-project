export type TechDebtItem = {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  blocks?: string;
  done?: boolean;
};

export const techDebt: TechDebtItem[] = [
  {
    id: "TD3",
    title: "Dugmad za kontakt ne rade",
    description: "\"Pošalji poruku\"/\"Zakaži razgledanje\" šalju pravu poruku u bazu (ContactOwnerForm + sendMessageAction), \"Prikaži broj telefona\" čita iz profila vlasnika.",
    severity: "high",
    done: true,
  },
  {
    id: "TD5",
    title: "Favorite (heart) state nije trajan",
    description: "Heart dugme sad zove toggleFavoriteAction (Server Action), upisuje/briše red u favorites tabeli. Vidljivo trajno na /sacuvano.",
    severity: "medium",
    done: true,
  },
  {
    id: "TD6",
    title: "Nema uploada fotografija",
    description: "Upload preko Supabase Storage u formularu za oglase, prikaz na kartici i stranici oglasa.",
    severity: "medium",
    done: true,
  },
  {
    id: "TD7",
    title: "/admin stranica nema autentikaciju",
    description: "Zaštićena: traži prijavu, pa proverava da email odgovara ADMIN_EMAIL env varijabli. Nepoznatim korisnicima vraća 404, ne otkriva da stranica postoji.",
    severity: "high",
    done: true,
  },
  {
    id: "TD8",
    title: "GitHub Actions runneri javljaju Node 20 deprecation warning",
    description: "actions/checkout, actions/setup-node i actions/upload-artifact bumpovani na v5 (Node 24 runtime) u ci.yml.",
    severity: "low",
    done: true,
  },
  {
    id: "TD10",
    title: "Nema rate-limitinga na formularu za oglase",
    description: "createListingAction sad ograničava na 5 novih oglasa po nalogu u rolling 24h prozoru (countRecentByOwner).",
    severity: "medium",
    done: true,
  },
  {
    id: "TD11",
    title: "Supabase env varijable nisu još u Vercel-u",
    description: "NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY su dodati u Vercel Environment Variables (Production + Preview) i redeploy je potvrdio da produkcija čita iz prave baze.",
    severity: "high",
    done: true,
  },
  {
    id: "TD12",
    title: "In-memory repository se pravio iznova pri svakom pozivu",
    description: "getListingsRepository() je vraćao createInMemoryRepository() svaki put umesto deljene instance — oglasi kreirani lokalno bez Supabase-a ne bi preživeli sledeći request. Ispravljeno na module-level singleton (isti pattern kao messages/favorites).",
    severity: "medium",
    done: true,
  },
];
