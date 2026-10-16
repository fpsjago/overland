import type { ResponsiveImage } from '../types';

interface Props {
  base: string;
  /** Campfire plate; built with responsiveImage() in the page. */
  image: ResponsiveImage;
}

export function ExpeditionCTA({ base, image }: Props) {
  return (
    <section className="on-dark relative overflow-hidden min-h-[70vh]">
      {/* A real lazy <img> (not a CSS background, which the browser fetches
          as soon as the rule applies, far before this section is near). */}
      <img
        src={image.src}
        srcSet={image.srcset}
        sizes="100vw"
        width={image.width}
        height={image.height}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        data-cursor="photo"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[rgba(15,26,11,0.78)]" aria-hidden="true" />

      {/* Grain overlay */}
      <div className="grain absolute inset-0 pointer-events-none" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full min-h-[70vh] max-w-6xl mx-auto px-6 py-24">
        <p className="coords text-xs mb-8 text-accent-ink">EXPEDITION READY / BOOK NOW</p>

        <h2
          className="font-heading font-black italic leading-none mb-8 max-w-3xl text-cream text-[length:clamp(2.5rem,6vw,5.5rem)]"
          data-reveal
        >
          Your Next
          <br />
          Expedition
          <br />
          Starts Here.
        </h2>

        <p
          className="font-body leading-relaxed mb-12 max-w-xl text-cream/70 text-[length:1.0625rem]"
          data-reveal
        >
          Small groups. Expert guides. Places that do not forgive the unprepared — and do not forget those who arrive ready.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={`${base}contact/`}
            className="inline-flex items-center gap-3 px-8 py-4 font-heading font-bold uppercase text-sm tracking-[0.15em] bg-accent text-on-accent btn-cta"
            data-magnetic
            data-cursor="cta"
          >
            <span>Book an Expedition</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          <a
            href={`${base}destinations/`}
            className="inline-flex items-center gap-3 px-8 py-4 font-heading font-bold uppercase text-sm tracking-[0.15em] border border-cream/30 text-cream transition-all duration-300 hover:border-cream/80"
          >
            Browse Destinations
          </a>
        </div>

        {/* Bottom coordinate line */}
        <div className="absolute bottom-8 right-6 coords text-xs text-cream/70">
          48.8566° N, 2.3522° E · PARIS BOOKING OFFICE
        </div>
      </div>
    </section>
  );
}
