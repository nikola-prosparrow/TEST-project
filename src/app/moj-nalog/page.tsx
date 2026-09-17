import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/MobileTabBar";
import { ListingCard } from "@/components/ListingCard";
import { getCurrentUser } from "@/lib/auth";
import { getListingsRepository } from "@/lib/listings";
import { getMessagesRepository } from "@/lib/messages";
import { getFavoriteIdsAction } from "@/app/actions/favorites";

export const metadata: Metadata = { title: "Moj nalog | ProSparrow" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("sr-RS", { day: "numeric", month: "short", year: "numeric" });
}

export default async function MyAccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect(`/prijava?next=${encodeURIComponent("/moj-nalog")}`);

  const listingsRepo = await getListingsRepository();
  const messagesRepo = await getMessagesRepository();
  const [myListings, myMessages, favoriteIds] = await Promise.all([
    listingsRepo.listByOwner(user.id),
    messagesRepo.listByOwner(user.id),
    getFavoriteIdsAction(),
  ]);
  const favoriteIdSet = new Set(favoriteIds);
  const listingTitleById = new Map(myListings.map((l) => [l.id, l.title]));

  return (
    <div>
      <SiteHeader user={user} />

      <section className="wrap section">
        <div className="section-head">
          <h2>Moji oglasi</h2>
          <Link href="/postavi-oglas" className="section-link">
            + Postavi novi
          </Link>
        </div>
        {myListings.length > 0 ? (
          <div className="listing-grid">
            {myListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} initialFav={favoriteIdSet.has(listing.id)} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Još nisi postavio/la nijedan oglas.</p>
        )}
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2>Primljene poruke</h2>
          <span className="section-link">
            {myMessages.length} {myMessages.length === 1 ? "poruka" : "poruke"}
          </span>
        </div>
        {myMessages.length > 0 ? (
          <div className="message-list">
            {myMessages.map((message) => (
              <div key={message.id} className="message-card">
                <div className="message-card-top">
                  <span className="message-card-from">{message.senderName}</span>
                  <span className="message-card-date">{formatDate(message.createdAt)}</span>
                </div>
                <Link href={`/listing/${message.listingId}`} className="message-card-listing">
                  {listingTitleById.get(message.listingId) ?? "Oglas"}
                </Link>
                <p className="message-card-body">{message.body}</p>
                <div className="message-card-contact">
                  {message.senderEmail}
                  {message.senderPhone ? ` · ${message.senderPhone}` : ""}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Još nema primljenih poruka.</p>
        )}
      </section>

      <SiteFooter />
      <MobileTabBar initialActive="profile" />
    </div>
  );
}
