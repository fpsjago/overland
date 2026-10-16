import type { ResponsiveImage } from '../types';

/** Exported so the page can build the avatar images at build time. */
export const testimonials = [
  {
    quote:
      "I have traveled to forty-three countries. Nothing compares to the Patagonia Circuit with OVERLAND. Elena made a wild, demanding place feel like it was built for exactly the kind of person I want to be.",
    name: 'Carles Ferrer',
    detail: 'Architect · Barcelona · Patagonia Full Circuit 2024',
    avatar: '_assets/avatar-1.jpg',
    tall: true,
  },
  {
    quote:
      "The Himalaya expedition exceeded everything I imagined. Rajan reads that landscape like text — he noticed things that would have taken me years of experience to see.",
    name: 'Sarah Chen',
    detail: 'Physician · Vancouver · Everest Region Traverse 2025',
    avatar: '_assets/avatar-2.jpg',
    tall: false,
  },
  {
    quote:
      "I came back from East Africa a different person. I don't say that lightly. The silence of Ngorongoro at dawn — the rhino thirty meters away — nothing in my previous life prepared me for that.",
    name: 'Dr. Amara Oduya',
    detail: 'Pediatric Surgeon · Cape Town · East Africa Overland 2025',
    avatar: '_assets/avatar-3.jpg',
    tall: true,
  },
  {
    quote:
      "OVERLAND does not run tours. They run expeditions. The difference is everything. I felt challenged, supported, and consistently moved by what we encountered.",
    name: 'James Whitfield',
    detail: 'Writer · London · Sahara Grand Crossing 2024',
    avatar: '_assets/avatar-4.jpg',
    tall: false,
  },
  {
    quote:
      "Ingrid's knowledge of the Icelandic highlands is extraordinary. She anticipated every weather change, every route decision. I trusted her completely from day one.",
    name: 'Maren Halvorsen',
    detail: 'Engineer · Oslo · Iceland Highland Traverse 2025',
    avatar: '_assets/avatar-5.jpg',
    tall: false,
  },
];

interface TestimonialsProps {
  /** One per testimonial, same order; built with responsiveImage() in the page. */
  avatars: ResponsiveImage[];
}

export function Testimonials({ avatars }: TestimonialsProps) {
  return (
    <section className="py-32 bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <p className="coords text-xs mb-4 text-accent-ink">FIELD REPORTS / CLIENT VOICES</p>
          <h2
            className="font-heading font-black italic leading-none text-primary text-[length:clamp(2.5rem,5vw,4rem)]"
            data-reveal
          >
            From the Field
          </h2>
        </div>

        {/* Masonry grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="break-inside-avoid rounded-lg p-8 bg-canvas border border-hairline"
              data-reveal="scale"
            >
              {/* Quote mark */}
              <div
                className="font-heading font-black italic mb-4 text-accent-ink opacity-20 text-[length:4rem] leading-none"
                aria-hidden="true"
              >
                "
              </div>

              <blockquote
                className={`font-body leading-relaxed mb-8 text-ink ${
                  t.tall ? 'text-[length:1.0625rem]' : 'text-[length:0.9375rem]'
                }`}
              >
                {t.quote}
              </blockquote>

              <div className="flex items-center gap-4">
                <img
                  src={avatars[i]?.src}
                  alt=""
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
                  className="rounded-full object-cover shrink-0"
                />
                <div>
                  <div className="font-heading font-bold text-sm text-primary">
                    {t.name}
                  </div>
                  <div className="text-xs leading-snug text-muted">
                    {t.detail}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
