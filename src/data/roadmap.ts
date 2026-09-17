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
    description: "/moj-nalog prikazuje sopstvene postavljene oglase, primljene poruke (M5) i ponude (M7) na jednom mestu.",
    jtbd: ["Prodavac #3"],
    done: true,
  },
  {
    id: "M7",
    title: "Ponude i bidding",
    description: "Kupac podnosi formalnu ponudu (iznos + poruka) na oglas. Vlasnik vidi SVE ponude na svoje oglase u /moj-nalog (sortirane po iznosu) i bira sam koju da prihvati/odbije — sealed-bid, ponuđači ne vide tuđe iznose. Rešava suštinu \"agencija me zavrne\" problema bez ijednog posrednika.",
    jtbd: ["Prodavac #5", "Kupac #5"],
    done: true,
  },
  {
    id: "C5",
    title: "Rezervacija → Arras → Notar (tracker, ne generator ugovora)",
    description: "/transakcija/[id] prati proces kroz faze uz dokument checklist (nota simple, cédula, ITE, CEE, nulti dug, VPO) i upadljivo pravno upozorenje da se konsultuje advokat PRE potpisivanja. Ne generiše ugovore — to ostaje pravni posao van platforme (AD10).",
    jtbd: ["Prodavac #6", "Kupac #6"],
    done: true,
  },
  {
    id: "C6",
    title: "Potvrda depozita (bez pravog transfera novca)",
    description: "Vlasnik i kupac nezavisno potvrđuju da je depozit (rezervacija/Arras) plaćen VAN platforme (npr. bankovnim transferom) — dve odvojene potvrde, bez ijednog eura koji prolazi kroz ProSparrow. Pravo escrow plaćanje ostaje van dometa (AD10).",
    jtbd: ["Prodavac #6", "Kupac #6"],
    done: true,
  },
  {
    id: "C7",
    title: "\"Best and final\" rok",
    description: "Vlasnik postavlja rok na oglasu; banner vidljiv svim posetiocima poziva na finalne ponude pre isteka.",
    jtbd: ["Prodavac #5"],
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
  {
    id: "C8",
    title: "Notifikacije za ponude",
    description: "Email vlasniku kad stigne nova ponuda, email kupcu kad njegova ponuda bude prihvaćena/odbijena. Čeka SMTP servis (isto ograničenje kao AD8).",
    jtbd: ["Prodavac #5", "Kupac #5"],
  },
  {
    id: "C9",
    title: "Pravi ugovori (rezervacija + Arras)",
    description: "Ono što C5 namerno NE radi: stvarno generisanje ili e-potpis pravno validnog ugovora. Zahteva partnerstvo sa advokatskom kancelarijom/legal-tech servisom (npr. e-potpis + pravni šablon overen za špansko tržište). Van dometa dok se ne nađe pravni partner — rizik je preveliki da se ovo radi bez licenciranog pravnika koji stoji iza sadržaja.",
    jtbd: ["Prodavac #6", "Kupac #6"],
  },
  {
    id: "C10",
    title: "Pravo escrow plaćanje depozita",
    description: "Ono što C6 namerno NE radi: stvaran transfer novca. Zahteva escrow/payment provajdera (npr. Stripe Connect) i regulatornu proveru po zemlji. Agent ne sme sam da izvršava finansijske transfere — ovo zahteva svesnu odluku vlasnika proizvoda i verovatno spoljnog pravnog saveta pre početka rada.",
    jtbd: ["Prodavac #6", "Kupac #6"],
  },
];

export const wontHave: string[] = [
  "Agenti/agencije kao tip naloga — eksplicitno isključeno, gradimo čist FSBO",
];
