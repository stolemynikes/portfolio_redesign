import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

/**
 * Frosted-glass contact pill, fixed bottom-right. It floats over the
 * portrait and project imagery, so the backdrop blur actually reads.
 * Slides in after the hero load sequence, and hides itself once the
 * contact section is on screen (redundant there, and it would collide
 * with the footer links).
 */
// SVG displacement inside backdrop-filter only renders in Chromium;
// Safari would drop the whole filter chain, losing even the frost.
const supportsLensWarp = () =>
  Array.isArray((navigator as { userAgentData?: { brands?: { brand: string }[] } }).userAgentData?.brands) &&
  (navigator as unknown as { userAgentData: { brands: { brand: string }[] } }).userAgentData.brands.some(
    (b) => /Chromium/i.test(b.brand)
  );

export default function FloatingContact() {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hidden, setHidden] = useState(false);
  const [lens, setLens] = useState(false);

  useEffect(() => {
    setLens(supportsLensWarp());
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
      className={`floating-contact glass ${lens ? 'lens' : ''} ${hidden ? 'is-hidden' : ''}`}
      ref={ref}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden}
    >
      <span className="floating-contact-dot" aria-hidden="true" />
      Neem contact op
    </a>
  );
}
