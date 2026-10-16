/**
 * Placeholder partners. Every name here is fictional, invented for the
 * demo (same count and similar lengths as a real list, so the marquee
 * keeps its rhythm). Put your own partners here, or delete the section if
 * you have none.
 */
const partners = [
  'Scarnwell',
  'Halden Co-op',
  'Northbound Atlas Expeditions',
  'Corriloft',
  'Granite Hollow',
  'Talvik',
  'Ferrow',
  'Rook',
  'Lumek',
  'Drift-a-Loft',
  'Skarre',
  'Orvane',
];

/**
 * Static, CSS-only marquee (`.marquee-track` in global.css). It renders with
 * no client directive: no hydration, no rAF loop. The band uses the page
 * ground (`bg-canvas`) on purpose: contrast checkers cannot resolve the
 * colour under a transform-animated track and fall back to the page
 * background, so the text must be AA against exactly that colour.
 * The duplicate run is aria-hidden so screen readers hear each name once.
 */
export function PartnersMarquee() {
  return (
    <section className="py-16 border-y border-hairline bg-canvas overflow-hidden" aria-labelledby="partners-label">
      <div className="mb-8 text-center">
        <h2 id="partners-label" className="coords text-xs text-muted font-normal tracking-[0.12em]">
          TRUSTED BY / GEAR PARTNERS
        </h2>
      </div>

      <div className="marquee relative overflow-hidden">
        <div className="marquee-track flex w-max items-center">
          {[0, 1].map((run) => (
            <ul
              key={run}
              className="flex shrink-0 items-center gap-16 pr-16 whitespace-nowrap"
              aria-hidden={run === 1 ? true : undefined}
            >
              {partners.map((partner) => (
                <li
                  key={partner}
                  className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-muted transition-colors duration-200 select-none hover:text-ink"
                >
                  {partner}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
