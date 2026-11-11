import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { REGISTER_URL } from '../../data';
import Btn from '../ui/Btn';
import TiltCard from '../ui/TiltCard';
import { ChipIcon, CodeIcon } from '../ui/Icons';
import { CornerTrace } from '../ui/Traces';
import { ArrowRight } from 'lucide-react';
import type { Quality } from '../../lib/env';
import type { SlotRect } from './LabScene';

const LabScene = lazy(() => import('./LabScene'));

type Props = { quality: Quality; mobile: boolean };

export default function Hero({ quality, mobile }: Props) {
  const hero = useRef<HTMLElement>(null);
  const slotEl = useRef<HTMLDivElement>(null);
  const slot = useRef<SlotRect>({ cx: 0, cy: 0, w: 0, h: 0 });
  const [stageH, setStageH] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  // Where the 3D mascot should stand = wherever the CSS layout puts the slot.
  useEffect(() => {
    const measure = () => {
      const h = hero.current, s = slotEl.current;
      if (!h || !s) return;
      const hr = h.getBoundingClientRect(), sr = s.getBoundingClientRect();
      slot.current = { cx: sr.left - hr.left + sr.width / 2, cy: sr.top - hr.top + sr.height / 2, w: sr.width, h: sr.height };
      setStageH(mobile ? Math.min(hr.height, sr.bottom - hr.top + 110) : hr.height);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (hero.current) ro.observe(hero.current);
    if (slotEl.current) ro.observe(slotEl.current);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [mobile]);

  useEffect(() => {
    if (!hero.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(hero.current);
    return () => io.disconnect();
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const forced = new URLSearchParams(location.search).get('3d');

  return (
    <section id="home" ref={hero} className="relative isolate min-h-[100svh] overflow-hidden bg-night">
      {/* ── layered stage: static art underneath, live 3D lab on top ── */}
      <div
        className="absolute inset-x-0 top-0 overflow-hidden"
        style={{
          height: stageH ?? '100%',
          maskImage: mobile ? 'linear-gradient(to bottom,#000 80%,transparent)' : undefined,
          WebkitMaskImage: mobile ? 'linear-gradient(to bottom,#000 80%,transparent)' : undefined,
        }}
      >
        <img
          src="/assets/lab-background.webp" alt="" fetchPriority="high" decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[60%_50%]"
        />
        {quality !== 'static' && (
          <div className="absolute inset-0 transition-opacity duration-[1400ms]" style={{ opacity: ready ? 1 : 0 }}>
            <Suspense fallback={null}>
              <LabScene quality={quality} slot={slot} active={visible} onReady={onReady} adaptive={!forced} />
            </Suspense>
          </div>
        )}
      </div>

      {/* readability + atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/70 via-transparent to-night/10" />
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{ background: 'linear-gradient(90deg, rgba(13,10,26,.74) 0%, rgba(13,10,26,.4) 32%, transparent 56%)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 lg:hidden"
        style={{ background: 'linear-gradient(180deg, rgba(13,10,26,.55) 0%, transparent 40%)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-night via-night/80 to-transparent" />

      <CornerTrace className="pointer-events-none absolute left-0 top-[66px] hidden w-[17vw] min-w-[160px] max-w-[290px] sm:block" />
      <CornerTrace className="pointer-events-none absolute right-0 top-[66px] hidden w-[17vw] min-w-[160px] max-w-[290px] -scale-x-100 sm:block" />
      <CornerTrace className="pointer-events-none absolute bottom-3 left-0 hidden w-[15vw] min-w-[140px] max-w-[250px] -scale-y-100 lg:block" accent="#A855F7" />
      <CornerTrace className="pointer-events-none absolute bottom-3 right-0 hidden w-[15vw] min-w-[140px] max-w-[250px] scale-[-1] lg:block" />

      {/* hologram caption in the window */}
      <div aria-hidden className="tech-label pointer-events-none absolute right-[7.5%] top-[20%] z-[2] hidden text-[13px] leading-[2.3] tracking-[0.34em] text-lav/75 xl:block"
        style={{ textShadow: '0 0 12px rgba(168,85,247,.8)' }}>
        BUILD<br />INNOVATE<br />CONNECT
      </div>

      {/* ── content ── */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1500px] flex-col px-5 pb-8 pt-[88px] sm:px-10 lg:pt-[96px]">
        <div className="grid flex-1 grid-cols-1 items-center gap-x-4 lg:grid-cols-[1.02fr_1fr] lg:grid-rows-[auto_auto] lg:content-center">
          {/* A — identity */}
          <div className="mx-auto flex w-full max-w-[640px] flex-col items-center text-center lg:col-start-1 lg:row-start-1 lg:mx-0 lg:ml-[6%] lg:self-end">
            <p className="tech-label text-[11px] tracking-[0.42em] text-white/80 sm:text-[13px]">IEEE PRESENTS</p>
            <img
              src="/assets/logo-infinity.webp" alt="Circuit Verse infinity logo" width={810} height={405}
              className="mt-3 w-[min(54vw,250px)] lg:w-[clamp(190px,16vw,270px)]"
              style={{ filter: 'drop-shadow(0 0 16px rgba(168,85,247,.75)) drop-shadow(0 0 36px rgba(216,180,255,.45))' }}
            />
            <h1 className="mt-2 font-display font-black uppercase leading-none">
              <span className="sr-only">IEEE Circuit Verse</span>
              <span aria-hidden className="title-slant inline-block whitespace-nowrap text-[7.6vw] tracking-[0.05em] sm:text-[3rem] lg:text-[clamp(2.2rem,3.05vw,3.8rem)]">
                <span className="text-white-glow">CIRCUIT</span>{' '}<span className="text-verse-glow">VERSE</span>
              </span>
            </h1>
            <p className="tech-label mt-6 text-[11px] tracking-[0.5em] text-[#b9a6ff] sm:text-sm lg:mt-5">
              WORKSHOP&nbsp;&nbsp;/&nbsp;&nbsp;HACKATHON
            </p>
          </div>

          {/* S — mascot slot (3D character stands here) */}
          <div
            ref={slotEl}
            className="relative my-2 h-[min(46svh,360px)] w-full lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:my-0 lg:h-[min(60svh,640px)] lg:min-h-[400px]"
            aria-hidden
          >
            {quality === 'static' && (
              <img src="/assets/mascot-full.webp" alt="" className="floaty absolute inset-0 m-auto h-full w-auto max-w-full object-contain" />
            )}
          </div>

          {/* B — pitch + CTAs */}
          <div className="mx-auto flex w-full max-w-[640px] flex-col items-center pt-1 text-center lg:col-start-1 lg:row-start-2 lg:pt-7 lg:mx-0 lg:ml-[6%] lg:items-start lg:self-start lg:pl-[14%] lg:text-left">
            <p className="max-w-[28rem] text-[1.05rem] leading-snug text-white/90 sm:text-lg lg:text-[1.18rem]">
              A two-part tech odyssey to build skills, innovate, and turn circuit ideas into real solutions.
            </p>
            <div className="mt-7 flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row lg:-ml-[2%]">
              <Btn href={REGISTER_URL} magnetic arrow="up">Register Now</Btn>
              <Btn href="#events" variant="ghost">Explore Events</Btn>
            </div>
          </div>
        </div>

        {/* event cards */}
        <div className="mx-auto mt-8 grid w-full max-w-[1130px] grid-cols-1 gap-5 md:grid-cols-2 lg:mt-4 lg:gap-9">
          <TiltCard href="#workshop" color="#FF7A2E" variant="lift" label="Workshop – view details" className="h-[132px] sm:h-[150px]">
            <div className="flex h-full items-center gap-5 px-6 sm:px-8">
              <ChipIcon size={62} className="shrink-0" />
              <span className="h-14 w-px shrink-0 bg-ember/35" />
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-semibold text-white sm:text-[1.7rem]">Workshop</h2>
                <p className="mt-1 text-[0.92rem] leading-snug text-white/80">Build skills. Get hands-on with circuits and systems.</p>
              </div>
              <ArrowRight className="shrink-0 text-ember" size={28} strokeWidth={1.8} />
            </div>
          </TiltCard>
          <TiltCard href="#hackathon" color="#A855F7" variant="tilt" label="Hackathon – view details" className="h-[132px] sm:h-[150px]">
            <div className="flex h-full items-center gap-5 px-6 sm:px-8">
              <CodeIcon size={62} className="shrink-0" />
              <span className="h-14 w-px shrink-0 bg-neon/40" />
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-semibold text-white sm:text-[1.7rem]">Hackathon</h2>
                <p className="mt-1 text-[0.92rem] leading-snug text-white/80">Innovate, prototype, and solve real-world challenges.</p>
              </div>
              <ArrowRight className="shrink-0 text-neon" size={28} strokeWidth={1.8} />
            </div>
          </TiltCard>
        </div>

        <p className="tech-label mt-7 flex items-center justify-center gap-4 text-center text-[10px] tracking-[0.3em] text-white/60 sm:text-xs">
          <span className="hidden h-px w-24 bg-gradient-to-r from-transparent to-ember/70 sm:block" />
          TWO EXPERIENCES. ONE CIRCUIT VERSE.
          <span className="hidden h-px w-24 bg-gradient-to-l from-transparent to-ember/70 sm:block" />
        </p>
      </div>
    </section>
  );
}
