import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

/**
 * Frosted-glass contact pill, fixed bottom-right. It floats over the
 * portrait, project imagery and footer, so the backdrop blur actually
 * reads. Slides in after the hero load sequence.
 */
export default function FloatingContact() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current!;
    gsap.from(el, {
      autoAlpha: 0,
      y: 24,
      duration: 0.9,
      ease: 'expo.out',
      delay: 1.6,
    });
  }, []);

  return (
    <a href="#contact" className="floating-contact glass" ref={ref}>
      <span className="floating-contact-dot" aria-hidden="true" />
      Neem contact op
    </a>
  );
}
