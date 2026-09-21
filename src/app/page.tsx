import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/MobileTabBar";
import { ListingCard } from "@/components/ListingCard";
import { getListingsRepository } from "@/lib/listings";
import { getCurrentUser } from "@/lib/auth";
import { getFavoriteIdsAction } from "@/app/actions/favorites";
import type { ListingType, PropertyType } from "@/lib/listings/types";
import { PROPERTY_TYPE_LABELS, PROPERTY_TYPE_CHIP_LABELS } from "@/lib/listings/labels";
import { buildSearchHref, type SearchParamsRecord } from "@/lib/searchHref";

const PROPERTY_TYPES = Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[];

const CITIES = [
  { name: "Beograd", gradient: "linear-gradient(135deg, #F2884A, #D6417F)" },
  { name: "Novi Sad", gradient: "linear-gradient(135deg, #D6417F, #7A3596)" },
  { name: "Niš", gradient: "linear-gradient(135deg, #F2884A, #7A3596)" },
  { name: "Subotica", gradient: "linear-gradient(135deg, #7A3596, #D6417F)" },
];

function isPropertyType(value: string | undefined): value is PropertyType {
  return !!value && (PROPERTY_TYPES as string[]).includes(value);
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;
  const get = (key: string) => {
    const value = rawParams[key];
    return typeof value === "string" && value ? value : undefined;
  };

  const listingTypeParam = get("listingType");
  const listingType: ListingType | undefined =
    listingTypeParam === "rent" ? "rent" : listingTypeParam === "sale" ? "sale" : undefined;
  const city = get("city");
  const propertyType = isPropertyType(get("propertyType")) ? (get("propertyType") as PropertyType) : undefined;
  const maxPriceRaw = get("maxPrice");
  const maxPrice = maxPriceRaw && !Number.isNaN(Number(maxPriceRaw)) ? Number(maxPriceRaw) : undefined;

  const current: SearchParamsRecord = {
    listingType,
    city,
    propertyType,
    maxPrice: maxPriceRaw,
  };

  const repo = await getListingsRepository();
  const [listings, user, favoriteIds] = await Promise.all([
    repo.list({ listingType, city, propertyType, maxPrice }),
    getCurrentUser(),
    getFavoriteIdsAction(),
  ]);
  const favoriteIdSet = new Set(favoriteIds);

  return (
    <div>
      <SiteHeader user={user} />

      <section className="hero">
        <div className="hero-glow" />
        <div className="wrap hero-inner">
          <div className="badge-pill">
            <span className="badge-dot" />
            Kupovina · Izdavanje · Novogradnja
          </div>
          <h1>
            Nekretnine bez <em>posrednika</em>.
          </h1>
          <p className="lead">
            Kupuj i prodaj direktno od vlasnika. Bez provizije agenciji. Bez skrivenih troškova.
            Samo oglas, kontakt i dogovor.
          </p>

          <form className="search-card" method="GET" action="/">
            <div className="search-tabs">
              <Link
                href={buildSearchHref(current, { listingType: "sale" })}
                className={`tab-btn${listingType === "sale" ? " active" : ""}`}
              >
                Kupovina
              </Link>
              <Link
                href={buildSearchHref(current, { listingType: "rent" })}
                className={`tab-btn${listingType === "rent" ? " active" : ""}`}
              >
                Izdavanje
              </Link>
            </div>
            <input type="hidden" name="listingType" value={listingType} />
            <div className="search-row">
              <div className="search-field">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6E6E73" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
                  <circle cx={12} cy={9} r={2.4} />
                </svg>
                <input type="text" name="city" placeholder="Grad, opština ili naselje" defaultValue={city ?? ""} />
              </div>
              <div className="search-divider" />
              <div className="search-field">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6E6E73" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 11.5 12 4l8 7.5" />
                  <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" />
                </svg>
                <select name="propertyType" defaultValue={propertyType ?? ""}>
                  <option value="">Tip nekretnine</option>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {PROPERTY_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="search-divider" />
              <div className="search-field">
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Cena do (€)"
                  min={0}
                  defaultValue={maxPriceRaw ?? ""}
                />
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
            <Link href="/postavi-oglas" className="btn btn-primary">
              Postavi oglas
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
            <button className="btn btn-secondary">Kako radimo</button>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="chips-row">
          <Link
            href={buildSearchHref(current, { propertyType: undefined })}
            className={`chip${!propertyType ? " active" : ""}`}
          >
            Sve
          </Link>
          {PROPERTY_TYPES.map((type) => (
            <Link
              key={type}
              href={buildSearchHref(current, { propertyType: type })}
              className={`chip${propertyType === type ? " active" : ""}`}
            >
              {PROPERTY_TYPE_CHIP_LABELS[type]}
            </Link>
          ))}
        </div>
      </div>

      <section className="wrap section">
        <div className="section-head">
          <h2>{city || propertyType || maxPrice ? "Rezultati pretrage" : "Izdvojeno za tebe"}</h2>
          <span className="section-link">{listings.length} {listings.length === 1 ? "oglas" : "oglasa"}</span>
        </div>
        {listings.length > 0 ? (
          <div className="listing-grid">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} initialFav={favoriteIdSet.has(listing.id)} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Nema oglasa koji odgovaraju pretrazi. Probaj druge filtere.</p>
        )}
      </section>

      <section className="city-section">
        <div className="wrap">
          <div className="section-head" style={{ marginBottom: 22 }}>
            <h2>Pretraži po gradu</h2>
          </div>
          <div className="city-grid">
            {CITIES.map((cityOption) => (
              <Link
                key={cityOption.name}
                className="city-card"
                href={buildSearchHref(current, { city: cityOption.name })}
                style={{ background: cityOption.gradient }}
              >
                <div className="overlay" />
                <div className="label">
                  <strong>{cityOption.name}</strong>
                </div>
              </Link>
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
            <Link href="/postavi-oglas" className="btn" style={{ background: "#fff", color: "#1D1D1F" }}>
              Postavi oglas
            </Link>
            <button className="btn btn-ghost">Saznaj više</button>
          </div>
        </div>
      </section>

      <SiteFooter />
      <MobileTabBar initialActive="home" />
    </div>
  );
}
