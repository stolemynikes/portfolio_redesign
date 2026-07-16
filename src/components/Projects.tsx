import { useState } from 'react';

interface Project {
  title: string;
  year: string;
  description: string;
  stack: string[];
  variant: 'abstract' | 'mockup';
  image?: string;
}

const PROJECTS: Project[] = [
  {
    title: 'EUStatement',
    year: '2024',
    description:
      'Platform rond Europese regelgeving en compliance — inhoud vertrouwelijk.',
    stack: ['React', 'TypeScript', 'Node', 'GraphQL'],
    variant: 'abstract',
  },
  {
    title: 'BCMS',
    year: '2024',
    description:
      'Configureerbaar content management systeem voor meerdere organisaties.',
    stack: ['React', 'TypeScript', 'Node'],
    variant: 'mockup',
  },
  {
    title: 'Card Grading App',
    year: '2023',
    description:
      'Begeleide opnameflow voor het beoordelen van verzamelkaarten, met automatisch rapport.',
    stack: ['React', 'TypeScript'],
    variant: 'mockup',
  },
];

/**
 * Hover-expand project shelf (Skiper35-style): panels share a row, the
 * active one springs open while siblings compress. Hover expands on
 * desktop; tap/click and keyboard focus drive it elsewhere.
 */
export default function Projects() {
  const [active, setActive] = useState(0);

  return (
    <section id="projecten" className="projects">
      <p className="label" data-reveal="fade">
        Projecten
      </p>

      <div className="shelf" data-reveal="fade">
        {PROJECTS.map((p, i) => {
          const isActive = i === active;
          return (
            <article
              key={p.title}
              className={`shelf-item shelf-variant-${p.variant} ${isActive ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
            >
              <button
                type="button"
                className="shelf-hit"
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-expanded={isActive}
                aria-label={`${p.title}, ${p.year}`}
              >
                {/* Collapsed state: vertical spine label */}
                <span className="shelf-spine label" aria-hidden="true">
                  {p.title} — {p.year}
                </span>

                {/* Cover art */}
                {p.variant === 'abstract' ? (
                  <span className="shelf-cover shelf-cover-abstract" aria-hidden="true">
                    <span className="shelf-ghost">{p.title}</span>
                  </span>
                ) : (
                  <span className="shelf-cover shelf-cover-mockup" aria-hidden="true">
                    <span className="shelf-mockup">
                      <span className="shelf-mockup-chrome">
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className="shelf-mockup-viewport">
                        {p.image ? (
                          <img src={p.image} alt="" loading="lazy" />
                        ) : (
                          <span className="label">screenshot volgt</span>
                        )}
                      </span>
                    </span>
                  </span>
                )}

                {/* Expanded meta */}
                <span className="shelf-meta">
                  <span className="shelf-meta-row">
                    <span className="shelf-title">{p.title}</span>
                    <span className="label shelf-year">{p.year}</span>
                  </span>
                  <span className="shelf-description">{p.description}</span>
                  <span className="label shelf-stack">{p.stack.join(' · ')}</span>
                </span>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
