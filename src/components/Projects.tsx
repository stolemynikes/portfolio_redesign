interface Project {
  title: string;
  year: string;
  description: string;
  stack: string[];
  cover: 'abstract' | 'mockup';
  image?: string;
}

const PROJECTS: Project[] = [
  {
    title: 'EUStatement',
    year: '2024',
    description:
      'Platform rond Europese regelgeving en compliance — inhoud vertrouwelijk.',
    stack: ['React', 'TypeScript', 'Node', 'GraphQL'],
    cover: 'abstract',
  },
  {
    title: 'BCMS',
    year: '2024',
    description:
      'Configureerbaar content management systeem voor meerdere organisaties.',
    stack: ['React', 'TypeScript', 'Node'],
    cover: 'mockup',
  },
  {
    title: 'Card Grading App',
    year: '2023',
    description:
      'Begeleide opnameflow voor het beoordelen van verzamelkaarten, met automatisch rapport.',
    stack: ['React', 'TypeScript'],
    cover: 'mockup',
  },
];

/** Abstract typographic cover in the site palette (for confidential work). */
function AbstractCover({ title }: { title: string }) {
  return (
    <div className="project-cover project-cover-abstract media-fill" aria-hidden="true">
      <span className="project-cover-type">{title}</span>
      <span className="project-cover-type project-cover-type-ghost">{title}</span>
    </div>
  );
}

/** Browser-mockup cover; shows a quiet placeholder until screenshots land. */
function MockupCover({ title, image }: { title: string; image?: string }) {
  return (
    <div className="project-cover project-cover-mockup media-fill" aria-hidden="true">
      <div className="mockup-chrome">
        <span /><span /><span />
      </div>
      <div className="mockup-viewport">
        {image ? (
          <img src={image} alt="" loading="lazy" />
        ) : (
          <span className="mockup-placeholder label">{title} — screenshot volgt</span>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projecten" className="projects">
      <p className="label" data-reveal="fade">
        Projecten
      </p>

      <div className="projects-grid">
        {PROJECTS.map((p) => (
          <article className="project" key={p.title}>
            <a href="#contact" className="project-link" aria-label={`${p.title} — vraag meer informatie`}>
              <div className="project-media" data-reveal-media>
                {p.cover === 'abstract' ? (
                  <AbstractCover title={p.title} />
                ) : (
                  <MockupCover title={p.title} image={p.image} />
                )}
              </div>
              <div className="project-meta">
                <h3 className="project-title">{p.title}</h3>
                <span className="label">{p.year}</span>
              </div>
              <p className="project-description">{p.description}</p>
              <p className="label project-stack">{p.stack.join(' · ')}</p>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
