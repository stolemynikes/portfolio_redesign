import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/motion';

/** #RRGGBB -> "rgba(r,g,b,a)" */
function rgba(hex: string, a: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

interface Ripple {
  x: number;
  y: number;
  start: number;
}

/**
 * A grid of dots that ripples. Three motion sources layer up:
 *  - an ambient diagonal sine wave so it always breathes,
 *  - cursor proximity (dots near the pointer swell, brighten, push out),
 *  - expanding ripple rings spawned on click and on an idle timer.
 * Canvas is fixed behind all content and never eats pointer events.
 */
export default function RippleGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const GAP = 34;
    const RIPPLE_SPEED = 320; // px/s
    const RIPPLE_LIFE = 1.9; // s

    let w = 0;
    let h = 0;

    const styles = getComputedStyle(document.documentElement);
    const ink = (styles.getPropertyValue('--c-ink').trim() || '#282320').slice(0, 7);
    const accent = (styles.getPropertyValue('--c-accent').trim() || '#a83848').slice(0, 7);

    const pointer = { x: -9999, y: -9999, active: false };
    const ripples: Ripple[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onClick = (e: MouseEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, start: performance.now() });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onClick, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', resize);

    // Idle auto-ripples so the grid stays alive with no interaction
    const idle = window.setInterval(() => {
      ripples.push({
        x: Math.random() * w,
        y: Math.random() * h,
        start: performance.now(),
      });
    }, 3200);

    const t0 = performance.now();
    let raf = 0;

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);

      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const wave = Math.sin(x * 0.014 + y * 0.02 + t * 1.1) * 0.5 + 0.5; // 0..1
          let r = 0.7 + wave * 0.8;
          let alpha = 0.05 + wave * 0.06;
          let ox = 0;
          let oy = 0;
          let color = ink;

          if (pointer.active) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const d = Math.hypot(dx, dy);
            const infl = Math.max(0, 1 - d / 170);
            if (infl > 0) {
              r += infl * infl * 2.6;
              alpha += infl * 0.28;
              const push = infl * 9;
              ox += (dx / (d || 1)) * push;
              oy += (dy / (d || 1)) * push;
              if (infl > 0.45) color = accent;
            }
          }

          for (const rp of ripples) {
            const age = (now - rp.start) / 1000;
            const radius = age * RIPPLE_SPEED;
            const dx = x - rp.x;
            const dy = y - rp.y;
            const d = Math.hypot(dx, dy);
            const band = Math.abs(d - radius);
            if (band < 46) {
              const fade = Math.max(0, 1 - age / RIPPLE_LIFE);
              const strength = (1 - band / 46) * fade;
              if (strength > 0) {
                r += strength * 3;
                alpha += strength * 0.34;
                const push = strength * 12;
                ox += (dx / (d || 1)) * push;
                oy += (dy / (d || 1)) * push;
                if (strength > 0.5) color = accent;
              }
            }
          }

          ctx.beginPath();
          ctx.fillStyle = rgba(color, Math.min(alpha, 0.5));
          ctx.arc(x + ox, y + oy, Math.max(0.4, r), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        if ((now - ripples[i].start) / 1000 > RIPPLE_LIFE) ripples.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(idle);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onClick);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas className="ripple-grid" ref={canvasRef} aria-hidden="true" />;
}
