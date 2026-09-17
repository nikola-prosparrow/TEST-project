import type { DocumentKey, DocumentStatus, TransactionStage } from "./types";

export const STAGE_LABELS: Record<TransactionStage, string> = {
  reservation: "Rezervacija",
  arras: "Arras",
  notary: "Notar",
  completed: "Završeno",
  cancelled: "Otkazano",
};

export const STAGE_ORDER: TransactionStage[] = ["reservation", "arras", "notary", "completed"];

export const DOCUMENT_LABELS: Record<DocumentKey, { title: string; hint: string }> = {
  nota_simple: {
    title: "Nota simple",
    hint: "Izvod iz zemljišnih knjiga — vlasništvo, hipoteke, tereti.",
  },
  cedula_habitabilidad: {
    title: "Cédula de habitabilidad",
    hint: "Potvrda da stan ispunjava minimalne uslove za stanovanje.",
  },
  ite: {
    title: "ITE (tehnički pregled zgrade)",
    hint: "Obavezno ako je zgrada starija od 45 godina.",
  },
  cee: {
    title: "Certificado de eficiencia energética",
    hint: "Energetski sertifikat, važi 10 godina.",
  },
  deuda_cero: {
    title: "Potvrda \"nulti dug\"",
    hint: "IBI i troškovi zajednice (comunidad) izmireni, bez dugovanja.",
  },
  vpo_check: {
    title: "Provera VPO statusa",
    hint: "Da li je stan subvencionisan (vivienda protegida) — ograničenja prodaje.",
  },
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  pending: "Nije zatraženo",
  requested: "Zatraženo",
  received: "Dobijeno",
  not_applicable: "Ne primenjuje se",
};
