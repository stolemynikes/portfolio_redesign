# Portfolio Website — Build Plan for Claude Code

Goal: personal portfolio for Pepijn — fullstack developer. Editorial layout inspired by one reference site, animation feel inspired by another. Claude Code cannot see the reference sites, so this document translates them into explicit rules.

---

## 1. Design brief (put this in CLAUDE.md or keep as DESIGN.md and reference it)

### Layout language (inspired by marcel-apitty-wcopilot.webflow.io)
- Editorial, whitespace-heavy. Sections breathe: large vertical padding between sections (120–200px desktop).
- Hero = one huge uppercase display headline spanning the viewport (e.g. "FULLSTACK DEVELOPER"), with a portrait/banner image placed asymmetrically below or beside it.
- Short uppercase intro paragraph in small type, offset to one side — not centered.
- Text and images are placed asymmetrically on a 12-column grid: text left / image right in one section, flipped in the next. Never everything centered.
- Project grid: large full-bleed or near-full-bleed thumbnails, 2-column on desktop, generous gaps, project title + year as small labels.
- A "statements" section: 2–3 short one-line statements set as large headings (only number them if they represent a real sequence).
- Oversized closing statement in the footer ("I build ... ") + a single CTA link.
- Sticky minimal nav: **persistent narrow sidebar (left, ±80–260px)** carried over from the old pepijnscheer.nl — holds logo/naam, nav-links, en microcopy (locatie, beschikbaar-voor-duaal). Editorial content scrolls in the remaining width on the 12-col grid. Collapses to a top bar on mobile.
- **Colors: minimal photo-derived palette (replaces the old site's purple).** Three values: warm off-white background `#F8F1E7`, warm ink `#282320` for all text, and accent wijnrood `#A83848` (hover-variant `#7A2735`). No amber, no secondary colors — the golden-hour warmth comes exclusively from the portrait photos, the UI itself stays quiet. Muted text (labels, jaartallen) = ink at reduced opacity or `#8A8178`. Sidebar layout still carried over from the old pepijnscheer.nl, restyled in this palette.
- Portrait photos live in `design/assets/` as `portret-1.jpg` / `portret-2.jpg` (web-ready JPG, 1500×2000, metadata gestript). Golden-hour outdoor shots, wine-red sweater. Hero uses one large; the other can appear in the Over mij section. Optional: subtle warm color-grade on project covers so all imagery shares the same temperature.

### Animation language (inspired by evasanchez.info)
- Smooth scrolling via **Lenis** — the whole site should feel damped/buttery, not native scroll.
- Page-load sequence: headline text reveals line-by-line with a mask/clip animation (translateY from below a clipped line), staggered ~80–120ms per line.
- Scroll-triggered reveals with **GSAP ScrollTrigger**: headings reveal line-by-line as they enter viewport; images fade+scale from ~1.08 to 1.
- Subtle image parallax while scrolling (background position or translateY at different speed).
- Hover on project thumbnails: image scales slightly (1.0 → 1.05) inside an overflow-hidden container, title/label shifts or underlines.
- Easing: expo/quart ease-out everywhere, durations 0.8–1.2s for reveals. Nothing bouncy.
- Respect `prefers-reduced-motion`: disable Lenis + reveals, content simply visible.
- Restraint rule: reveals + parallax + hover are the whole animation vocabulary. No extra floating blobs, gradient tricks, or particle effects.

### Reference screenshots
- Folder: `design/references/` — screenshots of the layout reference (hero, project grid, footer). Claude Code can view these; match spacing rhythm and type scale to them.
- Animations can't be screenshotted — the written rules above are the source of truth.

### Content (decided)
- **Language: Nederlands.** All copy in Dutch, tone matching the CV's "Over mij" (gedreven, praktisch, leert door te maken). Strictly professional — no hobby content.
- **Audience:** duale HBO-ICT werkplekken / werkgevers (CITA). CV-download link en GitHub-link zichtbaar in de hero of nav.
- **Hero:** groot uppercase display ("FULLSTACK DEVELOPER") + portretfoto asymmetrisch geplaatst (Marcel-stijl banner). Portretfoto wordt aangeleverd — placeholder tot die tijd.
- **Secties:** Hero → Over mij (korte intro uit CV) → Statements → Projecten → Contact/footer-statement. *(Update 2026-07-16: Werkervaring en Vaardigheden verwijderd; alle duaal/HBO-ICT-vermeldingen uit de copy gehaald.)*
- **Projecten (uit CV):**
  - EUStatement (React, TS, Node, GraphQL) — inhoud vertrouwelijk → gebruik een abstracte branded cover-tile, géén UI-screenshots. Copy: één regel over regelgeving/compliance + stack.
  - BCMS — configureerbaar CMS, multi-organisatie. UI-screenshots in browser-mockup kunnen hier wel.
  - Card Grading App — begeleide opnameflow + rapport. Screenshots of korte muted looping screen recording.
- **Projectvisuals:** elke project-tile krijgt óf een schone UI-screenshot in mockup, óf een abstracte typografische cover in de sitepalette. Consistent formaat (bv. 4:3 of 3:2) over alle tiles.
- **Skills:** compacte lijst uit CV, gegroepeerd (Frontend / Backend & data / Tools). Geen skill-percentagebalkjes.
- **Domein:** vervangt de huidige site op pepijnscheer.nl.

---

## 2. Tech stack (state this explicitly to Claude Code)

- Vite + React + TypeScript (or Astro if the site stays fully static — decide before starting)
- GSAP + ScrollTrigger (line reveals via manual line-splitting or the `SplitText`-style approach)
- Lenis for smooth scroll (integrate with ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`)
- Plain CSS modules or vanilla CSS with custom properties — avoid Tailwind defaults if the goal is a non-templated look (Tailwind is fine if tokens are customized)
- Deploy target: Cloudflare Pages (fits existing Cloudflare usage)

---

## 3. Phased build plan (one Claude Code session/prompt per phase)

**Phase 0 — Setup**
Scaffold Vite + React + TS. Install gsap + lenis. Create folder structure, add this file + CLAUDE.md + `design/references/` screenshots.

**Phase 1 — Design tokens & layout system**
Type scale (display / heading / body / label), color palette, spacing scale, 12-column grid helpers, max-widths. No content yet. Output a `/styleguide` route showing all tokens.

**Phase 2 — Static sections**
Build all sections with real content, matching the reference screenshots for spacing and placement. Zero animation. Review in browser and iterate on spacing here — this is the cheapest place to fix layout.

**Phase 3 — Animation pass**
Add Lenis, then GSAP reveals per the animation language above. One section at a time: hero load sequence → scroll reveals → parallax → hovers. Add reduced-motion handling.

**Phase 4 — Polish**
Responsive (mobile: single column, smaller display type, parallax off), performance (lazy images, font loading strategy), a11y (focus states, semantics), meta/OG tags, deploy.

---

## 4. Kickoff prompt (paste into Claude Code after Phase 0 setup)

> Read DESIGN.md and the screenshots in design/references/. We're building my portfolio in phases; do NOT add animations yet.
>
> Phase 1: create the design token system and layout primitives described in DESIGN.md — type scale, colors, spacing, 12-col grid. Add a /styleguide route that renders every token. Use CSS custom properties. Stop after Phase 1 so I can review before we build sections.

Then per later phase:

> Phase 2: build the Hero and About sections using real content from DESIGN.md. Match the spacing rhythm of design/references/hero.png. Static only.

> Phase 3: add Lenis smooth scroll and the GSAP animation vocabulary from DESIGN.md, starting with the hero load sequence only. Show me before doing the rest.

---

## 5. Tips

- "Stop after X so I can review" is the highest-leverage phrase — prevents Claude Code from sprinting past the point where cheap corrections are possible.
- When something looks off, screenshot YOUR build, drop it next to the reference screenshot, and say "compare these — the vertical spacing between hero and intro is too tight."
- Describe animations in physical terms (distance, duration, easing, stagger) rather than "make it feel premium."
- Keep DESIGN.md updated when you change direction mid-build; it's what keeps new sessions consistent.
