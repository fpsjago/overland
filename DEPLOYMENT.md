# Deploying OVERLAND

OVERLAND is a **fully static** Astro site (`output: 'static'`). `npm run build`
produces a `dist/` folder of plain HTML, CSS, JS and images. Any static host will
serve it — there is no server runtime and no database. The only environment
variables are optional: `PUBLIC_FORM_ENDPOINT` (and `PUBLIC_FORM_ACCESS_KEY` for
Web3Forms) make the contact form send; see `.env.example` and CUSTOMIZATION.md.

---

## The one setting you must get right: `base`

`astro.config.mjs` ships configured for the GitHub Pages demo:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react(), sitemap()],
  output: 'static',
  site: 'https://fpsjago.github.io',
  base: '/overland',          // ← subpath
  compressHTML: true,
  build: { assets: '_assets' },
  vite: { plugins: [tailwindcss()] },
});
```

`base: '/overland'` means every URL is prefixed with `/overland/`. That is
correct **only** when the site is served from a subdirectory — which is what
GitHub Project Pages does.

**Deploying to a domain root (Vercel, Netlify, Cloudflare Pages, your own
server)? You must remove it**, or every link and image 404s:

```js
export default defineConfig({
  integrations: [react(), sitemap()],
  output: 'static',
  site: 'https://your-domain.com',   // ← your canonical origin
  // base removed entirely
  compressHTML: true,
  build: { assets: '_assets' },
  vite: { plugins: [tailwindcss()] },
});
```

Nothing else needs to change. Links are built from the `base` helper in
`src/lib/utils.ts`, which normalises `import.meta.env.BASE_URL` to a value with a
trailing slash — it returns `/` when `base` is absent and `/overland/` when it is
set. Do not hardcode paths and this stays a one-line change.

While you are there, update the sitemap URL in `public/robots.txt` to match your
`site`:

```
Sitemap: https://your-domain.com/sitemap-index.xml
```

`site` is also used for the canonical link tag and the JSON-LD `url` in
`src/layouts/BaseLayout.astro` — set that `url` to your domain too.

---

## Build

```bash
npm ci          # reproducible install from package-lock.json
npm run build   # → dist/
npm run preview # serve dist/ locally to check before you ship
```

Requires **Node 20 or newer**. Build output is 29 HTML pages plus hashed assets
in `dist/_assets/` and a `sitemap-index.xml`.

---

## GitHub Pages

A working workflow ships at `.github/workflows/deploy.yml`. It builds on every
push to `main` and publishes with the official Pages actions:

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write
```

To use it:

1. Repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Set `base` in `astro.config.mjs` to `'/<your-repo-name>'` and `site` to
   `'https://<your-user>.github.io'`.
3. Push to `main`.

If you use a **user/organisation** Pages site (`<user>.github.io`) rather than a
project site, the content is served at the root — delete `base` as described
above.

> GitHub Pages on the free plan only publishes from a **public** repository.

---

## Vercel

No adapter and no configuration file are needed.

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm ci` |
| Node version | 20 or 22 |

Remove `base` from `astro.config.mjs` first, and set `site` to the production
domain. Then either import the repo in the Vercel dashboard, or:

```bash
npx vercel        # preview deployment
npx vercel --prod # production
```

Astro's `output: 'static'` means Vercel serves this from its CDN as static files;
you do not need `@astrojs/vercel`.

---

## Netlify

Remove `base`, set `site`, then commit a `netlify.toml` at the project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

Or set the same two values in **Site configuration → Build & deploy**. Deploy via
the dashboard, or:

```bash
npx netlify-cli deploy --prod --dir=dist
```

---

## Cloudflare Pages

Remove `base`, set `site`, then in the Pages project:

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION = 20` |

---

## Any other static host

Upload the contents of `dist/` to the web root. Two things to check:

- **`404.html`** — the template builds one. Point your host's not-found handler
  at it (Netlify, Vercel, Cloudflare and GitHub Pages all pick it up
  automatically; nginx and Apache need a rule).
- **Trailing slashes** — pages are emitted as `page/index.html` and every
  internal link is written with a trailing slash, so directory-index serving is
  all that is required. No rewrite rules are needed.

---

## Post-deploy checklist

- [ ] Home, `/destinations/`, a destination detail page, `/journeys/`, a journey
      detail page, `/blog/`, a post, `/about/`, `/guides/`, `/contact/`, `/faq/`
      and a deliberate 404 all load.
- [ ] Images render (a broken image almost always means a stale `base`).
- [ ] The canonical tag, OG image and JSON-LD point at the real domain.
- [ ] `robots.txt` and `sitemap-index.xml` resolve, and the sitemap URL inside
      `robots.txt` is correct.
- [ ] The contact form is wired to a real endpoint: set `PUBLIC_FORM_ENDPOINT`
      at build time. **Without it the form is a demo and sends nothing**; it
      says so when submitted.
- [ ] Lighthouse: `npx @lhci/cli autorun` asserts 0.95 on all four categories
      using `.lighthouserc.json`. **Run it after removing `base`** — the config's
      URLs are root-relative (`http://localhost/index.html`), because Lighthouse
      CI serves `dist/` at the web root. With the demo's `base: '/overland'`
      still set, every URL 404s and the run is meaningless.

### Measured on a base-less production build

Desktop preset, `@lhci/cli` 0.14, one run per page:

| Page | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| `/` | 0.97 | 0.96 | 1.00 | 1.00 |
| `/destinations/` | 0.94 | 0.96 | 1.00 | 1.00 |
| `/journeys/` | 0.94 | 0.96 | 1.00 | 1.00 |
| `/about/` | 0.97 | 0.96 | 1.00 | 1.00 |
| `/guides/` | 0.94 | 0.96 | 1.00 | 1.00 |
| `/blog/` | 0.94 | 0.96 | 1.00 | 1.00 |
| `/contact/` | 0.97 | 0.96 | 1.00 | 1.00 |
| `/faq/` | 0.97 | 0.95 | 1.00 | 1.00 |

Accessibility, best practices and SEO clear the gate everywhere. **Performance
sits at 0.94 on the four image-heavy listing pages**, one point under it. The
cause is Speed Index and LCP on the photographs: they are plain JPEGs served
from `public/`, so there is no WebP/AVIF negotiation and no responsive `srcset`.
Moving the images into `src/` and rendering them through Astro's `<Image>` /
`getImage()` pipeline is the fix — see the closing note of `CUSTOMIZATION.md`
§ 4. The shipped photographs are already cropped to their exact slot
dimensions, so the remaining gain has to come from that pipeline change.

Two accessibility items are reported but not fixed, because both are palette
decisions rather than defects in the markup:

- **Nav contrast over dark page headers.** On `/contact/` and `/faq/` the
  unscrolled nav renders dark forest text on a dark forest header — a 1.55:1
  ratio, effectively invisible until you scroll. The nav is designed to be
  transparent over the homepage's photographic hero. A per-page inverted nav
  variant would fix it.
- **Low-emphasis decorative text.** The rust coordinate strips (2.8:1) and the
  `text-cream/35` / `text-parchment/30` micro-labels are deliberately faint and
  fall below 4.5:1.
