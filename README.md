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
| CV-download | `public/cv-pepijn-scheer.pdf` |
| GitHub-URL (nog een gok, nooit bevestigd) | `src/components/Footer.tsx` |
| BCMS / Card Grading fallback-screenshots | `image`-prop in `src/components/Projects.tsx` (alleen relevant als de Apero API niet bereikbaar is) |

## Projecten-data — Apero CMS

Projecten worden live opgehaald via GraphQL (`src/lib/apero.ts`). Vereist
drie env-vars (zie `.env.example`):

```
VITE_APERO_API_URL=https://aperocms.com/graphql
VITE_APERO_API_KEY=apero_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_APERO_PROJECT_ID=328c0c59-16eb-4c47-bcdb-5d5f6bfb0e92
```

De key is client-side zichtbaar (dit is een statische SPA, er is geen
server om hem achter te verbergen) — bewust geaccepteerd omdat de key
alleen leestoegang tot publieke content geeft. Zonder deze env-vars valt
de site terug op de hardcoded `FALLBACK_PROJECTS` in `Projects.tsx`.

## Deploy — Docker (self-hosted)

```bash
# lokaal bouwen + draaien (leest .env automatisch)
docker compose up --build -d

# of handmatig, zonder compose
docker build \
  --build-arg VITE_APERO_API_URL=https://aperocms.com/graphql \
  --build-arg VITE_APERO_API_KEY=apero_xxx \
  --build-arg VITE_APERO_PROJECT_ID=328c0c59-16eb-4c47-bcdb-5d5f6bfb0e92 \
  -t portfolio .
docker run -d --restart unless-stopped -p 8080:80 portfolio
```

Multi-stage build (`Dockerfile`): Node bouwt de static site, nginx serveert
`dist/` (config in `docker/nginx.conf` — SPA-fallback naar `index.html`,
lange cache op `/assets/*`, gzip). `.env` wordt nooit in de image
gekopieerd (zie `.dockerignore`) — de Apero-vars gaan via `--build-arg`.

Zet er zelf een reverse proxy (Caddy/nginx/Traefik) voor voor TLS en het
echte domein.

## Animatieregels

Zie `DESIGN.md` — de vocabulaire is bewust beperkt: masked line reveals,
media fade+scale (1.08 → 1), subtiele parallax (alleen desktop) en
hover-scale op projecttiles. Alles expo/quart ease-out, 0.8–1.2s.
`prefers-reduced-motion` schakelt Lenis én alle reveals uit.
