const COLORS = [
  { name: 'bg', value: '#F8F1E7', varName: '--c-bg' },
  { name: 'ink', value: '#282320', varName: '--c-ink' },
  { name: 'accent (wijnrood)', value: '#A83848', varName: '--c-accent' },
  { name: 'accent hover', value: '#7A2735', varName: '--c-accent-hover' },
  { name: 'muted', value: '#8A8178', varName: '--c-muted' },
];

const SPACES = ['--sp-1', '--sp-2', '--sp-3', '--sp-4', '--sp-5', '--sp-6', '--sp-section'];

export default function Styleguide() {
  return (
    <main className="content" style={{ maxWidth: 1200, margin: '0 auto', paddingBlock: '4rem' }}>
      <p className="label">Styleguide — design tokens</p>

      <section>
        <p className="label" style={{ marginBottom: '1rem' }}>Kleur</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {COLORS.map((c) => (
            <div key={c.varName} style={{ width: 160 }}>
              <div
                style={{
                  height: 96,
                  background: `var(${c.varName})`,
                  border: '1px solid var(--c-line)',
                }}
              />
              <p className="label" style={{ marginTop: '0.5rem' }}>{c.name}</p>
              <p className="label">{c.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="label" style={{ marginBottom: '1rem' }}>Typografie</p>
        <p className="display">Display</p>
        <h1 className="heading-1">Heading 1</h1>
        <h2 className="heading-2">Heading 2</h2>
        <p style={{ maxWidth: '56ch', marginTop: '1rem' }}>
          Body — General Sans. Ik bouw digitale producten van idee tot deploy,
          met aandacht voor zowel techniek als gebruikerservaring.
        </p>
        <p className="label" style={{ marginTop: '1rem' }}>Label — uppercase, letterspaced</p>
      </section>

      <section>
        <p className="label" style={{ marginBottom: '1rem' }}>Spacing</p>
        {SPACES.map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span className="label" style={{ width: 120 }}>{s}</span>
            <div style={{ height: 12, width: `var(${s})`, background: 'var(--c-accent)' }} />
          </div>
        ))}
      </section>

      <section>
        <p className="label" style={{ marginBottom: '1rem' }}>12-koloms grid</p>
        <div className="grid-12">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              style={{
                gridColumn: 'span 1',
                height: 64,
                background: 'rgba(168, 56, 72, 0.15)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <span className="label">{i + 1}</span>
            </div>
          ))}
        </div>
      </section>

      <p style={{ marginTop: '4rem' }}>
        <a href="/" className="link-accent">&larr; Terug naar de site</a>
      </p>
    </main>
  );
}
