const SKILL_GROUPS = [
  {
    group: 'Frontend',
    items: ['React', 'TypeScript', 'JavaScript', 'HTML & CSS', 'Vite'],
  },
  {
    group: 'Backend & data',
    items: ['Node.js', 'GraphQL', 'REST APIs', 'SQL'],
  },
  {
    group: 'Tools',
    items: ['Git', 'Figma', 'Cloudflare'],
  },
];

export default function Skills() {
  return (
    <section id="vaardigheden" className="skills">
      <div className="grid-12">
        <p className="label skills-label" data-reveal="fade">
          Vaardigheden
        </p>

        <div className="skills-groups">
          {SKILL_GROUPS.map((g) => (
            <div className="skills-group" data-reveal="fade" key={g.group}>
              <h3 className="label skills-group-title">{g.group}</h3>
              <ul className="skills-list">
                {g.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
