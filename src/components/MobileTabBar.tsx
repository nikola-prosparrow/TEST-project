"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TABS = [
  {
    key: "home",
    label: "Početna",
    path: (
      <>
        <path d="M4 11.5 12 4l8 7.5" />
        <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" />
      </>
    ),
  },
  {
    key: "search",
    label: "Pretraga",
    path: (
      <>
        <circle cx={11} cy={11} r={7} />
        <line x1={21} y1={21} x2={16.5} y2={16.5} />
      </>
    ),
  },
  {
    key: "saved",
    label: "Sačuvano",
    path: <path d="M6 3h12v18l-6-4-6 4V3z" />,
  },
  {
    key: "msg",
    label: "Poruke",
    path: <path d="M4 5h16v11H8l-4 4V5z" />,
  },
  {
    key: "profile",
    label: "Profil",
    path: (
      <>
        <circle cx={12} cy={8} r={3.4} />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </>
    ),
  },
];

export function MobileTabBar({ initialActive = "home" }: { initialActive?: string }) {
  const [active, setActive] = useState(initialActive);
  const router = useRouter();

  return (
    <nav className="mobile-tabbar">
      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`mobile-tab${active === tab.key ? " active" : ""}`}
            onClick={() => {
              setActive(tab.key);
              if (tab.key === "home") router.push("/");
            }}
          >
            <svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              {tab.path}
            </svg>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
