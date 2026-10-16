interface FooterProps {
  base: string;
}

const navLinks = {
  Explore: [
    { label: 'Destinations', href: 'destinations/' },
    { label: 'Journeys', href: 'journeys/' },
    { label: 'Our Guides', href: 'guides/' },
    { label: 'Field Reports', href: 'blog/' },
  ],
  Company: [
    { label: 'About OVERLAND', href: 'about/' },
    { label: 'Book an Expedition', href: 'contact/' },
    { label: 'FAQ', href: 'faq/' },
  ],
};

export function Footer({ base }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-panel text-parchment border-t border-parchment/10">
      <div className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <p className="wordmark mb-4 text-parchment text-[length:clamp(2.5rem,6vw,4rem)]">
              OVERLAND
            </p>
            <p className="font-body text-parchment/60 text-[length:var(--text-base)] leading-[1.7] max-w-[360px] mb-6">
              We take you to the edges of the known world — and a little beyond. Expedition travel crafted for those who want the real thing.
            </p>
            <p className="coords text-parchment/70">
              51°30′N 0°08′W — EXPEDITION BASE
            </p>
          </div>

          {/* Nav columns */}
          {Object.entries(navLinks).map(([group, links]) => (
            <div key={group}>
              {/* h2, not h3: these are the first headings after the page <h1>,
                  and skipping a level fails the axe `heading-order` rule.
                  Every visual property here is a utility class, so the level
                  change is purely semantic. */}
              <h2 className="font-heading font-bold uppercase tracking-[0.14em] text-parchment/70 text-[length:var(--text-xs)] mb-5">
                {group}
              </h2>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={`${base}${link.href}`}
                      className="font-heading font-semibold text-[length:var(--text-sm)] text-parchment/80 transition-colors duration-200 hover:text-parchment"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom rule */}
        <div className="border-t border-parchment/10 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-heading text-[length:var(--text-xs)] text-parchment/70 tracking-[0.06em]">
            © {year} OVERLAND. All rights reserved.
          </p>
          <p className="font-heading text-[length:var(--text-xs)] text-parchment/70 tracking-[0.06em]">
            Built by{' '}
            <a
              href="https://www.fullstackevolved.com/?utm_source=template&utm_medium=footer&utm_campaign=overland"
              target="_blank"
              rel="noopener"
              className="text-parchment underline decoration-parchment/40 underline-offset-4 transition-colors duration-200 hover:decoration-accent-ink"
            >
              FSEVO
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
