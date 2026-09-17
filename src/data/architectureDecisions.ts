export type ArchitectureDecision = {
  id: string;
  question: string;
  options: string[];
  recommendation: string;
  status: "open" | "decided";
};

export const architectureDecisions: ArchitectureDecision[] = [
  {
    id: "AD1",
    question: "Koja baza podataka napaja prave oglase?",
    options: [
      "Supabase (Postgres + auth + storage u paketu)",
      "Vercel Postgres / Neon + Prisma ORM",
      "PlanetScale (MySQL)",
    ],
    recommendation:
      "Supabase — daje bazu, auth i file storage u jednom, manje pokretnih delova za mali tim. Smanjuje broj odluka (AD1+AD2+AD3 rešava odjednom).",
    status: "open",
  },
  {
    id: "AD2",
    question: "Koji auth provider za naloge vlasnika?",
    options: ["Custom (ručno rolovan)", "Auth.js (NextAuth)", "Supabase Auth", "Clerk"],
    recommendation:
      "Supabase Auth ako ide Supabase za bazu — ima ugrađenu verifikaciju telefona/emaila koja nam treba za \"Verifikovan oglas\" (Kupac JTBD #2). Ručno rolovan auth izbegavati na MVP-u — sigurnosni rizik bez dovoljno vremena za review.",
    status: "open",
  },
  {
    id: "AD3",
    question: "Gde se čuvaju fotografije oglasa?",
    options: ["Vercel Blob", "Supabase Storage", "Cloudinary"],
    recommendation:
      "Isti provider kao baza/auth (Supabase Storage) radi manje kompleksnosti i jednog dashboard-a za sve.",
    status: "open",
  },
  {
    id: "AD4",
    question: "Data-fetching pattern za listing podatke?",
    options: [
      "Server Components sa direktnim upitima ka bazi",
      "Zaseban REST/GraphQL API sloj",
    ],
    recommendation:
      "Server Components — idiomatski za Next.js App Router, manje boilerplate-a za MVP obim. API sloj razmotriti tek ako se pojavi mobilna app ili treći klijent.",
    status: "open",
  },
  {
    id: "AD5",
    question: "Kako se rade mutacije (postavljanje oglasa, slanje poruke)?",
    options: ["Server Actions", "Route Handlers (app/api/*)"],
    recommendation:
      "Server Actions — manje koda za formulare, direktna integracija sa React formama koje već koristimo (npr. search-card).",
    status: "open",
  },
  {
    id: "AD6",
    question: "Test strategija za backend (baza/auth) kod?",
    options: [
      "Test baza + seed/teardown po test run-u",
      "Mock/stub sloja za bazu u unit testovima",
      "Kombinacija: unit testovi mock-uju, e2e ide na test bazu",
    ],
    recommendation:
      "Kombinacija — brzi unit testovi sa mock-ovanim data-layer-om za TDD petlju, Playwright e2e ide na pravu (test) bazu za end-to-end poverenje. Odluka treba PRE početka M1, da TDD ostane primenjiv na backend kod.",
    status: "open",
  },
];
