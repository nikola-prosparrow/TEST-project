import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/MobileTabBar";
import { ListingCard } from "@/components/ListingCard";
import { OfferActions } from "@/components/OfferActions";
import { getCurrentUser } from "@/lib/auth";
import { getListingsRepository } from "@/lib/listings";
import { getMessagesRepository } from "@/lib/messages";
import { getOffersRepository } from "@/lib/offers";
import { getFavoriteIdsAction } from "@/app/actions/favorites";
import type { OfferStatus } from "@/lib/offers/types";

export const metadata: Metadata = { title: "Moj nalog | ProSparrow" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("sr-RS", { day: "numeric", month: "short", year: "numeric" });
}

const OFFER_STATUS_LABEL: Record<OfferStatus, string> = {
  pending: "Na čekanju",
  accepted: "Prihvaćena",
  rejected: "Odbijena",
  withdrawn: "Povučena",
};

export default async function MyAccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect(`/prijava?next=${encodeURIComponent("/moj-nalog")}`);

  const listingsRepo = await getListingsRepository();
  const messagesRepo = await getMessagesRepository();
  const offersRepo = await getOffersRepository();
  const [myListings, myMessages, receivedOffers, sentOffers, favoriteIds] = await Promise.all([
    listingsRepo.listByOwner(user.id),
    messagesRepo.listByOwner(user.id),
    offersRepo.listByOwner(user.id),
    offersRepo.listByBidder(user.id),
    getFavoriteIdsAction(),
  ]);
  const favoriteIdSet = new Set(favoriteIds);
  const listingTitleById = new Map(myListings.map((l) => [l.id, l.title]));

  const sentOfferListingIds = [...new Set(sentOffers.map((o) => o.listingId))];
  const sentOfferListings = await Promise.all(sentOfferListingIds.map((id) => listingsRepo.getById(id)));
  const sentOfferListingTitleById = new Map(
    sentOfferListings.filter((l) => l !== null).map((l) => [l.id, l.title]),
  );

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
          <h2>Ponude na moje oglase</h2>
          <span className="section-link">
            {receivedOffers.length} {receivedOffers.length === 1 ? "ponuda" : "ponude"}
          </span>
        </div>
        {receivedOffers.length > 0 ? (
          <div className="message-list">
            {receivedOffers.map((offer) => (
              <div key={offer.id} className="offer-card">
                <div className="offer-card-top">
                  <span className="offer-amount">
                    {new Intl.NumberFormat("sr-RS").format(offer.amount)} {offer.currency}
                  </span>
                  <span className={`offer-status offer-status-${offer.status}`}>
                    {OFFER_STATUS_LABEL[offer.status]}
                  </span>
                </div>
                <div className="offer-from">
                  {offer.bidderName} · {offer.bidderEmail} · {formatDate(offer.createdAt)}
                </div>
                <Link href={`/listing/${offer.listingId}`} className="offer-listing">
                  {listingTitleById.get(offer.listingId) ?? "Oglas"}
                </Link>
                {offer.message && <p className="offer-message">{offer.message}</p>}
                {offer.status === "pending" && <OfferActions offerId={offer.id} />}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Još nema ponuda na tvoje oglase.</p>
        )}
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2>Moje ponude</h2>
          <span className="section-link">
            {sentOffers.length} {sentOffers.length === 1 ? "ponuda" : "ponude"}
          </span>
        </div>
        {sentOffers.length > 0 ? (
          <div className="message-list">
            {sentOffers.map((offer) => (
              <div key={offer.id} className="offer-card">
                <div className="offer-card-top">
                  <span className="offer-amount">
                    {new Intl.NumberFormat("sr-RS").format(offer.amount)} {offer.currency}
                  </span>
                  <span className={`offer-status offer-status-${offer.status}`}>
                    {OFFER_STATUS_LABEL[offer.status]}
                  </span>
                </div>
                <Link href={`/listing/${offer.listingId}`} className="offer-listing">
                  {sentOfferListingTitleById.get(offer.listingId) ?? "Oglas"}
                </Link>
                {offer.message && <p className="offer-message">{offer.message}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Još nisi podneo/la nijednu ponudu.</p>
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
