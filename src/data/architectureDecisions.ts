export type ArchitectureDecision = {
  id: string;
  question: string;
  options: string[];
  recommendation: string;
  decision?: string;
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
      "Supabase — daje bazu, auth i file storage u jednom, manje pokretnih delova za mali tim.",
    decision: "Supabase. Šema u supabase/migrations/0001_create_listings.sql, RLS uključen.",
    status: "decided",
  },
  {
    id: "AD2",
    question: "Koji auth provider za naloge vlasnika?",
    options: ["Custom (ručno rolovan)", "Auth.js (NextAuth)", "Supabase Auth", "Clerk"],
    recommendation:
      "Supabase Auth ako ide Supabase za bazu — ima ugrađenu verifikaciju telefona/emaila koja nam treba za \"Verifikovan oglas\" (Kupac JTBD #2).",
    decision: "Supabase Auth, email + lozinka. Telefonska/email verifikacija za \"Verifikovan oglas\" još nije iskorišćena — to je S2.",
    status: "decided",
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
      "Server Components — idiomatski za Next.js App Router, manje boilerplate-a za MVP obim.",
    decision: "Server Components. Home i listing detalj su async Server Components koji zovu repository sloj direktno.",
    status: "decided",
  },
  {
    id: "AD5",
    question: "Kako se rade mutacije (postavljanje oglasa, slanje poruke)?",
    options: ["Server Actions", "Route Handlers (app/api/*)"],
    recommendation:
      "Server Actions — manje koda za formulare, direktna integracija sa React formama.",
    decision: "Server Actions (src/app/actions/). Koristi useActionState na klijentu za pending/error state.",
    status: "decided",
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
      "Kombinacija — brzi unit testovi sa mock-ovanim data-layer-om za TDD petlju, Playwright e2e ide na pravu (test) bazu za end-to-end poverenje.",
    decision:
      "Pojednostavljeno u odnosu na preporuku: nemamo poseban Supabase test projekat (dodatni nalog), pa repository factory koristi in-memory implementaciju kad god NEXT_PUBLIC_SUPABASE_URL nije podešen — što pokriva i unit testove i e2e/CI (GitHub Actions nema Supabase secrets). Lokalni dev i produkcija koriste pravi Supabase. Rizik: e2e ne testira stvarnu Supabase integraciju (RLS, mrežne greške) — vredi razmotriti poseban test projekat kad se pojavi budžet/vreme.",
    status: "decided",
  },
];
