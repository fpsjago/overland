import { useEffect, useRef, useState } from 'react';
import type { RailCard } from '../types';

interface Props {
  cards: RailCard[];
  base: string;
}

/** Desktop pointer, room to pin, and motion allowed: the only case that pins. */
const PIN_QUERY = '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/**
 * "Where We Go" rail.
 * - Desktop (PIN_QUERY): the whole stage (header + cards) pins and vertical
 *   scroll drives the track sideways with GSAP ScrollTrigger.
 * - Everywhere else (touch, narrow, reduced motion): a native, swipeable
 *   scroll-snap rail. No pin, so no dead pin-spacer on phones.
 * Cards are visible by default in both modes; GSAP only adds an entrance,
 * with explicit fromTo values, so no state can be stranded hidden.
 */
export function DestinationsTeaser({ cards, base }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [pinned, setPinned] = useState(false);
  // Photos are rendered only once the island hydrates (the page hydrates it
  // about one screen before it scrolls into view). Native loading="lazy"
  // alone fetched all six at page load on slow connections, where Chrome
  // widens its lazy margin, competing with the hero for first paint.
  const [showPhotos, setShowPhotos] = useState(false);

  useEffect(() => {
    setShowPhotos(true);
    const mq = window.matchMedia(PIN_QUERY);
    const sync = () => setPinned(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      const stage = stageRef.current;
      const track = trackRef.current;
      if (cancelled || !stage || !track) return;
      gsap.registerPlugin(ScrollTrigger);

      const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth);

      const ctx = gsap.context(() => {
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.fromTo(
          track.children,
          { autoAlpha: 0, y: 48 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.08,
            immediateRender: false,
            clearProps: 'opacity,visibility,transform',
            scrollTrigger: { trigger: stage, start: 'top 70%', once: true },
          },
        );

        // Keyboard: a focused card that sits off-stage (translated away) is
        // brought into view by scrolling the page to the matching progress.
        const onFocus = (e: FocusEvent) => {
          const card = (e.target as HTMLElement).closest('li');
          const st = tween.scrollTrigger;
          if (!card || !st || distance() === 0) return;
          const progress = Math.min(1, Math.max(0, (card.offsetLeft - stage.clientWidth / 3) / distance()));
          window.scrollTo({ top: st.start + (st.end - st.start) * progress, behavior: 'instant' });
        };
        track.addEventListener('focusin', onFocus);
        return () => track.removeEventListener('focusin', onFocus);
      }, stage);

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pinned]);

  return (
    <section className="bg-panel" aria-labelledby="rail-title">
      <div
        ref={stageRef}
        className={`flex flex-col justify-center overflow-hidden py-24 ${pinned ? 'h-screen py-0' : ''}`}
      >
        <div className="w-full max-w-6xl mx-auto px-6 mb-10 lg:mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="coords text-xs mb-4 text-accent-ink">DESTINATIONS / EXPLORE</p>
            <h2 id="rail-title" className="font-heading font-black italic leading-none text-cream text-[length:clamp(2.5rem,5vw,4rem)]">
              Where We Go
            </h2>
          </div>
          <a
            href={`${base}destinations/`}
            className="group hidden md:inline-flex items-center gap-2 font-heading font-bold uppercase text-sm tracking-[0.12em] border border-cream/25 text-cream px-6 py-3 transition-colors duration-300 hover:border-accent-ink hover:text-accent-ink"
          >
            All Destinations
            <svg className="transition-transform duration-300 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Native swipe rail unless pinned; then the stage clips and GSAP moves the track. */}
        <div
          className={
            pinned
              ? 'overflow-visible'
              : 'rail-scroll overflow-x-auto snap-x snap-mandatory scroll-px-6 pb-4'
          }
        >
          <ul ref={trackRef} className="flex w-max gap-5 lg:gap-6 px-6">
            {cards.map((d, i) => {
              return (
                <li key={d.id} className="snap-start">
                  <a
                    href={`${base}destinations/${d.id}/`}
                    className="trail-card group relative block overflow-hidden rounded w-[clamp(260px,74vw,340px)] lg:w-[clamp(280px,24vw,360px)] h-[clamp(380px,56vh,500px)]"
                    data-cursor="photo"
                  >
                    {/* Nothing is rendered in place of the photo before
                        hydration, so server and client markup are identical.
                        (A <noscript> fallback here broke hydration: Astro's
                        router parses fetched pages with scripting off, which
                        turns noscript content into real elements, and React
                        then reported #418 on every return to the home page.)
                        Without JavaScript the cards show on the dark panel
                        without their photo. */}
                    {showPhotos && (
                      <img
                        src={d.image.src}
                        srcSet={d.image.srcset}
                        sizes="(min-width: 1024px) 360px, 74vw"
                        alt=""
                        width={d.image.width}
                        height={d.image.height}
                        loading="lazy"
                        decoding="async"
                        className="trail-card__img absolute inset-0 w-full h-full object-cover"
                      />
                    )}

                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(15,26,11,0.92)_0%,rgba(15,26,11,0.15)_60%,transparent_100%)]" />

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span
                        className={`badge-difficulty inline-block font-heading font-bold uppercase text-xs tracking-[0.1em] px-3 py-1 rounded-full mb-3 difficulty-${d.difficulty}`}
                      >
                        {d.difficulty}
                      </span>

                      <h3 className="font-heading font-black italic leading-tight mb-1 text-cream text-[length:1.5rem]">
                        <span className="trail-card__title">{d.name}</span>
                      </h3>
                      <p className="text-sm text-cream/80">{d.country}</p>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 whitespace-nowrap">
                        <p className="coords text-xs text-cream/70">
                          {d.lat.toFixed(4)}°, {d.lng.toFixed(4)}°
                        </p>
                        <span className="trail-card__cue coords text-xs text-cream" aria-hidden="true">
                          View route →
                        </span>
                      </div>
                    </div>

                    <div
                      className="absolute top-4 right-4 font-heading font-black italic text-cream/15 text-[length:3rem] leading-none"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
