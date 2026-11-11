import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { TIMELINE } from '../../data';
import { Heading, Section } from '../ui/Section';
import Reveal from '../ui/Reveal';

export default function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 55%'] });
  const grow = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <Section id="timeline" className="bg-gradient-to-b from-[#120a22] to-night">
      <Heading align="center" eyebrow="TIMELINE // MISSION LOG" title="The" accent="odyssey" sub="From first sign-up to the final demo — every phase of Circuit Verse at a glance. Dates will be confirmed soon." />
      <div ref={ref} className="relative mx-auto max-w-4xl">
        {/* rail */}
        <div className="absolute bottom-0 left-[19px] top-0 w-[2px] bg-white/10 md:left-1/2 md:-translate-x-1/2" />
        <motion.div className="absolute left-[19px] top-0 w-[2px] origin-top bg-gradient-to-b from-ember to-[#FFB074] shadow-[0_0_14px_2px_#FF7A2E] md:left-1/2 md:-translate-x-1/2"
          style={{ scaleY: grow, height: '100%' }} />
        <ol className="space-y-10 md:space-y-14">
          {TIMELINE.map((t, i) => {
            const left = i % 2 === 0;
            return (
              <li key={t.title} className="relative pl-14 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
                <span className="absolute left-[10px] top-6 grid h-5 w-5 place-items-center rounded-full border-2 border-ember bg-night shadow-[0_0_16px_3px_rgba(255,122,46,.7)] md:left-1/2 md:-translate-x-1/2">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                </span>
                <Reveal x={left ? -30 : 30} className={left ? 'md:col-start-1 md:text-right' : 'md:col-start-2'}>
                  <div className="group relative rounded-xl border border-white/10 bg-gradient-to-br from-[#1b1030]/90 to-night/80 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-ember/60 hover:shadow-[0_0_40px_-10px_rgba(255,122,46,.7)]">
                    <p className="tech-label text-[11px] tracking-[0.3em] text-ember">{t.when}</p>
                    <h3 className="mt-2 font-display text-lg font-bold uppercase tracking-wide text-white">{t.title}</h3>
                    <p className="mt-2 text-white/72">{t.text}</p>
                    <p className="tech-label mt-4 inline-block rounded border border-lav/25 px-2.5 py-1 text-[10px] tracking-[0.22em] text-lav">{t.date}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
