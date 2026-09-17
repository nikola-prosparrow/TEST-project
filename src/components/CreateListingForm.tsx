"use client";

import { useActionState } from "react";
import { createListingAction, type CreateListingActionState } from "@/app/actions/listings";
import { PROPERTY_TYPE_LABELS } from "@/lib/listings/labels";
import type { PropertyType } from "@/lib/listings/types";

const INITIAL_STATE: CreateListingActionState = { error: null };
const PROPERTY_TYPES = Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[];

export function CreateListingForm() {
  const [state, formAction, pending] = useActionState(createListingAction, INITIAL_STATE);

  return (
    <div className="auth-wrap">
      <div className="auth-card wide">
        <h1>Postavi oglas</h1>
        <p className="sub">Direktno od vlasnika do kupca — bez agencije, bez provizije.</p>

        {state.error && <div className="auth-error">{state.error}</div>}

        <form action={formAction}>
          <div className="form-field-block">
            <label htmlFor="title">Naslov oglasa</label>
            <input id="title" name="title" type="text" required minLength={5} placeholder="npr. Svetao dvosoban stan sa terasom" />
          </div>

          <div className="form-grid">
            <div className="form-field-block">
              <label htmlFor="listingType">Tip oglasa</label>
              <select id="listingType" name="listingType" required defaultValue="sale">
                <option value="sale">Prodaja</option>
                <option value="rent">Izdavanje</option>
              </select>
            </div>
            <div className="form-field-block">
              <label htmlFor="propertyType">Tip nekretnine</label>
              <select id="propertyType" name="propertyType" required defaultValue="">
                <option value="" disabled>
                  Izaberi tip
                </option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {PROPERTY_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field-block">
              <label htmlFor="city">Grad</label>
              <input id="city" name="city" type="text" required placeholder="npr. Beograd" />
            </div>
            <div className="form-field-block">
              <label htmlFor="address">Adresa</label>
              <input id="address" name="address" type="text" required placeholder="Ulica i broj, naselje" />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field-block">
              <label htmlFor="price">Cena (€)</label>
              <input id="price" name="price" type="number" required min={1} step="1" />
            </div>
            <div className="form-field-block">
              <label htmlFor="areaSqm">Površina (m²)</label>
              <input id="areaSqm" name="areaSqm" type="number" required min={1} step="0.1" />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field-block">
              <label htmlFor="rooms">Broj soba</label>
              <input id="rooms" name="rooms" type="number" required min={0} step="1" />
            </div>
            <div className="form-field-block">
              <label htmlFor="bathrooms">Broj kupatila</label>
              <input id="bathrooms" name="bathrooms" type="number" required min={0} step="1" />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field-block">
              <label htmlFor="floor">Sprat (opciono)</label>
              <input id="floor" name="floor" type="text" placeholder="npr. 3/6" />
            </div>
            <div className="form-field-block">
              <label htmlFor="yearBuilt">Godina gradnje (opciono)</label>
              <input id="yearBuilt" name="yearBuilt" type="text" placeholder="npr. 2018." />
            </div>
          </div>

          <div className="form-field-block">
            <label htmlFor="description">Opis</label>
            <textarea id="description" name="description" required minLength={20} placeholder="Opiši nekretninu — stanje, okolina, šta je izdvaja." />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
            {pending ? "Objavljujem…" : "Objavi oglas"}
          </button>
        </form>
      </div>
    </div>
  );
}
