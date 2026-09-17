import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/MobileTabBar";
import { ListingCard } from "@/components/ListingCard";
import { getCurrentUser } from "@/lib/auth";
import { getListingsRepository } from "@/lib/listings";
import { getFavoriteIdsAction } from "@/app/actions/favorites";

export const metadata: Metadata = { title: "Sačuvano | ProSparrow" };

export default async function SavedListingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect(`/prijava?next=${encodeURIComponent("/sacuvano")}`);

  const [favoriteIds, repo] = await Promise.all([getFavoriteIdsAction(), getListingsRepository()]);
  const listings = (await Promise.all(favoriteIds.map((id) => repo.getById(id)))).filter(
    (listing): listing is NonNullable<typeof listing> => listing !== null,
  );

  return (
    <div>
      <SiteHeader user={user} />

      <section className="wrap section">
        <div className="section-head">
          <h2>Sačuvano</h2>
          <span className="section-link">
            {listings.length} {listings.length === 1 ? "oglas" : "oglasa"}
          </span>
        </div>
        {listings.length > 0 ? (
          <div className="listing-grid">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} initialFav />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">
            Još nema sačuvanih oglasa — klikni srce na kartici oglasa da ga sačuvaš.
          </p>
        )}
      </section>

      <SiteFooter />
      <MobileTabBar initialActive="saved" />
    </div>
  );
}
