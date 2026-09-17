export type GeocodeResult = { lat: number; lng: number };

// Uses OpenStreetMap's Nominatim (free, no account needed). Usage policy caps
// this at ~1 request/second and requires a descriptive User-Agent — fine for
// MVP volume, not for high-traffic production use (see AD7).
export async function geocodeAddress(query: string): Promise<GeocodeResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "ProSparrow FSBO MVP (contact: ilicnkl@gmail.com)" },
    });
    if (!res.ok) return null;

    const results = (await res.json()) as Array<{ lat: string; lon: string }>;
    const first = results[0];
    if (!first) return null;

    const lat = Number(first.lat);
    const lng = Number(first.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return { lat, lng };
  } catch {
    // Geocoding is best-effort — a failed lookup should never block posting a listing.
    return null;
  }
}
