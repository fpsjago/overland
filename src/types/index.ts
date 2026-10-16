/* OVERLAND — TypeScript Interfaces
   All interfaces live here. Never define types inside components.
   ============================================================ */

// ============================================================
// DESTINATION
// A physical location that OVERLAND operates expeditions to.
// ============================================================
export interface Destination {
  slug: string;
  name: string;
  region: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  difficulty: 'moderate' | 'challenging' | 'extreme';
  terrain: string[];
  season: string;
  highlights: string[];
  heroImage: string;
  gallery: string[];
}

// ============================================================
// JOURNEY
// A packaged expedition product: itinerary, pricing, gear.
// ============================================================
export interface Journey {
  slug: string;
  title: string;
  destination: string;
  durationDays: number;
  price: number;
  difficulty: string;
  heroImage: string;
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  included: string[];
  gear: string[];
}

// ============================================================
// BLOG POST
// Field dispatch — expedition reports, gear reviews, stories.
// ============================================================
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  pubDate: Date;
  heroImage: string;
  tags: string[];
  author: string;
  readTime: string;
}

// ============================================================
// GUIDE
// A certified expedition guide on the OVERLAND team.
// ============================================================
export interface Guide {
  slug: string;
  name: string;
  role: string;
  bio: string;
  expeditions: string[];
  image: string;
  specialties: string[];
}

// ============================================================
// SHARED / UI
// ============================================================
export type Skin = 'map' | 'night' | 'arctic';

export type DifficultyLevel = 'moderate' | 'challenging' | 'extreme';

export interface NavLink {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

/** One card on the home "Where We Go" rail. Only what the card renders,
 *  because island props are serialized into the page HTML. */
export interface RailCard {
  id: string;
  name: string;
  country: string;
  difficulty: DifficultyLevel;
  lat: number;
  lng: number;
  image: ResponsiveImage;
}

/** Output of responsiveImage() in src/lib/images.ts, passed to components as a prop. */
export interface ResponsiveImage {
  /** Fallback URL (largest generated width). */
  src: string;
  /** `srcset` with w descriptors, for use with a matching `sizes`. */
  srcset: string;
  /** Intrinsic size of the source, for width/height attributes (no CLS). */
  width: number;
  height: number;
}
