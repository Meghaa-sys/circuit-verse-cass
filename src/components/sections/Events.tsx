import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { HACKATHON, REGISTER_URL, WORKSHOP } from '../../data';
import { ICONS } from '../ui/iconMap';
import { ChipIcon, CodeIcon } from '../ui/Icons';
import { Heading, Section } from '../ui/Section';
import Reveal from '../ui/Reveal';
import TiltCard from '../ui/TiltCard';
import Btn from '../ui/Btn';
import { CircuitWallpaper } from '../ui/Traces';

/* ───────── overview ───────── */
export function EventsOverview() {
  const rows = [
    ['Focus', 'Learn core circuit & systems skills', 'Build a working solution to a real problem'],
    ['You will', 'Build and debug hands-on', 'Prototype, test and pitch in a team'],
    ['You leave with', 'Practical skills and a prototype', 'A demo, feedback and a shot at the prizes'],
  ];
  return (
    <Section id="events" className="bg-[#120a22]">
      <CircuitWallpaper />
      <Heading eyebrow="EVENTS // CHOOSE YOUR PATH" title="Two experiences." accent="One Circuit Verse." sub="Join the Workshop, the Hackathon, or take the full odyssey. Each part stands on its own and is stronger together." />
      <div className="grid gap-6 md:grid-cols-2">
        {[{ c: '#FF7A2E', n: 'Workshop', Icon: ChipIcon, i: 1, href: '#workshop' }, { c: '#A855F7', n: 'Hackathon', Icon: CodeIcon, i: 2, href: '#hackathon' }].map((e) => (
          <Reveal key={e.n} delay={e.i === 2 ? 0.12 : 0}>
            <TiltCard href={e.href} color={e.c} variant={e.i === 1 ? 'lift' : 'tilt'} className="h-full min-h-[320px]" label={`${e.n} details`}>
              <div className="p-7 sm:p-9">
                <div className="flex items-center gap-4">
                  <e.Icon size={54} />
                  <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-white">{e.n}</h3>
                </div>
                <dl className="mt-7 space-y-5">
                  {rows.map((r) => (
                    <div key={r[0]} className="border-t border-white/10 pt-4">
                      <dt className="tech-label text-[11px] tracking-[0.25em]" style={{ color: e.c }}>{r[0]}</dt>
                      <dd className="mt-1 text-white/85">{r[e.i]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ───────── animated schematic (workshop visual) ───────── */
function Schematic() {
  const wire = 'M60 60H150L160 44L176 76L192 44L208 76L224 44L234 60H360V105M360 155V200H60V155M60 105V60';
  return (
    <svg viewBox="0 0 420 260" className="h-auto w-full" fill="none" role="img" aria-label="Animated schematic: battery, resistor and glowing LED">
      <defs>
        <radialGradient id="led" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FF7A2E" stopOpacity=".9" /><stop offset="1" stopColor="#FF7A2E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g stroke="#FF7A2E" strokeOpacity=".55" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"><path d={wire} /></g>
      <g stroke="#FFD2A8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px #FF7A2E)' }}>
        <path d={wire} className="trace-flow" />
      </g>
      {/* LED */}
      <circle cx="360" cy="130" r="46" fill="url(#led)" className="node-pulse" style={{ animationDuration: '1.8s' }} />
      <g stroke="#FF9A58" strokeWidth="2.4" strokeLinejoin="round"><path d="M344 105H376L360 135Z" fill="rgba(255,122,46,.35)" /><path d="M342 137H378" /></g>
      <g stroke="#FF9A58" strokeWidth="2" strokeLinecap="round"><path d="M384 108l12-12m-10 4 10-1-1 10" /><path d="M394 124l12-12m-10 4 10-1-1 10" opacity=".7" /></g>
      {/* battery */}
      <g stroke="#D8B4FF" strokeWidth="2.6" strokeLinecap="round"><path d="M42 120H78" /><path d="M50 136H70" strokeWidth="5" /></g>
      {/* labels */}
      <g fontFamily="Space Mono, monospace" fontSize="11" fill="#D8B4FF" letterSpacing="1.5">
        <text x="150" y="28">R1 · 330Ω</text><text x="288" y="156">D1 · LED</text><text x="96" y="134">V1 · 9V</text>
        <text x="40" y="232" fill="#FF9A58">I = V / R</text>
      </g>
      <g fill="#0D0A1A" stroke="#FF7A2E" strokeWidth="1.8">
        <circle cx="60" cy="60" r="4.5" /><circle cx="360" cy="60" r="4.5" /><circle cx="360" cy="200" r="4.5" /><circle cx="60" cy="200" r="4.5" />
      </g>
    </svg>
  );
}

function Facts({ facts, color }: { facts: { k: string; v: string }[]; color: string }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
      {facts.map((f) => (
        <div key={f.k} className="border-l-2 pl-4" style={{ borderColor: color }}>
          <dt className="tech-label text-[10px] tracking-[0.28em] text-white/50">{f.k}</dt>
          <dd className="mt-1 font-semibold text-white">{f.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ───────── workshop ───────── */
export function WorkshopSection() {
  return (
    <Section id="workshop" className="bg-gradient-to-b from-[#120a22] to-night">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-ember/20 blur-[130px]" />
      <Heading eyebrow="PART 01 // WORKSHOP" title="Build skills." accent="Hands-on." sub={WORKSHOP.blurb} />
      <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <TiltCard as="div" color="#FF7A2E" variant="lift" className="min-h-[420px]">
            <div className="p-7 sm:p-9">
              <h3 className="font-display text-xl font-bold uppercase tracking-wider text-white">What you will learn</h3>
              <ul className="mt-6 space-y-4">
                {WORKSHOP.learn.map((l, i) => (
                  <motion.li key={l} initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 * i + 0.2 }}
                    className="flex gap-3 text-white/85">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded bg-ember/15 text-ember"><Check size={15} strokeWidth={3} /></span>
                    {l}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-9 border-t border-white/10 pt-7"><Facts facts={WORKSHOP.facts} color="#FF7A2E" /></div>
              <div className="mt-8"><Btn href={REGISTER_URL} arrow="up" magnetic>Register for Workshop</Btn></div>
            </div>
          </TiltCard>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="relative rounded-2xl border border-ember/25 bg-gradient-to-br from-[#1d1030] to-night p-5 shadow-[0_0_70px_-20px_rgba(255,122,46,.5)] sm:p-8">
            <p className="tech-label mb-3 text-[11px] tracking-[0.3em] text-ember">LIVE.SCHEMATIC</p>
            <Schematic />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ───────── hackathon + tracks ───────── */
const TERMINAL = [
  ['$', 'circuitverse --init hackathon'],
  ['>', 'loading problem statements ... ok'],
  ['>', 'team.lock()           // squad ready'],
  ['>', 'build.start()         // 🔧 prototype mode'],
  ['>', 'mentors.sync()        // feedback loop'],
  ['>', 'demo.present()        // show the world'],
];

export function HackathonSection() {
  return (
    <>
      <Section id="hackathon" className="bg-night">
        <div aria-hidden className="pointer-events-none absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-neon/25 blur-[140px]" />
        <Heading color="#A855F7" eyebrow="PART 02 // HACKATHON" title="Innovate." accent="Prototype. Solve." sub={HACKATHON.blurb} />
        <div className="grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-neon/35 bg-[#0b0716] shadow-[0_0_70px_-18px_rgba(168,85,247,.6)]">
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/[.03] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" /><span className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="tech-label ml-3 text-[10px] tracking-[0.25em] text-white/45">hack.sh</span>
              </div>
              <div className="min-h-[300px] space-y-3 p-5 font-mono text-[13px] sm:p-7 sm:text-sm">
                {TERMINAL.map(([p, t], i) => (
                  <motion.p key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.35 * i + 0.2 }}
                    className={p === '$' ? 'text-white' : 'text-lav/90'}>
                    <span className="mr-3 text-ember">{p}</span>{t}
                  </motion.p>
                ))}
                <p className="text-ember"><span className="mr-3">{'>'}</span><span className="blink inline-block h-4 w-2 translate-y-0.5 bg-ember" /></p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <TiltCard as="div" color="#A855F7" variant="tilt" className="min-h-[300px]">
              <div className="p-7 sm:p-9">
                <h3 className="font-display text-xl font-bold uppercase tracking-wider text-white">Event details</h3>
                <div className="mt-6"><Facts facts={HACKATHON.facts} color="#A855F7" /></div>
                <p className="mt-7 text-white/75">Pick a track, form a team and build under pressure — then pitch a working prototype to the judging panel.</p>
                <div className="mt-8"><Btn href={REGISTER_URL} arrow="up" magnetic>Register for Hackathon</Btn></div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </Section>

      <Section id="tracks" className="bg-gradient-to-b from-night to-[#120a22] !pt-8">
        <Heading color="#A855F7" eyebrow="TRACKS // PICK YOUR BATTLEFIELD" title="Hackathon" accent="tracks" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HACKATHON.tracks.map((t, i) => {
            const Icon = ICONS[t.icon];
            const c = i % 2 ? '#A855F7' : '#FF7A2E';
            return (
              <Reveal key={t.name} delay={i * 0.08}>
                <TiltCard as="div" color={c} variant="tilt" className="h-full min-h-[250px]">
                  <div className="p-6">
                    <span className="tech-label text-[10px] tracking-[0.3em] text-white/40">TRACK 0{i + 1}</span>
                    <Icon size={32} className="mt-4" style={{ color: c }} strokeWidth={1.6} />
                    <h3 className="mt-4 font-display text-[1.05rem] font-bold uppercase leading-snug tracking-wide text-white">{t.name}</h3>
                    <p className="mt-3 text-[0.92rem] leading-relaxed text-white/72">{t.text}</p>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-white/45">Tracks are indicative and may be refined before the event.</p>
      </Section>
    </>
  );
}
