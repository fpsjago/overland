import { useEffect, useRef } from 'react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 47, suffix: '', label: 'Destinations' },
  { value: 312, suffix: '+', label: 'Expeditions Led' },
  { value: 18, suffix: '', label: 'Years in the Field' },
];

/**
 * The real numbers are server-rendered, so crawlers, screen readers and
 * reduced-motion visitors always get them. With motion allowed, the bar
 * counts up once when it enters the viewport (IntersectionObserver, which
 * also fires if the bar is already in view at hydration).
 */
export function StatsBar() {
  const barRef = useRef<HTMLElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const animate = () => {
      const start = performance.now();
      const duration = 1800;
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        countersRef.current.forEach((el, i) => {
          const stat = stats[i];
          if (el && stat) el.textContent = `${Math.round(eased * stat.value)}${stat.suffix}`;
        });
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        animate();
      },
      { threshold: 0.4 },
    );
    observer.observe(bar);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={barRef} className="py-16 border-y border-hairline bg-surface" aria-label="OVERLAND in numbers">
      <div className="max-w-6xl mx-auto px-6">
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 md:divide-x md:divide-hairline">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex flex-col-reverse text-center px-8">
              <dt className="uppercase text-sm text-muted tracking-[0.2em]">{stat.label}</dt>
              <dd className="font-heading font-black leading-none mb-2 text-accent-ink tabular-nums text-[length:clamp(3rem,6vw,5rem)]">
                <span
                  ref={(el) => {
                    countersRef.current[i] = el;
                  }}
                >
                  {stat.value}
                  {stat.suffix}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
