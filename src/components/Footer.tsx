export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <h2 className="display footer-statement" data-reveal="lines">
        Ik bouw digitale producten van idee tot deploy
      </h2>

      <div className="footer-cta" data-reveal="fade">
        <a href="mailto:contact@pepijnscheer.nl" className="link-accent footer-cta-link">
          Stuur een bericht&nbsp;&rarr;
        </a>
      </div>

      <div className="footer-bottom">
        <span className="label">&copy; {new Date().getFullYear()} Pepijn Scheer</span>
        <a
          href="https://github.com/pepijnscheer"
          className="label link-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
