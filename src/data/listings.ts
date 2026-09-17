export type Listing = {
  id: string;
  price: string;
  title: string;
  addr: string;
  beds: number;
  baths: number;
  area: string;
  verified: boolean;
  photos: number;
  fav?: boolean;
  detail: {
    kicker: string;
    fullAddress: string;
    floor: string;
    yearBuilt: string;
    pricePerArea: string;
    description: string;
    features: string[];
    agentName: string;
    agentInitials: string;
    agentRole: string;
  };
};

export const listings: Listing[] = [
  {
    id: "l1",
    price: "€189.000",
    title: "Svetao dvosoban stan",
    addr: "Vračar, Beograd",
    beds: 2,
    baths: 1,
    area: "64 m²",
    verified: true,
    photos: 12,
    detail: {
      kicker: "Stan na prodaju",
      fullAddress: "Njegoševa 18, Vračar, Beograd",
      floor: "3/6",
      yearBuilt: "2018.",
      pricePerArea: "≈ €2.953 / m²",
      description:
        "Svetao i funkcionalan dvosoban stan u srcu Vračara, u mirnoj ulici na par minuta od parka. Kompletno renoviran 2022. godine, sa novom stolarijom i podnim grejanjem u kupatilu. Prostrana terasa gleda na unutrašnje dvorište.",
      features: ["Podno grejanje", "Terasa", "Lift", "Parking mesto", "Klima uređaj", "Nameštaj"],
      agentName: "Milica Jovanović",
      agentInitials: "MJ",
      agentRole: "Agent za nekretnine",
    },
  },
  {
    id: "l2",
    price: "€245.000",
    title: "Porodična kuća sa dvorištem",
    addr: "Zemun, Beograd",
    beds: 4,
    baths: 2,
    area: "180 m²",
    verified: true,
    photos: 18,
    fav: true,
    detail: {
      kicker: "Kuća na prodaju",
      fullAddress: "Cara Dušana 42, Zemun, Beograd",
      floor: "Prizemlje + sprat",
      yearBuilt: "2015.",
      pricePerArea: "≈ €1.361 / m²",
      description:
        "Prostrana porodična kuća u mirnom delu Zemuna, sa ograđenim dvorištem i garažom za dva vozila. Dnevni boravak povezan sa trpezarijom i kuhinjom, četiri spavaće sobe raspoređene na dve etaže. Idealno za porodicu koja traži mir uz blizinu grada.",
      features: ["Dvorište", "Garaža", "Podrum", "Terasa", "Klima uređaj", "Nameštaj"],
      agentName: "Nikola Petrović",
      agentInitials: "NP",
      agentRole: "Agent za nekretnine",
    },
  },
  {
    id: "l3",
    price: "€520 / mesečno",
    title: "Moderna garsonjera",
    addr: "Novi Sad, Centar",
    beds: 1,
    baths: 1,
    area: "32 m²",
    verified: false,
    photos: 8,
    detail: {
      kicker: "Garsonjera za izdavanje",
      fullAddress: "Zmaj Jovina 5, Centar, Novi Sad",
      floor: "2/4",
      yearBuilt: "2020.",
      pricePerArea: "Depozit: €520",
      description:
        "Moderno opremljena garsonjera u samom centru Novog Sada, na par minuta hoda od Zmaj Jovine ulice i fakulteta. Kompletno opremljena kuhinja, brz internet i klima uređaj. Useljiva odmah.",
      features: ["Nameštaj", "Klima uređaj", "Internet uključen", "Veš mašina", "Lift", "Blizina fakulteta"],
      agentName: "Jovana Ilić",
      agentInitials: "JI",
      agentRole: "Agent za nekretnine",
    },
  },
  {
    id: "l4",
    price: "€310.000",
    title: "Penthouse sa terasom",
    addr: "Novi Beograd",
    beds: 3,
    baths: 2,
    area: "112 m²",
    verified: true,
    photos: 21,
    detail: {
      kicker: "Penthouse na prodaju",
      fullAddress: "Bulevar Zorana Đinđića 100, Novi Beograd",
      floor: "12/12 (penthouse)",
      yearBuilt: "2021.",
      pricePerArea: "≈ €2.768 / m²",
      description:
        "Luksuzni penthouse na poslednjem spratu, sa panoramskim pogledom na grad i velikom terasom. Otvoren dnevni prostor, dve garderobe i podno grejanje u celom stanu. Uknjižen, useljiv odmah.",
      features: ["Terasa", "Panoramski pogled", "Lift", "Parking mesto", "Klima uređaj", "Podno grejanje"],
      agentName: "Stefan Marković",
      agentInitials: "SM",
      agentRole: "Agent za nekretnine",
    },
  },
];

export function getListing(id: string): Listing | undefined {
  return listings.find((listing) => listing.id === id);
}
