"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/MobileTabBar";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/data/listings";

const CHIPS = [
  { key: "stan", label: "Stanovi" },
  { key: "kuca", label: "Kuće" },
  { key: "posl", label: "Poslovni prostor" },
  { key: "zemlj", label: "Zemljište" },
  { key: "luks", label: "Luksuzno" },
];

const CITIES = [
  { name: "Beograd", count: "2.481 nekretnina", gradient: "linear-gradient(135deg, #F2884A, #D6417F)" },
  { name: "Novi Sad", count: "864 nekretnina", gradient: "linear-gradient(135deg, #D6417F, #7A3596)" },
  { name: "Niš", count: "312 nekretnina", gradient: "linear-gradient(135deg, #F2884A, #7A3596)" },
  { name: "Subotica", count: "128 nekretnina", gradient: "linear-gradient(135deg, #7A3596, #D6417F)" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"buy" | "rent">("buy");
  const [activeChip, setActiveChip] = useState("stan");

  return (
    <div>
      <SiteHeader />

      <section className="hero">
        <div className="hero-glow" />
        <div className="wrap hero-inner">
          <div className="badge-pill">
            <span className="badge-dot" />
            Kupovina · Izdavanje · Novogradnja
          </div>
          <h1>
            Pronađi dom koji ti <em>sedne</em>.
          </h1>
          <p className="lead">
            Provereni oglasi, jasne cene, bez sitnih slova. Pretraga koja stvarno ide brzo.
          </p>

          <form className="search-card" onSubmit={(e) => e.preventDefault()}>
            <div className="search-tabs">
              <button
                type="button"
                className={`tab-btn${activeTab === "buy" ? " active" : ""}`}
                onClick={() => setActiveTab("buy")}
              >
                Kupovina
              </button>
              <button
                type="button"
                className={`tab-btn${activeTab === "rent" ? " active" : ""}`}
                onClick={() => setActiveTab("rent")}
              >
                Izdavanje
              </button>
            </div>
            <div className="search-row">
              <div className="search-field">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6E6E73" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
                  <circle cx={12} cy={9} r={2.4} />
                </svg>
                <input type="text" placeholder="Grad, opština ili naselje" />
              </div>
              <div className="search-divider" />
              <div className="search-field">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6E6E73" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 11.5 12 4l8 7.5" />
                  <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" />
                </svg>
                <span>Tip nekretnine</span>
              </div>
              <div className="search-divider" />
              <div className="search-field">
                <span>Cena</span>
              </div>
              <button type="submit" className="btn btn-primary">
                <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round">
                  <circle cx={11} cy={11} r={7} />
                  <line x1={21} y1={21} x2={16.5} y2={16.5} />
                </svg>
                Pretraži
              </button>
            </div>
          </form>

          <div className="hero-actions">
            <button className="btn btn-primary">
              Postavi oglas
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
            <button className="btn btn-secondary">Kako radimo</button>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="chips-row">
          {CHIPS.map((chip) => (
            <button
              key={chip.key}
              className={`chip${activeChip === chip.key ? " active" : ""}`}
              onClick={() => setActiveChip(chip.key)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <section className="wrap section">
        <div className="section-head">
          <h2>Izdvojeno za tebe</h2>
          <a href="#" className="section-link">
            Pogledaj sve
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </a>
        </div>
        <div className="listing-grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="city-section">
        <div className="wrap">
          <div className="section-head" style={{ marginBottom: 22 }}>
            <h2>Pretraži po gradu</h2>
          </div>
          <div className="city-grid">
            {CITIES.map((city) => (
              <a key={city.name} className="city-card" href="#" style={{ background: city.gradient }}>
                <div className="overlay" />
                <div className="label">
                  <strong>{city.name}</strong>
                  <span>{city.count}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap feature-grid">
        <div className="feature">
          <div className="feature-icon">
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#D6417F" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
              <circle cx={11} cy={11} r={7} />
              <line x1={21} y1={21} x2={16.5} y2={16.5} />
            </svg>
          </div>
          <h3>Brzo pretraživanje</h3>
          <p>Filtriraj po ceni, lokaciji i tipu nekretnine i dobij rezultate za par sekundi.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#D6417F" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l7 3v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <h3>Svaki oglas je proveren</h3>
          <p>Ručno proveravamo vlasništvo i fotografije pre nego što oglas ode u pretragu.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#D6417F" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5h16v11H8l-4 4V5z" />
            </svg>
          </div>
          <h3>Podrška kad ti zatreba</h3>
          <p>Čet sa timom ProSparrow, sedam dana u nedelji, bez čekanja u redu.</p>
        </div>
      </section>

      <section className="wrap cta-section">
        <div className="cta-banner">
          <div>
            <h2>Prodaješ ili izdaješ nekretninu?</h2>
            <p>Postavi oglas besplatno za 5 minuta i stigni do hiljada zainteresovanih kupaca.</p>
          </div>
          <div className="cta-buttons">
            <button className="btn" style={{ background: "#fff", color: "#1D1D1F" }}>
              Postavi oglas
            </button>
            <button className="btn btn-ghost">Saznaj više</button>
          </div>
        </div>
      </section>

      <SiteFooter />
      <MobileTabBar initialActive="home" />
    </div>
  );
}
