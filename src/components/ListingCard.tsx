"use client";

import { useState } from "react";
import Link from "next/link";
import type { Listing } from "@/lib/listings/types";
import { formatPrice } from "@/lib/format";
import { publicPhotoUrl } from "@/lib/storage";
import { toggleFavoriteAction } from "@/app/actions/favorites";
import {
  HeartIcon,
  ShieldIcon,
  HouseIcon,
  BedIcon,
  BathIcon,
  AreaIcon,
} from "@/components/icons";

export function ListingCard({ listing, initialFav = false }: { listing: Listing; initialFav?: boolean }) {
  const [fav, setFav] = useState(initialFav);
  const [pending, setPending] = useState(false);
  const coverPhoto = listing.photoPaths[0];

  return (
    <Link href={`/listing/${listing.id}`} className="card">
      <div className="card-photo" style={coverPhoto ? { background: "none" } : undefined}>
        {coverPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={publicPhotoUrl(coverPhoto)}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <HouseIcon />
        )}
        <button
          className="heart-btn"
          aria-label="Sačuvaj oglas"
          disabled={pending}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            setPending(true);
            try {
              const next = await toggleFavoriteAction(listing.id);
              setFav(next);
            } finally {
              setPending(false);
            }
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
