import { PILLARS } from '../../data';
import { ICONS } from '../ui/iconMap';
import { Heading, Section } from '../ui/Section';
import Reveal from '../ui/Reveal';
import TiltCard from '../ui/TiltCard';
import { CircuitWallpaper } from '../ui/Traces';

function OrbitVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]" aria-hidden>
      <div className="absolute inset-[8%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(168,85,247,.35), rgba(255,122,46,.12) 45%, transparent 68%)', filter: 'blur(22px)' }} />
      {[100, 78, 56].map((s, i) => (
        <div key={s} className="absolute rounded-full border"
          style={{
            inset: `${(100 - s) / 2}%`, borderColor: i === 1 ? 'rgba(168,85,247,.5)' : 'rgba(255,122,46,.45)',
            borderStyle: i === 1 ? 'dashed' : 'solid', boxShadow: i === 0 ? '0 0 30px rgba(255,122,46,.25), inset 0 0 30px rgba(255,122,46,.1)' : undefined,
            animation: `orbit ${30 - i * 8}s linear infinite ${i === 1 ? 'reverse' : ''}`,
          }}>
          <span className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-ember shadow-[0_0_14px_3px_#FF7A2E]" />
          {i === 1 && <span className="absolute -bottom-[5px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-lav shadow-[0_0_12px_3px_#A855F7]" />}
        </div>
      ))}
      <img src="/assets/logo-infinity.webp" alt="" className="floaty absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2"
        style={{ filter: 'drop-shadow(0 0 16px rgba(168,85,247,.7)) drop-shadow(0 0 34px rgba(216,180,255,.35))' }} />
      <style>{`@keyframes orbit{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function About() {
  return (
    <Section id="about" className="bg-gradient-to-b from-night to-[#120a22]">
      <CircuitWallpaper />
      <Heading eyebrow="ABOUT // CIRCUIT VERSE" title="Where circuits become" accent="solutions" />
      <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Reveal>
            <p className="max-w-2xl text-lg leading-relaxed text-[#d9cdee]">
              Circuit Verse is a two-part odyssey into electronics, systems and ideas. It begins with a hands-on <strong className="text-ember">Workshop</strong> where
              you learn by building, and culminates in a <strong className="text-neon">Hackathon</strong> where you prototype solutions to real-world challenges.
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#d9cdee]">
              Whether you are wiring your first LED or shipping your tenth prototype, Circuit Verse gives you the mentors, the hardware mindset and the community
              to take an idea from schematic to something that works.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {PILLARS.map((p, i) => {
              const Icon = ICONS[p.icon];
              return (
                <Reveal key={p.title} delay={i * 0.1}>
                  <TiltCard as="div" color={i === 1 ? '#A855F7' : '#FF7A2E'} variant="tilt" className="h-full min-h-[220px]">
                    <div className="p-6">
                      <Icon size={30} className={i === 1 ? 'text-neon' : 'text-ember'} strokeWidth={1.7} />
                      <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-wider text-white">{p.title}</h3>
                      <p className="mt-2 text-[0.93rem] leading-relaxed text-white/75">{p.text}</p>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
        <Reveal x={30}><OrbitVisual /></Reveal>
      </div>
    </Section>
  );
}
