import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

/**
 * Custom cursor: a wine-red dot that sticks to the pointer and a soft ink
 * ring that trails it. The ring swells over interactive elements; both hide
 * over text fields (native I-beam takes over) and on touch/coarse pointers
 * or reduced motion the component does nothing at all.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!finePointer || prefersReducedMotion()) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    document.documentElement.classList.add('cursor-none');

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.06, ease: 'power2.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.06, ease: 'power2.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.32, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.32, ease: 'power3.out' });

    let visible = false;

    const show = () => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.25 });
      }
    };
    const hide = () => {
      visible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.25 });
    };

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      show();
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('input, textarea, select')) {
        hide();
        return;
      }
      show();
      const interactive = el.closest('a, button, [data-cursor]');
      gsap.to(ring, {
        scale: interactive ? 1.7 : 1,
        borderColor: interactive ? 'rgba(168, 56, 72, 0.6)' : 'rgba(40, 35, 32, 0.35)',
        duration: 0.35,
        ease: 'power3.out',
      });
      gsap.to(dot, { scale: interactive ? 0.5 : 1, duration: 0.35, ease: 'power3.out' });
    };

    const onDown = () => gsap.to(ring, { scale: 0.85, duration: 0.15, ease: 'power2.out' });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power3.out' });
    const onLeave = () => hide();

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      document.documentElement.classList.remove('cursor-none');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
