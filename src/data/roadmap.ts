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
    description: "\"Pošalji poruku\"/\"Zakaži razgledanje\" upisuju poruku u bazu, vlasnik je vidi u /moj-nalog (S4). \"Prikaži broj telefona\" čita telefon iz vlasnikovog profila (unosi se pri postavljanju oglasa). Bez email notifikacija za sada (dogovoreno, AD8).",
    jtbd: ["Kupac #3", "Prodavac #2"],
    done: true,
  },
  {
    id: "M6",
    title: "Prava adresa i mapa",
    description: "Geokodiranje unete adrese (OpenStreetMap Nominatim) pri postavljanju oglasa, čuvanje lat/lng, prikaz približne lokacije na mapi (Leaflet) na stranici oglasa. Ako geokodiranje ne uspe, oglas se ipak objavljuje bez pina (best-effort, ne blokira).",
    jtbd: ["Kupac #2"],
    done: true,
  },
  {
    id: "UI1",
    title: "Konzistentan header",
    description: "\"Postavi oglas\" je sad uvek vidljivo na svakoj stranici, nav linkovi imaju white-space: nowrap, email se skraćuje umesto da lomi layout, 'Izdavanje'/'Prodaj / izdaj' sad vode na prave rute.",
    jtbd: ["Prodavac #1"],
    done: true,
  },
  {
    id: "S1",
    title: "Upload pravih fotografija",
    description: "Upload preko Supabase Storage (bucket 'listing-photos', do 8 po oglasu), prikaz u galeriji na kartici i stranici oglasa.",
    jtbd: ["Kupac #2"],
    done: true,
  },
  {
    id: "S3",
    title: "Trajno sačuvani oglasi",
    description: "Heart dugme sad zove Server Action i upisuje/briše red u favorites tabeli, vezano za nalog. /sacuvano prikazuje listu.",
    jtbd: ["Kupac #4"],
    done: true,
  },
  {
    id: "S4",
    title: "Dashboard vlasnika",
    description: "/moj-nalog prikazuje sopstvene postavljene oglase i primljene poruke (iz M5) na jednom mestu.",
    jtbd: ["Prodavac #3"],
    done: true,
  },
];

export const roadmapNext: RoadmapItem[] = [
  {
    id: "S2",
    title: "Verifikacija oglasa",
    description: "Potvrda vlasništva i/ili broja telefona pre nego što se oglas označi kao \"Verifikovan\".",
    jtbd: ["Kupac #2"],
  },
  {
    id: "S5",
    title: "In-app poruke (dvosmerni thread)",
    description: "M5 daje jednosmernu poruku kupac→vlasnik vidljivu u dashboard-u. S5 dodaje odgovore, thread po oglasu, i notifikacije o novim porukama.",
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
    description: "Vizuelna pretraga po lokaciji (klaster pinova na mapi) umesto liste gradova — nadgradnja na lat/lng podatke iz M6.",
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
