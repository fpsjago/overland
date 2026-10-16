import { useEffect, useRef, useState } from 'react';

interface NavProps {
  base: string;
}

const links = [
  { label: 'Destinations', href: 'destinations/' },
  { label: 'Journeys', href: 'journeys/' },
  { label: 'About', href: 'about/' },
  { label: 'Field Reports', href: 'blog/' },
];

export function Nav({ base }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [path, setPath] = useState('');
  const burgerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // No module-level "initialized" guard: <ClientRouter> remounts this island
  // on every navigation, and a module flag would survive the remount and
  // leave the nav without its scroll listener. useEffect cleanup is enough.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const closeMenu = () => setMenuOpen(false);

    setPath(window.location.pathname);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('astro:before-preparation', closeMenu);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('astro:before-preparation', closeMenu);
    };
  }, []);

  // Drawer open: lock page scroll, move focus in, close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      burgerRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const isCurrent = (href: string) => path.startsWith(`${base}${href}`);

  return (
    <>
      <nav
        aria-label="Main"
        className={`nav fixed top-4 left-1/2 -translate-x-1/2 z-[200] rounded-full border backdrop-blur-[18px] transition-[width,padding,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? 'w-[min(92vw,920px)] px-5 py-2.5 bg-canvas/92 border-hairline shadow-[0_8px_32px_-12px_rgba(0,0,0,0.35)]'
            : 'w-[min(94vw,1000px)] px-6 py-3 bg-canvas/88 border-canvas/40 shadow-none'
        }`}
      >
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <a
            href={base}
            className="shrink-0 font-heading font-black italic text-ink tracking-tight leading-none text-xl transition-colors duration-200 hover:text-accent-ink"
            aria-label="OVERLAND home"
          >
            OVERLAND
          </a>

          {/* Desktop links (lg and up: below that the pill is too narrow) */}
          <ul className="hidden lg:flex items-center gap-7 xl:gap-9">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={`${base}${link.href}`}
                  aria-current={isCurrent(link.href) ? 'page' : undefined}
                  className="nav-link relative whitespace-nowrap py-2 font-heading font-bold text-xs tracking-[0.14em] uppercase text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA + mobile burger */}
          <div className="flex items-center gap-3">
            <a
              href={`${base}contact/`}
              className="hidden lg:inline-flex btn btn-primary whitespace-nowrap rounded-full text-xs py-3 px-6"
              data-magnetic
            >
              Book Expedition
            </a>

            <button
              ref={burgerRef}
              type="button"
              className="lg:hidden flex h-11 w-11 flex-col items-center justify-center gap-1.5 text-ink"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span
                className={`block w-6 h-0.5 bg-current transition-transform duration-300 origin-center ${
                  menuOpen ? 'translate-y-2 rotate-45' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-current transition-opacity duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-current transition-transform duration-300 origin-center ${
                  menuOpen ? '-translate-y-2 -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer: top-level siblings of the nav (never nested inside
          its backdrop-filter, which would let composited layers paint
          through). `inert` keeps the closed drawer out of the tab order. */}
      <div
        className={`fixed inset-0 z-[190] lg:hidden transition-colors duration-500 ${
          menuOpen ? 'pointer-events-auto bg-[rgba(15,26,11,0.6)]' : 'pointer-events-none bg-transparent'
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!menuOpen}
        className={`fixed top-0 right-0 h-full w-[85vw] max-w-sm z-[195] lg:hidden flex flex-col justify-center px-10 bg-canvas border-l border-hairline transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ul className="flex flex-col gap-6">
          {links.map((link, i) => (
            <li key={link.href}>
              <a
                ref={i === 0 ? firstLinkRef : undefined}
                href={`${base}${link.href}`}
                aria-current={isCurrent(link.href) ? 'page' : undefined}
                className="block py-1 font-heading font-black italic text-4xl text-ink transition-colors duration-200 hover:text-accent-ink aria-[current=page]:text-accent-ink"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`${base}contact/`}
              className="inline-flex btn btn-primary mt-4 py-4"
              onClick={() => setMenuOpen(false)}
            >
              Book Expedition
            </a>
          </li>
        </ul>
        <p className="coords absolute bottom-8 left-10 text-muted">
          OVERLAND · EST. 2006
        </p>
      </div>
    </>
  );
}
