"use client";

import { useState } from "react";
import { Listing } from "@/data/listings";
import {
  HeartIcon,
  ShieldIcon,
  HouseIcon,
  CameraIcon,
  BedIcon,
  BathIcon,
  AreaIcon,
} from "@/components/icons";

export function ListingCard({ listing }: { listing: Listing }) {
  const [fav, setFav] = useState(!!listing.fav);

  return (
    <div className="card">
      <div className="card-photo">
        <HouseIcon />
        <button
          className="heart-btn"
          aria-label="Sačuvaj oglas"
          onClick={() => setFav((prev) => !prev)}
        >
          <HeartIcon active={fav} />
        </button>
        <div className="photo-count">
          <CameraIcon />
          {listing.photos}
        </div>
      </div>
      <div className="card-body">
        <div className="card-top">
          <span className="card-price">{listing.price}</span>
          {listing.verified && <ShieldIcon />}
        </div>
        <div className="card-title">{listing.title}</div>
        <div className="card-addr">{listing.addr}</div>
        <div className="card-stats">
          <span>
            <BedIcon />
            {listing.beds}
          </span>
          <span>
            <BathIcon />
            {listing.baths}
          </span>
          <span>
            <AreaIcon />
            {listing.area}
          </span>
        </div>
      </div>
    </div>
  );
}
