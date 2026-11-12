# Getting started with OVERLAND

OVERLAND is a free Astro template for adventure and expedition travel. It is built with Astro 7, React 19 islands, Tailwind CSS 4, GSAP and Lenis.

## Requirements

- Node.js 22.12 or newer (we build with Node 24).
- npm (a `package-lock.json` is included).

## Install, run, build

```bash
npm ci            # install the exact versions from package-lock.json
npm run dev       # dev server at http://localhost:4321/overland/
npm run build     # static site in dist/
npm run preview   # serve dist/ locally
```

## Deploy

The site is fully static: upload `dist/` anywhere.

First, open `astro.config.mjs` and set `site` to your domain. `base` is `/overland` because the demo lives in a GitHub Pages sub-folder. If your site sits at the root of a domain, delete the `base` line. All links and images are built from `import.meta.env.BASE_URL`, so nothing else needs to change.

- **GitHub Pages:** push to `main`. `.github/workflows/deploy.yml` builds and publishes the site. In the repo, go to Settings → Pages → Source and choose "GitHub Actions".
- **Netlify:** build command `npm run build`, publish directory `dist`.
- **Vercel:** framework preset "Astro". The defaults work as they are.

## Where the content lives

| What | Where |
| --- | --- |
| Destinations | `src/content/destinations/*.json` |
| Journeys (itinerary, price, gear) | `src/content/journeys/*.json` |
| Guides | `src/content/guides/*.json` |
| Field reports (blog) | `src/content/blog/*.md` |
| Collection schemas | `src/content.config.ts` |
| Pages / sections | `src/pages/`, `src/components/*.tsx` |
| Images | `src/assets/images/` (optimised at build time) |

A file's name is its URL slug: `src/content/journeys/patagonia-circuit.json` becomes `/journeys/patagonia-circuit/`.

The stat band (`src/components/StatsBar.tsx`), the testimonials (`src/components/Testimonials.tsx`) and the partner names (`src/components/PartnersMarquee.tsx`) are **demo content**. Replace them with your own before you publish.

## Colours and fonts

- **Skins:** three palettes ship in `src/styles/skins.css`: `map` (default), `night` and `arctic`. The default is the `skin` prop in `src/layouts/BaseLayout.astro`. Visitors can switch skins with the "Skin" button, and their choice is saved in `localStorage`. To restyle a skin, edit its custom properties (`--bg`, `--surface`, `--primary`, `--accent`, ...).
- **Fonts:** Archivo (headings) and Lora (body), both under the SIL Open Font License, are self-hosted from `src/assets/fonts/` through the `@font-face` rules at the top of `src/styles/global.css`. To swap them, replace the `.woff2` files and update those rules plus `--font-heading` / `--font-body`.
