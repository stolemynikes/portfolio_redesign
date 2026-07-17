import { useEffect } from 'react';
import { initLenis, initSectionReveals, ScrollTrigger } from './lib/motion';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Footer from './components/Footer';
import FloatingContact from './components/FloatingContact';
import RippleGrid from './components/RippleGrid';
import CustomCursor from './components/CustomCursor';
import Styleguide from './components/Styleguide';

export default function App() {
  const isStyleguide = window.location.pathname === '/styleguide';

  useEffect(() => {
    if (isStyleguide) return;
    const cleanupLenis = initLenis();
    // Wait for fonts so line-splitting measures final layout
    document.fonts.ready.then(() => {
      initSectionReveals();
      ScrollTrigger.refresh();
    });
    return () => {
      cleanupLenis?.();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [isStyleguide]);

  if (isStyleguide) return <Styleguide />;

  return (
    <div className="shell">
      {/* Lens displacement filter for backdrop-filter (Chromium only).
          The 2x2 ramp image bilinearly encodes X/Y offsets that magnify
          the backdrop like glass. */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <filter id="glass-lens" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAE0lEQVR4nGNgYGD4zwAm/v9nAAAT+gP9tHo/OwAAAABJRU5ErkJggg=="
            preserveAspectRatio="none"
            result="map"
          />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="36" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div className="backdrop" aria-hidden="true" />
      <RippleGrid />
      <Sidebar />
      <main className="content">
        <Hero />
        <About />
        <Projects />
        <Footer />
      </main>
      <FloatingContact />
      <CustomCursor />
    </div>
  );
}
