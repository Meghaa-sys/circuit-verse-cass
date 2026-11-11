import { Trophy } from 'lucide-react';
import { BENEFITS, PRIZES } from '../../data';
import { ICONS } from '../ui/iconMap';
import { Heading, Section } from '../ui/Section';
import Reveal from '../ui/Reveal';
import TiltCard from '../ui/TiltCard';
import { CircuitWallpaper } from '../ui/Traces';

export default function Prizes() {
  const h = { 1: 'md:min-h-[330px]', 2: 'md:min-h-[280px]', 3: 'md:min-h-[250px]' } as const;
  const col = { 1: '#FF7A2E', 2: '#D8B4FF', 3: '#A855F7' } as const;
  return (
    <Section id="prizes" className="bg-night">
      <CircuitWallpaper />
      <Heading align="center" eyebrow="PRIZES & BENEFITS" title="Rewards worth" accent="building for" sub="Podium prizes for the best prototypes — and benefits for everyone who shows up. Prize details will be announced soon." />

      <div className="mx-auto grid max-w-4xl items-end gap-5 md:grid-cols-3">
        {PRIZES.map((p, i) => (
          <Reveal key={p.place} delay={i * 0.1} className={p.tier === 1 ? 'order-1 md:order-2' : p.tier === 2 ? 'order-2 md:order-1' : 'order-3'}>
            <TiltCard as="div" color={col[p.tier as 1 | 2 | 3]} variant={p.tier === 1 ? 'lift' : 'tilt'} className={`${h[p.tier as 1 | 2 | 3]} min-h-[200px]`}>
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <Trophy size={p.tier === 1 ? 46 : 36} style={{ color: col[p.tier as 1 | 2 | 3], filter: `drop-shadow(0 0 12px ${col[p.tier as 1 | 2 | 3]})` }} strokeWidth={1.6} />
                <p className="mt-4 font-display text-5xl font-black text-white" style={{ textShadow: `0 0 24px ${col[p.tier as 1 | 2 | 3]}aa` }}>{p.place}</p>
                <p className="mt-2 font-display text-sm font-bold uppercase tracking-widest text-white/90">{p.title}</p>
                <p className="tech-label mt-3 text-[10px] tracking-[0.25em] text-white/50">{p.amount}</p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b, i) => {
          const Icon = ICONS[b.icon];
          return (
            <Reveal key={b.title} delay={(i % 3) * 0.08}>
              <div className="group flex h-full gap-4 rounded-xl border border-white/10 bg-white/[.03] p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-ember/55 hover:bg-ember/[.06] hover:shadow-[0_0_36px_-10px_rgba(255,122,46,.7)]">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-ember/12 text-ember transition group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,122,46,.6)]"><Icon size={24} strokeWidth={1.8} /></span>
                <div><h3 className="font-semibold text-white">{b.title}</h3><p className="mt-1 text-sm leading-relaxed text-white/68">{b.text}</p></div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
