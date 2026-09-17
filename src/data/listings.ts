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
  },
];
