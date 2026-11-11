import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FAQS, SPONSOR_MAIL } from '../../data';
import { Heading, Section } from '../ui/Section';
import Reveal from '../ui/Reveal';
import Btn from '../ui/Btn';

export default function Faqs() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faqs" className="bg-gradient-to-b from-night to-[#120a22]">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Heading eyebrow="FAQS // QUERY.LOG" title="Got" accent="questions?" sub="Quick answers about eligibility, teams and what to expect. Can't find yours? Ask the organisers." />
          <Reveal><Btn href={SPONSOR_MAIL.replace('Sponsoring%20IEEE%20Circuit%20Verse', 'Question%20about%20Circuit%20Verse')} variant="ghost" arrow="up">Ask the organisers</Btn></Reveal>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const on = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05}>
                <div className={`overflow-hidden rounded-xl border transition-all duration-300 ${on ? 'border-ember/70 bg-ember/[.06] shadow-[0_0_40px_-12px_rgba(255,122,46,.7)]' : 'border-white/10 bg-white/[.03] hover:border-white/25'}`}>
                  <h3>
                    <button type="button" aria-expanded={on} aria-controls={`faq-${i}`} id={`faq-btn-${i}`} onClick={() => setOpen(on ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6">
                      <span className="font-semibold text-white sm:text-lg">{f.q}</span>
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${on ? 'rotate-45 border-ember bg-ember text-night' : 'border-white/25 text-white'}`}><Plus size={18} /></span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div id={`faq-${i}`} role="region" aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}>
                        <p className="px-5 pb-6 leading-relaxed text-white/75 sm:px-6">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
