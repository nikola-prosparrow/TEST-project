export type SearchParamsRecord = Record<string, string | undefined>;

export function buildSearchHref(current: SearchParamsRecord, overrides: SearchParamsRecord): string {
  const merged = { ...current, ...overrides };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `/?${query}` : "/";
}
