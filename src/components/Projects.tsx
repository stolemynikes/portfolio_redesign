import { useEffect, useState } from 'react';
import { fetchProjects, type ApiProject } from '../lib/apero';

type Project = ApiProject;

// Shown immediately and kept if the API isn't configured or the request
// fails — the section never breaks or shows a loading flash.
const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'eustatement',
    title: 'EUStatement',
    year: '2024',
    description:
      'Platform rond Europese regelgeving en compliance, inhoud vertrouwelijk.',
    stack: ['React', 'TypeScript', 'Node', 'GraphQL'],
    variant: 'abstract',
  },
  {
    id: 'bcms',
    title: 'BCMS',
    year: '2024',
    description:
      'Configureerbaar content management systeem voor meerdere organisaties.',
    stack: ['React', 'TypeScript', 'Node'],
    variant: 'mockup',
  },
  {
    id: 'card-grading-app',
    title: 'Card Grading App',
    year: '2023',
    description:
      'Begeleide opnameflow voor het beoordelen van verzamelkaarten, met automatisch rapport.',
    stack: ['React', 'TypeScript'],
    variant: 'mockup',
  },
];

const hasMeta = (p: Project) => Boolean(p.year || p.description || p.stack?.length);

/** Apero CMS is always shown first, wherever the API returns it. */
function withAperoFirst(list: Project[]): Project[] {
  const i = list.findIndex((p) => p.title.trim().toLowerCase() === 'apero cms');
  if (i <= 0) return list;
  const copy = [...list];
  const [entry] = copy.splice(i, 1);
  copy.unshift(entry);
  return copy;
}

/**
 * Hover-expand project shelf (Skiper35-style): panels share a row, the
 * active one springs open while siblings compress. Hover expands on
 * desktop; tap/click and keyboard focus drive it elsewhere.
 */
export default function Projects() {
  const [active, setActive] = useState(0);
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);

  useEffect(() => {
    fetchProjects().then((live) => {
      if (live) setProjects(withAperoFirst(live));
    });
  }, []);

  return (
    <section id="projecten" className="projects">
      <p className="label" data-reveal="fade">
        Projecten
      </p>

      <div className="shelf" data-reveal="fade">
        {projects.map((p, i) => {
          const isActive = i === active;

          // A card that links out uses a real <a> as its hit target (so
          // it's genuinely navigable, not a link nested inside a button —
          // invalid HTML). Collapsed cards still just expand: navigation
          // is suppressed until the card is already open.
          const activate = () => setActive(i);
          const onHitClick = (e: React.MouseEvent) => {
            if (!isActive) {
              e.preventDefault();
              activate();
            }
          };

          const hitProps = {
            className: 'shelf-hit',
            onClick: onHitClick,
            onFocus: activate,
            'aria-expanded': isActive,
            'aria-label': p.year ? `${p.title}, ${p.year}` : p.title,
          } as const;

          const content = (
            <>
              {/* Collapsed state: vertical spine label */}
              <span className="shelf-spine label" aria-hidden="true">
                {p.title}
                {p.year ? `, ${p.year}` : ''}
              </span>

              {/* Cover art — full-bleed photo, always visible (collapsed
                  spine and expanded alike), per the shelf's original
                  hover-reveal-gallery reference */}
              {p.variant === 'abstract' ? (
                <span className="shelf-cover shelf-cover-abstract" aria-hidden="true">
                  <span className="shelf-ghost">{p.title}</span>
                </span>
              ) : (
                <span className="shelf-cover shelf-cover-mockup" aria-hidden="true">
                  {p.image ? (
                    <img src={p.image} alt="" loading="lazy" className="shelf-cover-image" />
                  ) : (
                    <span className="label shelf-cover-placeholder">screenshot volgt</span>
                  )}
                </span>
              )}

              {/* Expanded meta */}
              <span className="shelf-meta">
                <span className="shelf-meta-row">
                  <span className="shelf-title">{p.title}</span>
                  {p.year && <span className="label shelf-year">{p.year}</span>}
                </span>
                {p.description && <span className="shelf-description">{p.description}</span>}
                {p.stack?.length ? (
                  <span className="label shelf-stack">{p.stack.join(' · ')}</span>
                ) : null}
                {!hasMeta(p) && p.link && (
                  <span className="label shelf-visit">Bekijk project ↗</span>
                )}
              </span>
            </>
          );

          return (
            <article
              key={p.id}
              className={`shelf-item shelf-variant-${p.variant} ${isActive ? 'is-active' : ''}`}
              // Real mice only: iPads emulate hover on tap and then swallow
              // the click when the handler mutates layout, so touch relies
              // purely on the hit target's onClick.
              onPointerEnter={(e) => e.pointerType === 'mouse' && activate()}
            >
              {p.link ? (
                <a href={p.link} target="_blank" rel="noopener noreferrer" {...hitProps}>
                  {content}
                </a>
              ) : (
                <button type="button" {...hitProps}>
                  {content}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
