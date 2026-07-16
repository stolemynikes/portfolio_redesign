import { lazy, Suspense, useEffect, useRef } from 'react';
import { gsap, splitLines, prefersReducedMotion } from '../lib/motion';

// three.js only loads when the WebGL portrait actually mounts
const HeroPortrait = lazy(() => import('./HeroPortrait'));

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  // Page-load sequence: headline lines mask-reveal, then intro + portrait.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current!;
    const headline = root.querySelector<HTMLElement>('.hero-headline')!;
    const inners = splitLines(headline);

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.set(root, { autoAlpha: 1 })
      .from(inners, { yPercent: 110, duration: 1.1, stagger: 0.1 })
      .from(
        root.querySelectorAll('.hero-intro, .hero-links'),
        { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.12 },
        '-=0.7'
      )
      .from(
        root.querySelector('.hero-media'),
        { autoAlpha: 0, scale: 1.06, duration: 1.2, ease: 'quart.out' },
        '-=0.8'
      );
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="hero" id="top" ref={rootRef}>
      <h1 className="display hero-headline">Fullstack Developer</h1>

      <div className="grid-12 hero-lower">
        <p className="hero-intro label">
          Gedreven fullstack developer — ik leer door te maken.
          <br />
          Op zoek naar een duale HBO-ICT werkplek.
        </p>

        <div className="hero-links">
          <a href="/cv-pepijn-scheer.pdf" className="link-underline" download>
            Download CV
          </a>
          <a
            href="https://github.com/pepijnscheer"
            className="link-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>

        <div className="hero-media" data-parallax="8">
          <Suspense
            fallback={
              <div className="hero-portrait">
                <img
                  src="/assets/portret-1.jpg"
                  alt="Portret van Pepijn Scheer, golden hour buiten"
                  className="media-fill"
                />
              </div>
            }
          >
            <HeroPortrait
              src="/assets/portret-1.jpg"
              alt="Portret van Pepijn Scheer, golden hour buiten"
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
