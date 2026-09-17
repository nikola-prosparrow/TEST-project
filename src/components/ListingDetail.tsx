"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/MobileTabBar";
import { ContactOwnerForm } from "@/components/ContactOwnerForm";
import { OfferForm } from "@/components/OfferForm";
import { HeartIcon, ShieldIcon } from "@/components/icons";
import type { Listing } from "@/lib/listings/types";
import type { CurrentUser } from "@/lib/auth";
import { formatPrice, formatPricePerArea } from "@/lib/format";
import { listingKicker } from "@/lib/listings/labels";
import { publicPhotoUrl } from "@/lib/storage";
import { toggleFavoriteAction } from "@/app/actions/favorites";
import dynamic from "next/dynamic";

const ListingMap = dynamic(() => import("@/components/ListingMap").then((m) => m.ListingMap), {
  ssr: false,
});

export function ListingDetail({
  listing,
  user,
  ownerPhone,
  initialFav = false,
}: {
  listing: Listing;
  user: CurrentUser | null;
  ownerPhone: string | null;
  initialFav?: boolean;
}) {
  const [fav, setFav] = useState(initialFav);
  const [favPending, setFavPending] = useState(false);
  const coverPhoto = listing.photoPaths[0];

  return (
    <div>
      <SiteHeader user={user} />

      <div className="wrap">
        <Link href="/" className="breadcrumb">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          Nazad na pretragu
        </Link>
      </div>

      <div className="wrap gallery">
        <div className="gallery-main">
          {coverPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={publicPhotoUrl(coverPhoto)}
              alt={listing.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <svg viewBox="0 0 24 24" width={72} height={72} fill="none" stroke="#1D1D1F" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.16 }}>
              <path d="M4 11.5 12 4l8 7.5" />
              <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" />
            </svg>
          )}
        </div>
        {listing.photoPaths.length > 1 && (
          <div className="gallery-thumbs">
            {listing.photoPaths.slice(1, 3).map((path) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={path}
                src={publicPhotoUrl(path)}
                alt=""
                className="gallery-thumb"
                style={{ objectFit: "cover" }}
              />
            ))}
          </div>
        )}
        <div className="gallery-actions">
          <button
            className="icon-btn"
            aria-label="Sačuvaj oglas"
            disabled={favPending}
            onClick={async () => {
              setFavPending(true);
              try {
                const next = await toggleFavoriteAction(listing.id);
                setFav(next);
              } finally {
                setFavPending(false);
              }
            }}
          >
            <HeartIcon active={fav} size={18} />
          </button>
          <button className="icon-btn" aria-label="Podeli oglas">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
              <circle cx={18} cy={5} r={2.6} />
              <circle cx={6} cy={12} r={2.6} />
              <circle cx={18} cy={19} r={2.6} />
              <path d="M8.4 10.6l7.2-4M8.4 13.4l7.2 4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="wrap listing-body">
        <div>
          <div className="listing-kicker">
            <span className="type">{listingKicker(listing.listingType, listing.propertyType)}</span>
            {listing.verified && (
              <>
                <ShieldIcon size={15} />
                <span className="verified">Verifikovan oglas</span>
              </>
            )}
          </div>
          <h1 className="listing-title">{listing.title}</h1>
          <div className="listing-addr">
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
              <circle cx={12} cy={9} r={2.4} />
            </svg>
            {listing.address}
          </div>

          <div className="stat-row">
            <div className="stat-item">
              <strong>{listing.areaSqm} m²</strong>
              <span>Površina</span>
            </div>
            <div className="stat-item">
              <strong>{listing.rooms}</strong>
              <span>Sobe</span>
            </div>
            <div className="stat-item">
              <strong>{listing.bathrooms}</strong>
              <span>Kupatilo</span>
            </div>
            {listing.floor && (
              <div className="stat-item">
                <strong>{listing.floor}</strong>
                <span>Sprat</span>
              </div>
            )}
            {listing.yearBuilt && (
              <div className="stat-item">
                <strong>{listing.yearBuilt}</strong>
                <span>Godina gradnje</span>
              </div>
            )}
          </div>

          <h2>O nekretnini</h2>
          <p className="desc">{listing.description}</p>

          {listing.features.length > 0 && (
            <>
              <h2>Karakteristike</h2>
              <div className="feature-list">
                {listing.features.map((feature) => (
                  <div key={feature} className="feature-item">
                    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="#D6417F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l4 4L19 6" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            </>
          )}

          <h2>Lokacija</h2>
          {listing.lat !== null && listing.lng !== null ? (
            <ListingMap lat={listing.lat} lng={listing.lng} />
          ) : (
            <div className="map-placeholder">
              <svg viewBox="0 0 24 24" width={40} height={40} fill="none" stroke="#1D1D1F" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
                <circle cx={12} cy={9} r={2.4} />
              </svg>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="sidebar-card">
            <div className="sidebar-price">{formatPrice(listing)}</div>
            <div className="sidebar-permsqm">{formatPricePerArea(listing)}</div>

            <ContactOwnerForm listingId={listing.id} ownerId={listing.ownerId} ownerPhone={ownerPhone} />
          </div>

          {user && user.id !== listing.ownerId && (
            <OfferForm listingId={listing.id} ownerId={listing.ownerId} defaultEmail={user.email} />
          )}
        </div>
      </div>

      <SiteFooter />
      <MobileTabBar initialActive="saved" />
    </div>
  );
}
