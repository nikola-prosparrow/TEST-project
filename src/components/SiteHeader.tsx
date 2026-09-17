"use client";

import { useState } from "react";
import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import type { CurrentUser } from "@/lib/auth";

function BrandLogo() {
  return (
    <svg width={30} height={30} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="psNavGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F2884A" />
          <stop offset="55%" stopColor="#D6417F" />
          <stop offset="100%" stopColor="#7A3596" />
        </linearGradient>
      </defs>
      <circle cx={16} cy={16} r={15} fill="url(#psNavGrad)" />
      <path
        d="M10 22c-1.6-4 0-9 4-11.6 2.6-1.7 5.7-1.9 8-.9-2.4.4-4.5 1.7-5.8 3.7-1.8 2.7-2 6.1-.6 9"
        stroke="#fff"
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteHeader({ user = null }: { user?: CurrentUser | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="brand">
          <BrandLogo />
          <span>prosparrow</span>
        </Link>
        <nav className={`nav-links${menuOpen ? " open" : ""}`}>
          <Link className="nav-link" href="/">
            Kupovina
          </Link>
          <Link className="nav-link" href="/?listingType=rent">
            Izdavanje
          </Link>
          <a className="nav-link" href="#">
            Novogradnja
          </a>
          <Link className="nav-link" href="/postavi-oglas">
            Prodaj / izdaj
          </Link>
        </nav>
        <div className="nav-actions">
          <Link className="nav-link" href="/sacuvano">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12v18l-6-4-6 4V3z" />
            </svg>
            Sačuvano
          </Link>
          {user ? (
            <>
              <Link className="nav-link nav-email" href="/moj-nalog" title={user.email}>
                {user.email}
              </Link>
              <form action={signOutAction}>
                <button type="submit" className="btn btn-secondary">
                  Odjavi se
                </button>
              </form>
            </>
          ) : (
            <Link href="/prijava" className="btn btn-secondary">
              Prijavi se
            </Link>
          )}
          <Link href="/postavi-oglas" className="btn btn-primary">
            Postavi oglas
          </Link>
        </div>
        <button className="nav-menu-btn" aria-label="Meni" onClick={() => setMenuOpen((prev) => !prev)}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export function BrandMark() {
  return <BrandLogo />;
}
