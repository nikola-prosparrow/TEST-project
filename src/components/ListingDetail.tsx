"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/MobileTabBar";
import { HeartIcon, ShieldIcon } from "@/components/icons";
import type { Listing } from "@/data/listings";

export function ListingDetail({ listing }: { listing: Listing }) {
  const [fav, setFav] = useState(!!listing.fav);
  const { detail } = listing;

  return (
    <div>
      <SiteHeader showSaved={false} />

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
          <svg viewBox="0 0 24 24" width={72} height={72} fill="none" stroke="#1D1D1F" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.16 }}>
            <path d="M4 11.5 12 4l8 7.5" />
            <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" />
          </svg>
        </div>
        <div className="gallery-thumbs">
          <div className="gallery-thumb" style={{ background: "linear-gradient(135deg, rgba(242,136,74,0.1), rgba(214,65,127,0.1))" }}>
            <svg viewBox="0 0 24 24" width={44} height={44} fill="none" stroke="#1D1D1F" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.16 }}>
              <path d="M4 11.5 12 4l8 7.5" />
              <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" />
            </svg>
          </div>
          <div className="gallery-thumb" style={{ background: "linear-gradient(135deg, rgba(214,65,127,0.1), rgba(122,53,150,0.1))" }}>
            <svg viewBox="0 0 24 24" width={44} height={44} fill="none" stroke="#1D1D1F" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.16 }}>
              <path d="M4 11.5 12 4l8 7.5" />
              <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" />
            </svg>
            <div className="gallery-more-overlay">+{Math.max(listing.photos - 2, 0)} foto</div>
          </div>
        </div>
        <div className="gallery-actions">
          <button className="icon-btn" aria-label="Sačuvaj oglas" onClick={() => setFav((prev) => !prev)}>
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
            <span className="type">{detail.kicker}</span>
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
            {detail.fullAddress}
          </div>

          <div className="stat-row">
            <div className="stat-item">
              <strong>{listing.area}</strong>
              <span>Površina</span>
            </div>
            <div className="stat-item">
              <strong>{listing.beds}</strong>
              <span>Sobe</span>
            </div>
            <div className="stat-item">
              <strong>{listing.baths}</strong>
              <span>Kupatilo</span>
            </div>
            <div className="stat-item">
              <strong>{detail.floor}</strong>
              <span>Sprat</span>
            </div>
            <div className="stat-item">
              <strong>{detail.yearBuilt}</strong>
              <span>Godina gradnje</span>
            </div>
          </div>

          <h2>O nekretnini</h2>
          <p className="desc">{detail.description}</p>

          <h2>Karakteristike</h2>
          <div className="feature-list">
            {detail.features.map((feature) => (
              <div key={feature} className="feature-item">
                <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="#D6417F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l4 4L19 6" />
                </svg>
                {feature}
              </div>
            ))}
          </div>

          <h2>Lokacija</h2>
          <div className="map-placeholder">
            <svg viewBox="0 0 24 24" width={40} height={40} fill="none" stroke="#1D1D1F" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
              <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
              <circle cx={12} cy={9} r={2.4} />
            </svg>
          </div>
        </div>

        <div>
          <div className="sidebar-card">
            <div className="sidebar-price">{listing.price}</div>
            <div className="sidebar-permsqm">{detail.pricePerArea}</div>

            <div className="agent-row">
              <div className="agent-avatar">{detail.agentInitials}</div>
              <div>
                <div className="agent-name">{detail.agentName}</div>
                <div className="agent-role">{detail.agentRole}</div>
              </div>
            </div>

            <button className="btn btn-primary btn-block">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5h16v11H8l-4 4V5z" />
              </svg>
              Pošalji poruku
            </button>
            <button className="btn btn-secondary btn-block">Zakaži razgledanje</button>
            <button className="btn btn-secondary btn-block">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.6 3.6l3 3-2 2.4a12 12 0 0 0 5.4 5.4l2.4-2 3 3-1.6 1.6a3 3 0 0 1-2.9.8A18 18 0 0 1 3.4 6.9a3 3 0 0 1 .8-2.9l2.4-1.4z" />
              </svg>
              Prikaži broj telefona
            </button>
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileTabBar initialActive="saved" />
    </div>
  );
}
