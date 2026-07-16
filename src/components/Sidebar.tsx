const NAV = [
  { href: '#over-mij', label: 'Over mij' },
  { href: '#projecten', label: 'Projecten' },
  { href: '#ervaring', label: 'Ervaring' },
  { href: '#vaardigheden', label: 'Vaardigheden' },
  { href: '#contact', label: 'Contact' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <a href="#top" className="sidebar-logo" aria-label="Naar boven">
        Pepijn<span className="sidebar-logo-accent">.</span>
      </a>

      <nav className="sidebar-nav" aria-label="Hoofdnavigatie">
        {NAV.map((item) => (
          <a key={item.href} href={item.href} className="sidebar-link">
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-meta">
        <p className="label">Nederland</p>
        <p className="label sidebar-available">
          <span className="sidebar-dot" aria-hidden="true" />
          Beschikbaar voor duaal (HBO-ICT)
        </p>
      </div>
    </aside>
  );
}
