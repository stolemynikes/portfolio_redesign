import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

/**
 * Frosted-glass contact pill, fixed bottom-right. It floats over the
 * portrait and project imagery, so the backdrop blur actually reads.
 * Slides in after the hero load sequence, and hides itself once the
 * contact section is on screen (redundant there, and it would collide
 * with the footer links).
 */
export default function FloatingContact() {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hidden, setHidden] = useState(false);
  const [liquid, setLiquid] = useState(false);

  // Upgrade the pill to WebGL liquid glass (refraction/chromatic
  // aberration à la Apple). Runs after mount; on any failure the CSS
  // glass simply stays.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let instance: { destroy(): void } | null = null;
    let cancelled = false;
    (async () => {
      try {
        const { LiquidGlass } = await import('@ybouane/liquidglass');
        const root = document.querySelector<HTMLElement>('.shell');
        const el = ref.current;
        if (!root || !el || cancelled) return;
        // Library defaults = the demo's "Regular glass" preset (clear
        // center, refracted edges); only shape/float are ours.
        el.dataset.config = JSON.stringify({
          floating: true,
          cornerRadius: 28,
        });
        instance = await LiquidGlass.init({ root, glassElements: [el] });
        if (cancelled) {
          instance.destroy();
          return;
        }
        // Declarative: a re-render must not wipe the class (it did, which
        // made the pill flip between CSS and WebGL glass on scroll)
        setLiquid(true);
      } catch {
        /* keep CSS glass fallback */
      }
    })();
    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!prefersReducedMotion()) {
      gsap.from(ref.current!, {
        autoAlpha: 0,
        y: 24,
        duration: 0.9,
        ease: 'expo.out',
        delay: 1.6,
      });
    }

    const contact = document.getElementById('contact');
    if (!contact) return;
    const io = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: '0px 0px -35% 0px' }
    );
    io.observe(contact);
    return () => io.disconnect();
  }, []);

  return (
    <a
      href="#contact"
      className={`floating-contact glass ${liquid ? 'liquid-active' : ''} ${hidden ? 'is-hidden' : ''}`}
      ref={ref}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden}
    >
      <span className="floating-contact-dot" aria-hidden="true" />
      Neem contact op
    </a>
  );
}
