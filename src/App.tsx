import { useCallback, useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import gsap from 'gsap';
import Splash from './components/Splash';
import Navbar from './components/Navbar';
import Hero from './components/hero/Hero';
import CursorGlow from './components/ui/CursorGlow';
import About from './components/sections/About';
import { EventsOverview, HackathonSection, WorkshopSection } from './components/sections/Events';
import Timeline from './components/sections/Timeline';
import Prizes from './components/sections/Prizes';
import Faqs from './components/sections/Faqs';
import Sponsors from './components/sections/Sponsors';
import RegisterCta from './components/sections/RegisterCta';
import Footer from './components/Footer';
import { intro, introSeen, markIntroSeen } from './lib/intro';
import { pickQuality, useIsMobile, usePrefersReducedMotion } from './lib/env';
import { startLenis, stopLenis } from './lib/lenis';

export default function App() {
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const quality = useMemo(() => pickQuality(reduced, mobile), [reduced, mobile]);

  // Splash plays once per browsing session, and never for reduced-motion users.
  const [splash, setSplash] = useState(() => {
    const skip = introSeen() || window.matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).get('intro') === 'off';
    if (!skip) intro.p = 0;
    return !skip;
  });

  useEffect(() => {
    if (splash) {
      document.documentElement.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    }
  }, [splash]);

  // smooth scrolling (not for reduced-motion users)
  useEffect(() => {
    if (splash || reduced) return;
    startLenis();
    return () => stopLenis();
  }, [splash, reduced]);

  const onExit = useCallback(() => {
    markIntroSeen();
    gsap.to(intro, { p: 1, duration: quality === 'static' ? 0.01 : 2.6, ease: 'none' });
  }, [quality]);
  const onDone = useCallback(() => {
    document.documentElement.style.overflow = '';
    setSplash(false);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-ember focus:px-4 focus:py-2 focus:text-night">
        Skip to content
      </a>
      <Navbar />
      <CursorGlow />
      <main id="main">
        <Hero quality={quality} mobile={mobile} />
        <About />
        <EventsOverview />
        <WorkshopSection />
        <HackathonSection />
        <Timeline />
        <Prizes />
        <Faqs />
        <Sponsors />
        <RegisterCta />
      </main>
      <Footer />
      {splash && <Splash onExit={onExit} onDone={onDone} mobile={mobile} />}
    </MotionConfig>
  );
}
