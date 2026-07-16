# pepijnscheer.nl — portfolio

Editorial portfolio voor Pepijn Scheer, fullstack developer. Gebouwd volgens
`DESIGN.md` (het volledige designbrief- en buildplan).

## Stack

- Vite + React + TypeScript
- GSAP + ScrollTrigger (line reveals, media reveals, parallax)
- Lenis (smooth scroll, gesynct met de GSAP-ticker)
- three.js (hero-portret als WebGL-plane met muis-displacement, lazy-loaded)
- Vanilla CSS met custom properties — tokens in `src/styles/tokens.css`

## Commands

```bash
npm run dev       # dev server
npm run build     # productie-build naar dist/
npm run preview   # serveer de build lokaal
```

`/styleguide` toont alle design tokens (kleur, type, spacing, grid).

## Nog vervangen (placeholders)

| Wat | Waar |
| --- | --- |
| Portretfoto's (1500×2000 JPG, metadata gestript) | `public/assets/portret-1.jpg`, `portret-2.jpg` (nu warme gradient-placeholders; kopie in `design/assets/`) |
| CV-download | `public/cv-pepijn-scheer.pdf` |
| GitHub-URL | `src/components/Hero.tsx`, `src/components/Footer.tsx` |
| E-mailadres | `src/components/Footer.tsx` |
| BCMS / Card Grading screenshots | `image`-prop in `src/components/Projects.tsx` |

## Deploy — Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- `public/_redirects` en `public/_headers` worden automatisch meegenomen.

## Animatieregels

Zie `DESIGN.md` — de vocabulaire is bewust beperkt: masked line reveals,
media fade+scale (1.08 → 1), subtiele parallax (alleen desktop) en
hover-scale op projecttiles. Alles expo/quart ease-out, 0.8–1.2s.
`prefers-reduced-motion` schakelt Lenis én alle reveals uit.
