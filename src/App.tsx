import { useEffect } from 'react';
import { initLenis, initSectionReveals, ScrollTrigger } from './lib/motion';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Statements from './components/Statements';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Footer from './components/Footer';
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
      <Sidebar />
      <main className="content">
        <Hero />
        <About />
        <Projects />
        <Statements />
        <Experience />
        <Skills />
        <Footer />
      </main>
    </div>
  );
}
