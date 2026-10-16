/* OVERLAND — Content Collection Schemas
   All Zod schemas for the 4 content collections.
   destinations / journeys / guides → type: 'data' (JSON files)
   blog → Astro 5 `glob()` loader (Markdown files).

   The blog MUST use the loader: the legacy `type: 'content'` API keeps the
   file extension in `entry.id`, which leaked straight into the published
   URLs (/blog/gear-philosophy.md/). `glob()` strips it.
   ============================================================ */

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ============================================================
// DESTINATIONS — JSON data collection
// Physical locations: coordinates, terrain, difficulty
// ============================================================
const destinations = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    region: z.string(),
    country: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    difficulty: z.enum(['moderate', 'challenging', 'extreme']),
    terrain: z.array(z.string()),
    season: z.string(),
    highlights: z.array(z.string()),
    heroImage: z.string(),
    gallery: z.array(z.string()),
  }),
});

// ============================================================
// JOURNEYS — JSON data collection
// Packaged expeditions: itinerary, pricing, gear lists
// ============================================================
const journeys = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    destination: z.string(),
    durationDays: z.number().int().positive(),
    price: z.number().positive(),
    difficulty: z.string(),
    heroImage: z.string(),
    excerpt: z.string().optional(),
    itinerary: z.array(
      z.object({
        day: z.number().int().positive(),
        title: z.string(),
        description: z.string(),
      })
    ),
    included: z.array(z.string()),
    gear: z.array(z.string()),
  }),
});

// ============================================================
// BLOG — Markdown content collection
// Field dispatches: expedition reports, gear reviews, stories
// ============================================================
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.string(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('OVERLAND Editors'),
    readTime: z.union([z.string(), z.number()]).transform(v => typeof v === 'number' ? `${v} min read` : v).default('5 min read'),
    draft: z.boolean().default(false),
  }),
});

// ============================================================
// GUIDES — JSON data collection
// Certified expedition guides: bio, specialties, expeditions
// ============================================================
const guides = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    expeditions: z.array(z.string()),
    image: z.string(),
    specialties: z.array(z.string()),
  }),
});

export const collections = {
  destinations,
  journeys,
  blog,
  guides,
};
