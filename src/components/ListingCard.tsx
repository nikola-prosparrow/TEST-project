"use client";

import { useState } from "react";
import Link from "next/link";
import type { Listing } from "@/lib/listings/types";
import { formatPrice } from "@/lib/format";
import {
  HeartIcon,
  ShieldIcon,
  HouseIcon,
  BedIcon,
  BathIcon,
  AreaIcon,
} from "@/components/icons";

export function ListingCard({ listing }: { listing: Listing }) {
  const [fav, setFav] = useState(false);

  return (
    <Link href={`/listing/${listing.id}`} className="card">
      <div className="card-photo">
        <HouseIcon />
        <button
          className="heart-btn"
          aria-label="Sačuvaj oglas"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFav((prev) => !prev);
          }}
        >
          <HeartIcon active={fav} />
        </button>
      </div>
      <div className="card-body">
        <div className="card-top">
          <span className="card-price">{formatPrice(listing)}</span>
          {listing.verified && <ShieldIcon />}
        </div>
        <div className="card-title">{listing.title}</div>
        <div className="card-addr">{listing.city}</div>
        <div className="card-stats">
          <span>
            <BedIcon />
            {listing.rooms}
          </span>
          <span>
            <BathIcon />
            {listing.bathrooms}
          </span>
          <span>
            <AreaIcon />
            {listing.areaSqm} m²
          </span>
        </div>
      </div>
    </Link>
  );
}
