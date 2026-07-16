const EXPERIENCE = [
  {
    company: 'FBI Design',
    role: 'Fullstack development',
    period: 'Stage',
    note: 'Meegebouwd aan klantprojecten, van front-end componenten tot API-koppelingen.',
  },
  {
    company: 'Studio Online',
    role: 'Webdevelopment',
    period: 'Stage',
    note: 'Websites en maatwerk-features gebouwd en opgeleverd voor uiteenlopende klanten.',
  },
];

export default function Experience() {
  return (
    <section id="ervaring" className="experience">
      <div className="grid-12">
        <p className="label experience-label" data-reveal="fade">
          Werkervaring
        </p>

        <div className="experience-list">
          {EXPERIENCE.map((e) => (
            <div className="experience-item" data-reveal="fade" key={e.company}>
              <div className="experience-row">
                <h3 className="heading-2 experience-company">{e.company}</h3>
                <span className="label">{e.period}</span>
              </div>
              <p className="label experience-role">{e.role}</p>
              <p className="experience-note">{e.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
