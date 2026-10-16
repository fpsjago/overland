# Customizing OVERLAND

Every file path below is real and relative to the project root. Nothing here
requires touching build tooling.

---

## 1. Colour

### The token system

All colour lives in CSS custom properties. `src/styles/global.css` defines the
default palette; `src/styles/skins.css` overrides it per skin. Components never
hardcode a hex value — they use Tailwind utilities that resolve to these
variables, so changing one line re-themes the whole site.

Edit `src/styles/global.css`, in the `:root, [data-skin="map"]` block near the
top of the file:

```css
:root,
[data-skin="map"] {
  --bg:            #F5F1E8;   /* page background — parchment */
  --surface:       #EDE6D5;   /* cards, panels, alternating bands */
  --surface-hover: #E5DEC9;
  --primary:       #1F2E1A;   /* forest green — dark panels, body text, buttons */
  --primary-hover: #2D4225;
  --primary-rgb:   31, 46, 26;    /* keep in sync with --primary */
  --accent:        #B84C2B;   /* rust sienna — FILLS: CTAs, rules, badges */
  --accent-hover:  #D05A35;
  --accent-rgb:    184, 76, 43;   /* keep in sync with --accent */
  --accent-ink:    #9E3F22;   /* accent used as TEXT on light grounds */
  --accent-on-dark:#E5946E;   /* accent used as TEXT on dark panels */
  --panel:         #1F2E1A;   /* dark bands: page headers, footer, rail */
  --text:          #1F2E1A;
  --text-muted:    #6B6255;
  --border:        rgba(31, 46, 26, 0.12);
  --muted-bg:      #EAE3D0;
}
```

**The `--*-rgb` triplets must be updated whenever you change the matching
colour.** They feed `rgba(var(--accent-rgb), 0.18)` expressions used by shadows,
the card hover wash and the cursor CTA state.

**Accessibility: three accent roles, checked per skin.** Every skin ships at
WCAG AA (4.5:1 for text). An accent that works as a button fill is often too
light to be read as small text, so the roles are split:

| Token | Role | Must clear 4.5:1 against |
|---|---|---|
| `--accent` | fills (buttons, rules, badges) | the light text on top of it (`#F5F1E8`) |
| `--accent-ink` | text and focus rings on light grounds | `--bg` **and** `--surface` |
| `--accent-on-dark` | text on dark bands | `--panel` |

Use `text-accent-ink` for accent-coloured text, never `text-accent`. Any element
with `bg-panel`, or marked `on-dark` (photo plates under a dark scrim), swaps
`--accent-ink` for `--accent-on-dark` automatically, so the same class reads on
both. `--panel` is separate from `--primary` because in **Night Camp**
`--primary` turns light (it is the text colour there) while bands must stay
dark. Check a new colour with any WCAG contrast checker before shipping.

### Where the tokens become Tailwind classes

Immediately below the palette, `global.css` maps them into Tailwind v4:

```css
@theme inline {
  --color-canvas:   var(--bg);        /* bg-canvas   */
  --color-surface:  var(--surface);   /* bg-surface  */
  --color-primary:  var(--primary);   /* bg-primary, text-primary */
  --color-accent:   var(--accent);    /* bg-accent (fills) */
  --color-accent-ink: var(--accent-ink); /* text-accent-ink */
  --color-panel:    var(--panel);     /* bg-panel (dark bands) */
  --color-ink:      var(--text);      /* text-ink    */
  --color-muted:    var(--text-muted);/* text-muted  */
  --color-hairline: var(--border);    /* border-hairline */
}

@theme {
  --color-cream:     #E8DFC8;   /* text-cream, text-cream/60 … */
  --color-parchment: #F5F1E8;   /* text-parchment, bg-parchment/92 … */
}
```

`@theme inline` keeps the `var()` reference intact, which is what lets the skin
switcher re-theme utilities at runtime. `cream` and `parchment` are deliberately
*fixed* — they are light tones that sit on the dark forest panels and must not
flip with the skin.

> **Naming caution.** Do not add a token called `--color-text` or `--color-bg`.
> Tailwind would then claim the class names `bg-text` / `text-bg` and silently
> repaint elements that use those words as custom classes.

### The three skins

`src/styles/skins.css` holds the alternates, each a `[data-skin="…"]` block:

| Skin | Selector | Background | Primary | Accent |
|---|---|---|---|---|
| The Map (default) | `[data-skin="map"]` | `#F5F1E8` | `#1F2E1A` | `#B84C2B` |
| Night Camp | `[data-skin="night"]` | `#0F1A0B` | `#E8DFC8` | `#E06B2A` |
| Arctic | `[data-skin="arctic"]` | `#F8FAFB` | `#1C2B3A` | `#2E8BB8` |

Each block also tunes `--shadow-*`, `--grain-blend`, `--grain-opacity` and
`--grid-color`, plus a handful of skin-specific rules for `.nav.scrolled`,
`.btn-primary`, `.glass` and `::selection`.

**To ship with one fixed skin**, set it in `src/layouts/BaseLayout.astro` — the
`skin` prop defaults to `'map'`:

```astro
const { title, description, image, skin = 'map' } = Astro.props;
```

**How the switcher remembers a choice.** A small inline script at the top of
`<head>` in `src/layouts/BaseLayout.astro` sets `data-skin` before the first
paint (no flash): first from a `?skin=night` / `?skin=arctic` / `?skin=map`
query parameter (handy for demo links), then from `localStorage`
(`overland:skin`). An `astro:after-swap` listener re-applies it after every
page change.

**To remove the skin switcher** (it is a demo tool, not a site feature), delete
the `<div id="skin-switcher">` block near the bottom of
`src/layouts/BaseLayout.astro`'s `<body>`, the `<script is:inline>` labelled
`SKIN SWITCHER` further down the same file, and the skin script at the top of
`<head>`.

---

## 2. Typography

### Swapping the fonts

Two places, both required.

**a. Load the font** — fonts are self-hosted, so first paint never waits on a
third-party server. The `@font-face` rules sit at the top of
`src/styles/global.css`. To swap a face, drop in its woff2 file(s) and change
the `src:` URL and `font-family` name in those rules. Google Fonts' CSS API
lists the woff2 URLs per subset if you need other languages.

**Static weights ship by default.** `src/assets/fonts/` holds one small file per
weight the template actually uses (latin subset, 13–23 KB each):

| Face | Weights |
|---|---|
| Archivo | 400, 600, 700, 900, and 900 italic |
| Lora | 400, 700, and 400 italic |

A weight that has no file (say `font-medium` 500) is drawn with the nearest
shipped weight, so **if you start using a new weight, add a face for it** or
switch to the variable files.

**Want every weight? Swap back to the variable fonts.** The original variable
files (any weight from 100 to 900 for Archivo, 400 to 700 for Lora) are kept in
`src/assets/fonts/variable/`. They are not shipped unless referenced. To use
them:

1. In `src/styles/global.css`, replace the eight static `@font-face` rules with
   four, one per file, each declaring the full range:
   ```css
   @font-face {
     font-family: 'Archivo';
     font-style: normal;          /* italic for archivo-italic-latin */
     font-weight: 100 900;        /* 400 700 for the Lora files */
     font-display: swap;
     src: url('../assets/fonts/variable/archivo-latin.woff2') format('woff2');
     unicode-range: /* keep the same latin range */;
   }
   ```
   Do the same for `archivo-italic-latin`, `lora-latin` (`font-weight: 400 700`)
   and `lora-italic-latin`.
2. In `src/layouts/BaseLayout.astro`, point the preload at the variable italic:
   ```astro
   import archivoItalic from '../assets/fonts/variable/archivo-italic-latin.woff2?url';
   ```
3. Optionally delete the static files.

The trade-off, measured on this template: the variable set is four files
(about 153 KB) instead of eight (about 137 KB), and the preloaded wordmark font
is 39 KB instead of 15 KB. Mobile Lighthouse scores came out within a point of
each other either way.

To cut a new static weight from a variable file yourself, use fontTools
(`pip install fonttools brotli`); a woff2 input gives a woff2 output:

```bash
fonttools varLib.instancer src/assets/fonts/variable/archivo-latin.woff2 wght=500 \
  -o src/assets/fonts/archivo-500-latin.woff2
```

Then add an `@font-face` rule for it with `font-weight: 500`.

`src/layouts/BaseLayout.astro` preloads one file: the display italic that draws
the hero wordmark (the largest text on the first screen). Point that import at
your new display file:

```astro
import archivoItalic from '../assets/fonts/archivo-900-italic-latin.woff2?url';
```

Below the web fonts, an `Archivo Fallback` face maps to Arial Black / Arial with
a `size-adjust`, so swapping in the web font does not shift headings. If you
change the display face, re-tune that percentage (or delete the fallback rules
and remove `'Archivo Fallback'` from `--font-heading`).

The display face needs an italic axis: the wordmark, every section heading and
the `.wordmark` class are set in **italic 900**. A font without a true italic
will be synthetically slanted and look wrong.

**b. Point the tokens at it** — `src/styles/global.css`, two blocks that must
agree:

```css
@theme {
  --font-heading: 'Archivo', 'Archivo Fallback', system-ui, sans-serif;
  --font-body:    'Lora', Georgia, serif;
  --font-mono:    'Courier New', 'Courier', monospace;
}

:root, [data-skin="map"] {
  --font-heading: 'Archivo', 'Archivo Fallback', system-ui, sans-serif;
  --font-body:    'Lora', Georgia, serif;
  --font-mono:    'Courier New', 'Courier', monospace;
}
```

`--font-mono` drives the `.coords` GPS strips.

### Sizes

`global.css` defines a fluid scale (`--text-xs` … `--text-9xl`), each a `clamp()`
that interpolates between a mobile and a desktop size. `h1`–`h6` are wired to it
in the `@layer base` block. Change the scale in one place and every heading
follows.

---

## 3. Content

All copy that repeats across pages lives in typed collections under
`src/content/`. The Zod schemas are in `src/content/config.ts` — add a field
there first, or the build will reject it.

| What | Where | Format |
|---|---|---|
| Destinations | `src/content/destinations/*.json` | 10 files; filename = URL slug |
| Journeys / expeditions | `src/content/journeys/*.json` | 5 files; filename = URL slug |
| Guides | `src/content/guides/*.json` | 4 files |
| Field reports (blog) | `src/content/blog/*.md` | 5 files; frontmatter + Markdown body |

A destination entry looks like this (`src/content/destinations/patagonia.json`):

```json
{
  "name": "Patagonia",
  "region": "…",
  "country": "Chile / Argentina",
  "coordinates": { "lat": -50.9423, "lng": -73.4068 },
  "difficulty": "challenging",
  "terrain": ["…"],
  "season": "…",
  "highlights": ["…"],
  "heroImage": "_assets/dest-patagonia.jpg",
  "gallery": ["_assets/journey-patagonia.jpg"]
}
```

`difficulty` is an enum — only `moderate`, `challenging` or `extreme` will pass
validation.

**After a schema change, delete the cache:** `rm -rf .astro && npm run dev`.
Astro serves stale collection data otherwise, and the error it prints will blame
something unrelated.

### Copy that is not in a collection

These strings are inline in components, by design — they are structural, not
editorial:

| Copy | File |
|---|---|
| Nav links, mobile drawer, `OVERLAND™ — EST. 2024` | `src/components/Nav.tsx` |
| Footer columns, tagline, coordinates, © line | `src/components/Footer.tsx` |
| The four process steps | `src/components/HowWeJourney.tsx` |
| Five client testimonials | `src/components/Testimonials.tsx` |
| Three counter statistics | `src/components/StatsBar.tsx` |
| Twelve partner brand names | `src/components/PartnersMarquee.tsx` |
| Final CTA headline and buttons | `src/components/ExpeditionCTA.tsx` |
| FAQ questions and answers | `src/pages/faq.astro` |
| Contact panel details and form fields | `src/pages/contact.astro` |

> `PartnersMarquee.tsx` ships with real outdoor brand names as demo content.
> **Replace them with your own partners before launch** — you may not imply an
> endorsement you do not have.

### Ordering

Listings are sorted explicitly with `byId()` (`src/lib/utils.ts`), which sorts
alphabetically by filename. The homepage features the first six destinations and
first three journeys of that order. To curate the order instead, add an `order`
number to the schema and the JSON files, then change `byId` — or sort at the
call site in `src/pages/index.astro`.

---

## 4. Images

Photographs live in `src/assets/images/`. At build time Astro resizes each one
into WebP (and AVIF for the hero) at the widths a slot needs, so a 3 MB camera
JPEG becomes a few lean files. They are referenced by filename, so **the
simplest swap is to overwrite a file, keeping its name.**

| Filename pattern | Used by |
|---|---|
| `panoramic-hero.jpg` | homepage scrub hero, 4:1, ideally 6000×1500 (it renders at 400% of the viewport width) |
| `dest-<slug>.jpg` | destination cards, rail and hero |
| `journey-<region>.jpg` | journey listings and detail heroes |
| `guide-1…4.jpg` | guide portraits |
| `avatar-1…5.jpg` | testimonial avatars |
| `blog-1…5.jpg` | field-report heroes |
| `about-hero.jpg`, `bg-campfire.jpg` | about page, CTA plate |

Two files stay in `public/_assets/` because they need a fixed URL:
`og-image.jpg` (the default social card) and `bg-texture.jpg` (unused).

**How it works.** Content files keep short strings such as
`"heroImage": "_assets/dest-alaska.jpg"` (relative, no leading slash). Pages
pass that string to `responsiveImage()` from `src/lib/images.ts`, which finds
the file by name in `src/assets/images/` and returns `{ src, srcset, width,
height }` for an `<img>`:

```astro
---
import { responsiveImage } from '../lib/images';
const hero = await responsiveImage(entry.data.heroImage, [640, 1024, 1600]);
---
<img src={hero.src} srcset={hero.srcset} sizes="100vw"
     width={hero.width} height={hero.height} alt="…" />
```

React components never call it themselves (it runs at build time): the page
computes the images and passes them down as props, typed as `ResponsiveImage`
from `src/types`. If a content file names an image that does not exist, the
build fails and tells you the file name. `socialImage()` makes the 1200px JPEG
used for `og:image` on detail pages.

---

## 5. Site metadata and SEO

`src/layouts/BaseLayout.astro` owns `<title>`, description, canonical URL, Open
Graph, Twitter card and a `TravelAgency` JSON-LD block. Update the JSON-LD —
`name`, `url`, `foundingDate`, `slogan` and the contact email are hardcoded
there. Also update `site` in `astro.config.mjs`, and the sitemap URL in
`public/robots.txt`.

The demo email is `book@example.com` (a reserved domain that reaches no one).
Replace it in two places: the JSON-LD above and the contact details list at the
top of `src/pages/contact.astro`.

### Contact form

As shipped, the booking form on `/contact/` is an honest demo: it validates,
then says "Demo form: nothing was sent." To make it send, give it an endpoint at
build time. Copy `.env.example` to `.env` and set:

```bash
# Formspree
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx

# or Web3Forms (also needs the key)
PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit
PUBLIC_FORM_ACCESS_KEY=your-access-key
```

Rebuild, and the form POSTs its fields there (`Accept: application/json`) and
shows sending, sent and failed states. On a host's build settings (Netlify,
Vercel, GitHub Actions), add the same variables there instead of a `.env` file.
Both values end up in the page, so they must not be secrets; Formspree and
Web3Forms keys are designed to be public. Any endpoint that accepts a
multipart form POST and answers 2xx works the same way.

---

## 6. Motion

- **Global smooth scroll and ScrollTrigger lifecycle** — the `<script>` at the
  bottom of `src/layouts/BaseLayout.astro`. Lenis and GSAP are downloaded on the
  visitor's first interaction (or after 3 s idle), so they never delay the first
  paint, and not at all under reduced motion. Lenis is re-initialised on every
  page change; remove that script to drop smooth scrolling entirely.
- **Panoramic hero scrub** — the inline script in `src/pages/index.astro`.
  The wrapper is `h-[220vh]` with a `sticky` inner; shorten the wrapper for a
  faster pan. The hero's entrance (wordmark settle, compass swing, lines
  rising) is pure CSS: `.hero-wordmark`, `.hero-rise`, `.hero-compass` in
  `global.css`.
- **Pinned horizontal rail** — `src/components/DestinationsTeaser.tsx`. It pins
  only on desktop with a mouse (`PIN_QUERY` at the top of the file); on touch,
  narrow screens and reduced motion it is a native swipe rail.
- **Card hovers** — `.trail-card` in `global.css` (photo push-in, title rule,
  "View route" cue). Keyboard focus gets the same treatment.
- **Scroll reveals** — add `data-reveal`, `data-reveal="fade" | "slide-left" |
  "slide-right" | "scale"`, or `data-reveal-stagger` to any element. Rules are in
  the `@layer utilities` block of `global.css`.
- **Custom cursor** — `src/components/Cursor.tsx`; add `data-cursor="photo"` or
  `data-cursor="cta"` to any element to change the ring state. It hides itself on
  coarse pointers.
- **Reduced motion** — a `@media (prefers-reduced-motion: reduce)` block at the
  end of `global.css` neutralises every transition, reveal and the GSAP card
  entrance. Test with it on before shipping.

---

## 7. Adding a page

1. Create `src/pages/your-page.astro`.
2. Import the layout and the base helper:
   ```astro
   ---
   import BaseLayout from '../layouts/BaseLayout.astro';
   import { base } from '../lib/utils';
   ---
   <BaseLayout title="Your page — OVERLAND" description="…">
     <!-- content -->
   </BaseLayout>
   ```
3. Add it to the nav in `src/components/Nav.tsx` and/or the footer columns in
   `src/components/Footer.tsx`.
4. Link to it with ``href={`${base}your-page/`}`` — including the trailing slash.
