export default function About() {
  return (
    <section id="over-mij" className="about">
      <div className="grid-12">
        <p className="label about-label" data-reveal="fade">
          Over mij
        </p>

        <h2 className="heading-2 about-heading" data-reveal="lines">
          Praktisch, gedreven en het snelst lerend door te bouwen
        </h2>

        <div className="about-body" data-reveal="fade">
          <p>
            Ik ben Pepijn — fullstack developer met een voorkeur voor de
            volledige breedte: van datamodel en API tot interface. Bij een
            idee begin ik liever met bouwen dan met praten; werkende software
            is voor mij de beste manier om te leren én om te laten zien wat
            kan.
          </p>
          <p>
            Ik werk het meest met React, TypeScript en Node, en voel me thuis
            in projecten waar zowel techniek als gebruikerservaring ertoe
            doen — van datamodel en API tot de laatste pixel van de
            interface.
          </p>
        </div>

        <div className="about-media" data-reveal-media data-parallax="10">
          <img
            src="/assets/portret-2.jpg"
            alt="Portret van Pepijn Scheer"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
