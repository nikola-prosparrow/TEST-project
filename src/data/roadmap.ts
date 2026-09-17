export type RoadmapItem = {
  id: string;
  title: string;
  description: string;
  jtbd: string[];
  done?: boolean;
};

export const roadmapNow: RoadmapItem[] = [
  {
    id: "M1",
    title: "Baza podataka za oglase",
    description: "Repository pattern (in-memory za testove/CI, Supabase Postgres za dev/produkciju). Mock niz je sad samo test fixture, ne produkcioni izvor podataka.",
    jtbd: ["Preduslov"],
    done: true,
  },
  {
    id: "M2",
    title: "Nalog / login za vlasnike",
    description: "Supabase Auth (email + lozinka). Registracija, prijava, odjava, oglas je vezan za owner_id.",
    jtbd: ["Preduslov"],
    done: true,
  },
  {
    id: "M3",
    title: "Formular \"Postavi oglas\"",
    description: "Tip nekretnine, lokacija, cena, opis, karakteristike. Fotografije namerno izostavljene — to je S1.",
    jtbd: ["Prodavac #1"],
    done: true,
  },
  {
    id: "M4",
    title: "Funkcionalna pretraga / filter",
    description: "Pretraga po gradu, tipu nekretnine, ceni i tipu oglasa — sve preko URL query parametara (deljivi/bookmarkable rezultati), bez klijentskog JS-a.",
    jtbd: ["Kupac #1"],
    done: true,
  },
  {
    id: "M5",
    title: "Realan kontakt vlasnika",
    description: "Dugmad \"Pošalji poruku\" / \"Prikaži broj telefona\" trenutno ne rade — treba da stvarno dostave poruku ili broj.",
    jtbd: ["Kupac #3", "Prodavac #2"],
  },
];

export const roadmapNext: RoadmapItem[] = [
  {
    id: "S1",
    title: "Upload pravih fotografija",
    description: "Galerija oglasa je trenutno placeholder ikonica. Treba upload + prikaz pravih slika.",
    jtbd: ["Kupac #2"],
  },
  {
    id: "S2",
    title: "Verifikacija oglasa",
    description: "Potvrda vlasništva i/ili broja telefona pre nego što se oglas označi kao \"Verifikovan\".",
    jtbd: ["Kupac #2"],
  },
  {
    id: "S3",
    title: "Trajno sačuvani oglasi",
    description: "Heart dugme trenutno čuva stanje samo u React state-u — nestaje na refresh. Treba vezati za nalog.",
    jtbd: ["Kupac #4"],
  },
  {
    id: "S4",
    title: "Dashboard vlasnika",
    description: "Pregled sopstvenih oglasa i broja pregleda/interesovanja po oglasu.",
    jtbd: ["Prodavac #3"],
  },
  {
    id: "S5",
    title: "In-app poruke",
    description: "Thread poruka između kupca i vlasnika, ne samo dugme bez funkcije.",
    jtbd: ["Prodavac #2", "Kupac #3"],
  },
];

export const roadmapLater: RoadmapItem[] = [
  {
    id: "C1",
    title: "Plaćeno isticanje oglasa",
    description: "Monetizacija — ide posle trakcije, ne pre, jer bez korisnika nema šta da se ističe.",
    jtbd: ["Prodavac #4"],
  },
  {
    id: "C2",
    title: "Mapa pretraga",
    description: "Vizuelna pretraga po lokaciji umesto samo liste gradova.",
    jtbd: ["Kupac #1"],
  },
  {
    id: "C3",
    title: "Poređenje oglasa",
    description: "Side-by-side poređenje sačuvanih oglasa.",
    jtbd: ["Kupac #4"],
  },
  {
    id: "C4",
    title: "Notifikacije za sačuvanu pretragu",
    description: "Email/push kad se pojavi novi oglas koji odgovara kriterijumima.",
    jtbd: ["Kupac #1"],
  },
];

export const wontHave: string[] = [
  "Agenti/agencije kao tip naloga — eksplicitno isključeno, gradimo čist FSBO",
  "Ugovori / e-potpis / pravna dokumentacija",
  "Integrisano plaćanje kapare/pologa",
];
