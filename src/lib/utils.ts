/* OVERLAND — Shared Utilities
   ============================================================ */

/**
 * Base URL with guaranteed trailing slash.
 * Always use this for internal links and asset paths.
 * Never hardcode '/' — breaks GitHub Pages deployment.
 *
 * @example
 * <a href={`${base}journeys/`}>All Journeys</a>
 * <img src={`${base}images/hero.webp`} />
 */
export const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/**
 * Format a Date object as a readable string.
 * @example formatDate(new Date('2025-03-15')) → 'March 15, 2025'
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a price number as USD currency string.
 * @example formatPrice(2950) → '$2,950'
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format GPS coordinates to a display string.
 * @example formatCoords(47.5596, -121.8001) → '47.5596°N 121.8001°W'
 */
export function formatCoords(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir} ${Math.abs(lng).toFixed(4)}°${lngDir}`;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Slugify a string for URL use.
 * @example slugify('Torres del Paine') → 'torres-del-paine'
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Deterministic ordering for a content collection.
 *
 * `getCollection()` returns entries in filesystem order, which on most
 * systems follows modification time — so editing a single JSON file
 * silently reshuffles every listing, and changes which entries land in
 * the homepage's `slice(0, n)`. Always sort explicitly.
 *
 * Swap the comparison for a curated `order` field in the schema if you
 * want an editorial sequence rather than an alphabetical one.
 *
 * @example
 * const destinations = byId(await getCollection('destinations'));
 */
export function byId<T extends { id: string }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => a.id.localeCompare(b.id));
}
