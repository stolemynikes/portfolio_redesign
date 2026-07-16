import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Smooth scroll via Lenis, driven by the GSAP ticker so ScrollTrigger
 * stays perfectly in sync. Returns a cleanup function.
 */
export function initLenis(): (() => void) | null {
  if (prefersReducedMotion()) return null;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const onAnchorClick = (e: Event) => {
    const anchor = (e.target as HTMLElement).closest('a[href^="#"]');
    if (!anchor) return;
    const id = anchor.getAttribute('href')!;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -24 });
    }
  };
  document.addEventListener('click', onAnchorClick);

  return () => {
    document.removeEventListener('click', onAnchorClick);
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}

/**
 * Manual line-splitting (SplitText-style). Wraps each rendered line of the
 * element in .reveal-line > .reveal-line-inner so a masked translateY
 * reveal can run. Returns the inner spans to animate.
 */
export function splitLines(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === 'true') {
    return Array.from(el.querySelectorAll<HTMLElement>('.reveal-line-inner'));
  }
  el.dataset.split = 'true';
  const text = el.textContent ?? '';
  const words = text.split(/\s+/).filter(Boolean);
  el.textContent = '';

  // Lay out words to measure natural line breaks
  const probes: HTMLSpanElement[] = words.map((w) => {
    const s = document.createElement('span');
    s.textContent = w + ' ';
    s.style.display = 'inline-block';
    el.appendChild(s);
    return s;
  });

  const lines: string[][] = [];
  let currentTop: number | null = null;
  probes.forEach((probe) => {
    const top = probe.offsetTop;
    if (top !== currentTop) {
      lines.push([]);
      currentTop = top;
    }
    lines[lines.length - 1].push(probe.textContent!.trim());
  });

  el.textContent = '';
  return lines.map((lineWords) => {
    const mask = document.createElement('span');
    mask.className = 'reveal-line';
    const inner = document.createElement('span');
    inner.className = 'reveal-line-inner';
    inner.textContent = lineWords.join(' ');
    mask.appendChild(inner);
    el.appendChild(mask);
    return inner;
  });
}

/** Scroll-triggered line reveal for a heading. */
export function revealLinesOnScroll(el: HTMLElement, stagger = 0.1) {
  const inners = splitLines(el);
  gsap.set(inners, { yPercent: 110 });
  gsap.to(inners, {
    yPercent: 0,
    duration: 1,
    ease: 'expo.out',
    stagger,
    scrollTrigger: { trigger: el, start: 'top 85%' },
  });
}

/** Image fade + scale 1.08 → 1 on enter. */
export function revealMediaOnScroll(container: HTMLElement) {
  const media = container.querySelector('img, canvas, .media-fill');
  if (!media) return;
  gsap.set(container, { autoAlpha: 0 });
  gsap.set(media, { scale: 1.08 });
  gsap
    .timeline({ scrollTrigger: { trigger: container, start: 'top 85%' } })
    .to(container, { autoAlpha: 1, duration: 0.9, ease: 'quart.out' }, 0)
    .to(media, { scale: 1, duration: 1.2, ease: 'expo.out' }, 0);
}

/** Subtle parallax: inner media drifts slower than scroll. */
export function parallax(container: HTMLElement, amount = 12) {
  const media = container.querySelector('img, canvas, .media-fill');
  if (!media) return;
  gsap.fromTo(
    media,
    { yPercent: -amount / 2 },
    {
      yPercent: amount / 2,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }
  );
}

/**
 * Wire up every [data-reveal] element inside root. Runs once after mount.
 * data-reveal="lines"  → masked line-by-line heading reveal
 * data-reveal-media    → fade + scale
 * data-parallax        → scroll parallax (extra, combinable)
 */
export function initSectionReveals(root: HTMLElement | Document = document) {
  if (prefersReducedMotion()) return;

  root
    .querySelectorAll<HTMLElement>('[data-reveal="lines"]')
    .forEach((el) => revealLinesOnScroll(el));

  root
    .querySelectorAll<HTMLElement>('[data-reveal-media]')
    .forEach((el) => revealMediaOnScroll(el));

  // Parallax stays desktop-only (per DESIGN.md: mobile parallax off)
  if (window.matchMedia('(min-width: 901px)').matches) {
    root
      .querySelectorAll<HTMLElement>('[data-parallax]')
      .forEach((el) => parallax(el, Number(el.dataset.parallax) || 12));
  }

  root.querySelectorAll<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
    gsap.set(el, { autoAlpha: 0, y: 32 });
    gsap.to(el, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: 'quart.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
}

export { gsap, ScrollTrigger };
