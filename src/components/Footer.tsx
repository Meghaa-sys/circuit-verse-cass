import { NAV, ORGANISER, SPONSOR_MAIL } from '../data';
import { IeeeMark } from './ui/Icons';
import { TraceDivider } from './ui/Traces';
import { scrollToTarget } from '../lib/lenis';

export default function Footer() {
  return (
    <footer className="relative bg-night px-5 pb-10 pt-6 sm:px-8">
      <TraceDivider className="mx-auto max-w-[1240px]" />
      <div className="mx-auto mt-12 grid max-w-[1240px] gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <IeeeMark />
          <p className="mt-4 text-white/80">{ORGANISER}</p>
          <p className="tech-label mt-2 text-[11px] tracking-[0.25em] text-ember">Advancing Technology for Humanity</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">
            Circuit Verse — a two-part tech odyssey to build skills, innovate, and turn circuit ideas into real solutions.
          </p>
        </div>
        <nav aria-label="Footer">
          <h3 className="tech-label text-[11px] tracking-[0.3em] text-lav">Explore</h3>
          <ul className="mt-4 space-y-3">
            {[...NAV, { label: 'Workshop', href: '#workshop' }, { label: 'Hackathon', href: '#hackathon' }].map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={(e) => { e.preventDefault(); scrollToTarget(n.href); }} className="text-white/70 transition hover:text-ember">{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h3 className="tech-label text-[11px] tracking-[0.3em] text-lav">Contact</h3>
          <ul className="mt-4 space-y-3 text-white/70">
            <li><a href={SPONSOR_MAIL} className="transition hover:text-ember">Sponsorship enquiries</a></li>
            <li><a href="#faqs" onClick={(e) => { e.preventDefault(); scrollToTarget('#faqs'); }} className="transition hover:text-ember">FAQs</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1240px] flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {ORGANISER}. All rights reserved.</p>
        <p>IEEE and the IEEE logo are trademarks of the Institute of Electrical and Electronics Engineers, Inc.</p>
      </div>
    </footer>
  );
}
