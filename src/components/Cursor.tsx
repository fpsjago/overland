import { useEffect, useRef } from 'react';

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // No module-level "initialized" flag: <ClientRouter> remounts this island
  // on every navigation, and a module flag would survive the remount while
  // the listeners it guarded still pointed at the previous, detached nodes —
  // the cursor would freeze after the first page change.
  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    // Fine pointers only, and not when motion is reduced: the native
    // cursor stays in those cases.
    if (!window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
    document.documentElement.classList.add('has-cursor');

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    // style.left/top + CSS translate(-50%,-50%) centering — never GSAP x/y,
    // which would overwrite the centering transform.
    let shown = false;
    const show = (visible: boolean) => {
      shown = visible;
      dot.classList.toggle('is-visible', visible);
      ring.classList.toggle('is-visible', visible);
    };
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
      if (!shown) {
        // Start the ring on the pointer instead of sweeping in from 0,0.
        ringX = mouseX;
        ringY = mouseY;
        show(true);
      }
    };
    const onLeave = () => show(false);
    document.addEventListener('mousemove', onMouseMove);
    document.documentElement.addEventListener('mouseleave', onLeave);

    // Ring follows with lag
    let rafId = 0;
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      rafId = requestAnimationFrame(animateRing);
    };
    animateRing();

    // Context-aware states
    const expandRing = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const ctx = el.dataset['cursor'];
      ring.classList.add('cursor-ring--expanded');
      if (ctx === 'photo') ring.classList.add('cursor-ring--photo');
      if (ctx === 'cta') ring.classList.add('cursor-ring--cta');
    };
    const collapseRing = () => {
      ring.classList.remove('cursor-ring--expanded', 'cursor-ring--photo', 'cursor-ring--cta');
    };

    // Track what we bound so every listener can be released on unmount.
    let targets: Element[] = [];
    const unbindTargets = () => {
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', expandRing);
        el.removeEventListener('mouseleave', collapseRing);
      });
      targets = [];
    };
    const bindTargets = () => {
      unbindTargets(); // never double-bind after a navigation
      targets = Array.from(document.querySelectorAll('a, button, [data-cursor]'));
      targets.forEach((el) => {
        el.addEventListener('mouseenter', expandRing);
        el.addEventListener('mouseleave', collapseRing);
      });
    };
    bindTargets();

    document.addEventListener('astro:page-load', bindTargets);
    document.addEventListener('astro:before-preparation', collapseRing);

    return () => {
      document.documentElement.classList.remove('has-cursor');
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMouseMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('astro:page-load', bindTargets);
      document.removeEventListener('astro:before-preparation', collapseRing);
      unbindTargets();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
