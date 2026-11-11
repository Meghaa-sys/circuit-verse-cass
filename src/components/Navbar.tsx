import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV, ORGANISER, REGISTER_URL } from '../data';
import { IeeeMark } from './ui/Icons';
import Btn from './ui/Btn';
import { useActiveSection, useScrolled } from '../lib/hooks';
import { scrollToTarget } from '../lib/lenis';

const IDS = ['home', 'about', 'events', 'workshop', 'hackathon', 'tracks', 'timeline', 'prizes', 'faqs', 'sponsors', 'register'];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const active = useActiveSection(IDS);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToTarget(href), open ? 260 : 0);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? 'border-b border-white/10 bg-night/80 backdrop-blur-xl' : 'border-b border-transparent'}`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:h-[72px]">
          <a href="#home" onClick={go('#home')} className="flex items-center gap-4" aria-label="IEEE Circuit Verse – home">
            <IeeeMark />
            <span className="hidden h-8 w-px bg-white/25 sm:block" />
            <span className="hidden text-[13px] leading-tight text-white/85 sm:block">
              {ORGANISER.split(' ')[0]}<br />{ORGANISER.split(' ').slice(1).join(' ')}
            </span>
          </a>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {NAV.map((n) => {
              const on = (n.keys as readonly string[]).includes(active);
              return (
                <a key={n.href} href={n.href} onClick={go(n.href)}
                  className={`relative py-2 text-[15px] transition-colors hover:text-white ${on ? 'text-white' : 'text-white/75'}`}>
                  {n.label}
                  <span className={`absolute inset-x-0 -bottom-0.5 h-[2px] origin-left rounded bg-ember shadow-[0_0_10px_#FF7A2E] transition-transform duration-300 ${on ? 'scale-x-100' : 'scale-x-0'}`} />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block"><Btn href={REGISTER_URL} variant="outline" arrow="up">Register Now</Btn></div>
            <button
              type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 bg-white/5 text-white lg:hidden"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-night/95 px-8 backdrop-blur-xl lg:hidden"
            style={{ background: 'radial-gradient(ellipse at 80% 10%, rgba(255,122,46,.18), transparent 55%), rgba(13,10,26,.97)' }}
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile">
              {NAV.map((n, i) => (
                <motion.a key={n.href} href={n.href} onClick={go(n.href)}
                  initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i + 0.1 }}
                  className="font-display text-3xl font-bold uppercase tracking-wide text-white/90 active:text-ember">
                  <span className="tech-label mr-3 text-xs text-ember">0{i + 1}</span>{n.label}
                </motion.a>
              ))}
            </nav>
            <div className="mt-10"><Btn href={REGISTER_URL} arrow="up" className="w-full">Register Now</Btn></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
