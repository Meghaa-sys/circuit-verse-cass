import { ORGANISER, SPONSOR_MAIL, SPONSOR_SLOTS } from '../../data';
import { IeeeMark } from '../ui/Icons';
import { Heading, Section } from '../ui/Section';
import Reveal from '../ui/Reveal';
import Btn from '../ui/Btn';

export default function Sponsors() {
  return (
    <Section id="sponsors" className="bg-[#120a22]">
      <Heading align="center" eyebrow="SPONSORS & PARTNERS" title="Powered by" accent="partners" sub="Circuit Verse is organised under IEEE. Partner logos will appear here as they are confirmed." />

      <Reveal>
        <div className="mx-auto mb-12 flex max-w-md flex-col items-center rounded-2xl border border-white/15 bg-white/[.03] px-8 py-7 text-center backdrop-blur">
          <p className="tech-label mb-4 text-[10px] tracking-[0.3em] text-ember">ORGANISED BY</p>
          <IeeeMark />
          <p className="mt-2 text-white/70">{ORGANISER}</p>
        </div>
      </Reveal>

      <div className="space-y-10">
        {SPONSOR_SLOTS.map((t, ti) => (
          <Reveal key={t.tier} delay={ti * 0.08}>
            <p className="tech-label mb-4 text-center text-[11px] tracking-[0.3em] text-lav">{t.tier}</p>
            <div className={`mx-auto grid gap-4 ${t.slots === 1 ? 'max-w-xs grid-cols-1' : t.slots === 3 ? 'max-w-3xl grid-cols-1 sm:grid-cols-3' : 'max-w-4xl grid-cols-2 md:grid-cols-4'}`}>
              {Array.from({ length: t.slots }, (_, i) => (
                <div key={i} className="group grid h-24 place-items-center rounded-xl border border-dashed border-white/20 bg-white/[.02] text-white/35 transition duration-300 hover:border-ember/70 hover:text-ember hover:shadow-[0_0_30px_-8px_rgba(255,122,46,.7)] sm:h-28">
                  <span className="tech-label text-[10px] tracking-[0.25em]">Your logo here</span>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal><div className="mt-12 text-center"><Btn href={SPONSOR_MAIL} variant="outline" arrow="up">Become a sponsor</Btn></div></Reveal>
    </Section>
  );
}
