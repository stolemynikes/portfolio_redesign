const STATEMENTS = [
  'Ik bouw van database tot pixel.',
  'Werkende software boven mooie plannen.',
  'Leren door te maken.',
];

export default function Statements() {
  return (
    <section className="statements" aria-label="Statements">
      {STATEMENTS.map((s) => (
        <h2 className="heading-1 statement" data-reveal="lines" key={s}>
          {s}
        </h2>
      ))}
    </section>
  );
}
