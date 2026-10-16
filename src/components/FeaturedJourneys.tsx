import type { CollectionEntry } from 'astro:content';
import type { ResponsiveImage } from '../types';

interface Props {
  journeys: CollectionEntry<'journeys'>[];
  /** Keyed by journey id; built with responsiveImage() in the page. */
  images: Record<string, ResponsiveImage>;
  base: string;
}

export function FeaturedJourneys({ journeys, images, base }: Props) {
  const difficultyLabel: Record<string, string> = {
    moderate: 'Moderate',
    challenging: 'Challenging',
    extreme: 'Extreme',
  };

  return (
    <section className="py-32 bg-canvas">
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <p className="coords text-xs mb-4 text-accent-ink">FEATURED JOURNEYS / EXPEDITIONS</p>
        <h2
          className="font-heading font-black italic leading-none text-primary text-[length:clamp(2.5rem,5vw,4rem)]"
          data-reveal
        >
          Selected
          <br />
          Expeditions
        </h2>
      </div>

      <div className="space-y-0">
        {journeys.map((journey, i) => {
          const j = journey.data;
          const isEven = i % 2 === 0;

          return (
            <article key={journey.id} className="border-y border-hairline">
              <div className="max-w-6xl mx-auto">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 ${isEven ? '' : 'lg:grid-flow-col-dense'}`}
                >
                  {/* Image */}
                  <div
                    className={`group relative overflow-hidden min-h-[420px] ${isEven ? '' : 'lg:col-start-2'}`}
                    data-cursor="photo"
                  >
                    <img
                      src={images[journey.id]?.src}
                      srcSet={images[journey.id]?.srcset}
                      sizes="(min-width: 1152px) 576px, (min-width: 1024px) 50vw, 100vw"
                      width={images[journey.id]?.width}
                      height={images[journey.id]?.height}
                      alt={j.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
                    />
                    {/* Index overlay */}
                    <div
                      className="absolute top-6 left-6 font-heading font-black italic text-parchment/10 leading-none text-[length:clamp(4rem,8vw,7rem)]"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`flex flex-col justify-center px-10 py-16 lg:py-20 ${
                      i % 3 === 1 ? 'bg-surface' : 'bg-canvas'
                    } ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}
                    data-reveal={isEven ? 'slide-left' : 'slide-right'}
                  >
                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <span className="font-heading font-bold uppercase text-xs tracking-[0.1em] bg-accent text-on-accent px-3 py-1">
                        {difficultyLabel[j.difficulty] ?? j.difficulty}
                      </span>
                      <span className="coords text-xs text-muted">{j.durationDays} days</span>
                      <span className="coords text-xs text-muted">
                        From ${j.price.toLocaleString()}
                      </span>
                    </div>

                    <h3 className="font-heading font-black italic leading-tight mb-4 text-primary text-[length:clamp(1.75rem,3vw,2.5rem)]">
                      {j.title}
                    </h3>

                    <p className="font-body leading-relaxed mb-8 text-muted max-w-[42ch]">
                      {j.excerpt}
                    </p>

                    {/* Highlights preview */}
                    <ul className="space-y-2 mb-10">
                      {j.itinerary.slice(0, 3).map((item) => (
                        <li key={item.day} className="flex items-start gap-3 text-sm font-body text-muted">
                          <span className="coords text-xs shrink-0 pt-0.5 text-accent-ink">
                            Day {item.day}
                          </span>
                          <span>{item.title}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={`${base}journeys/${journey.id}/`}
                      className="self-start inline-flex items-center gap-3 font-heading font-bold uppercase text-sm tracking-[0.12em] border border-primary text-primary bg-transparent px-6 py-3 transition-colors duration-300 hover:bg-primary hover:text-canvas"
                      data-magnetic
                    >
                      View Expedition
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-16 text-center">
        <a
          href={`${base}journeys/`}
          className="inline-flex items-center gap-3 font-heading font-bold uppercase text-sm tracking-[0.12em] bg-primary text-canvas px-10 py-4 transition-colors duration-300 hover:bg-accent hover:text-on-accent"
          data-magnetic
        >
          All Expeditions
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
