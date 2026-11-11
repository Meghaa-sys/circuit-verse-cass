import { ReactNode } from 'react';
import Reveal from './Reveal';

export function Section({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative scroll-mt-16 overflow-x-clip px-5 py-20 sm:px-8 md:py-28 ${className}`}>
      <div className="relative z-10 mx-auto w-full max-w-[1240px]">{children}</div>
    </section>
  );
}

export function Heading({
  eyebrow, title, accent, sub, align = 'left', color = '#FF7A2E',
}: { eyebrow: string; title: string; accent?: string; sub?: string; align?: 'left' | 'center'; color?: string }) {
  return (
    <Reveal className={`mb-12 max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <p className="tech-label mb-4 flex items-center gap-3 text-xs sm:text-[13px]" style={{ color }}>
        <span className="h-px w-10" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
        {eyebrow}
      </p>
      <h2 className="font-display text-[1.9rem] font-black uppercase leading-[1.1] tracking-wide text-white sm:text-5xl">
        {title} {accent && <span style={{ color, textShadow: `0 0 26px ${color}88` }}>{accent}</span>}
      </h2>
      {sub && <p className="mt-5 text-base leading-relaxed text-[#cdbfe6] sm:text-lg">{sub}</p>}
    </Reveal>
  );
}
