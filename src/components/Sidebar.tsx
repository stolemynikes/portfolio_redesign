import { useEffect, useState } from 'react';

const NAV = [
  { href: '#over-mij', label: 'Over mij' },
  { href: '#projecten', label: 'Projecten' },
  { href: '#contact', label: 'Contact' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  // Lock background scroll while the mobile menu is open
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
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

        <button
          type="button"
          className={`burger ${open ? 'is-open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Menu sluiten' : 'Menu openen'}
        >
          <span />
          <span />
        </button>

        <div className="sidebar-meta">
          <p className="label">Nederland</p>
        </div>
      </aside>

      <nav
        id="mobile-menu"
        className={`mobile-menu ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
        aria-label="Mobiele navigatie"
      >
        <div className="mobile-menu-links">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className="mobile-menu-link"
              style={{ transitionDelay: open ? `${0.18 + i * 0.07}s` : '0s' }}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
