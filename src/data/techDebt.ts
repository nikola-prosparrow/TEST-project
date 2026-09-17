export type TechDebtItem = {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  blocks?: string;
};

export const techDebt: TechDebtItem[] = [
  {
    id: "TD1",
    title: "Svi podaci su hardkodovani mock podaci",
    description: "src/data/listings.ts je statički niz u kodu, ne baza. Svaka izmena zahteva deploy.",
    severity: "high",
    blocks: "M1",
  },
  {
    id: "TD2",
    title: "Pretraga na landing page-u je dekorativna",
    description: "Polja za grad/tip/cenu ne filtriraju listing-grid — samo vizuelno postoje.",
    severity: "high",
    blocks: "M4",
  },
  {
    id: "TD3",
    title: "Dugmad za kontakt ne rade",
    description: "\"Pošalji poruku\", \"Zakaži razgledanje\", \"Prikaži broj telefona\" nemaju funkcionalnost.",
    severity: "high",
    blocks: "M5",
  },
  {
    id: "TD4",
    title: "Nema autentikacije ni autorizacije",
    description: "Nema naloga, nema pojma ko je vlasnik kog oglasa. Preduslov za M2, M3, S3, S4.",
    severity: "high",
    blocks: "M2",
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
    description: "Galerija oglasa je placeholder ikonica, ne prave slike.",
    severity: "medium",
    blocks: "S1",
  },
  {
    id: "TD7",
    title: "/admin stranica nema autentikaciju",
    description: "Trenutno je dostupna svakom ko zna URL. Treba je zaštititi čim M2 (auth) bude gotov.",
    severity: "high",
    blocks: "M2",
  },
  {
    id: "TD8",
    title: "GitHub Actions runneri javljaju Node 20 deprecation warning",
    description: "actions/checkout@v4 i actions/setup-node@v4 interno koriste Node 20 runtime koji GitHub penzioniše. Ne pada build, ali treba bump na v5 kad se sledeći put dira workflow.",
    severity: "low",
  },
  {
    id: "TD9",
    title: "Nema environment/secrets management setup-a",
    description: "Kad dodamo bazu i auth, trebaće .env konvencija i Vercel Environment Variables — nije još definisano.",
    severity: "medium",
    blocks: "M1",
  },
];
