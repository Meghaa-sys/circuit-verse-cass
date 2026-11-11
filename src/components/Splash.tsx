import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { VerseE } from './ui/Icons';
import SoundToggle from './ui/SoundToggle';
import { startSuperheroTheme } from '../lib/audio';

type Props = { onExit: () => void; onDone: () => void; mobile: boolean };

const ASSETS = ['/assets/lab-background.webp', '/assets/mascot.webp', '/assets/logo-infinity.webp', '/assets/logo-infinity-duo.webp'];

function preload(): Promise<void> {
  const all = ASSETS.map(
    (src) =>
      new Promise<void>((res) => {
        const img = new Image();
        img.onload = img.onerror = () => res();
        img.src = src;
      }),
  );
  return Promise.race([Promise.all(all).then(() => undefined), new Promise<void>((r) => setTimeout(r, 6000))]);
}

/** Builds edge → centre circuit paths in pixel space so strokes and nodes stay crisp at any size. */
function buildTraces(w: number, h: number) {
  const cx = w / 2, cy = h / 2;
  const d = Math.min(w, h) * 0.07;
  const mk = (pts: [number, number][]) => 'M' + pts.map((p) => p.join(' ')).join(' L');
  const reach = Math.min(w, h) * 0.3;
  return [
    mk([[0, h * 0.22], [w * 0.16, h * 0.22], [w * 0.16 + d, h * 0.22 + d], [cx - reach * 1.5, h * 0.22 + d]]),
    mk([[0, h * 0.78], [w * 0.12, h * 0.78], [w * 0.12 - d, h * 0.78 - d], [w * 0.12 - d, h * 0.62], [cx - reach * 1.7, h * 0.62]]),
    mk([[w, h * 0.24], [w * 0.84, h * 0.24], [w * 0.84 - d, h * 0.24 + d], [cx + reach * 1.5, h * 0.24 + d]]),
    mk([[w, h * 0.74], [w * 0.88, h * 0.74], [w * 0.88 + d, h * 0.74 - d], [w * 0.88 + d, h * 0.6], [cx + reach * 1.7, h * 0.6]]),
    mk([[w * 0.3, 0], [w * 0.3, h * 0.1], [w * 0.3 + d, h * 0.1 + d], [w * 0.3 + d, h * 0.2]]),
    mk([[w * 0.7, h], [w * 0.7, h * 0.9], [w * 0.7 - d, h * 0.9 - d], [w * 0.7 - d, h * 0.82]]),
    mk([[w * 0.62, 0], [w * 0.62, h * 0.07], [w * 0.62 - d * 0.7, h * 0.07 + d * 0.7], [w * 0.62 - d * 0.7, h * 0.16]]),
    mk([[w * 0.38, h], [w * 0.38, h * 0.93], [w * 0.38 + d * 0.7, h * 0.93 - d * 0.7], [w * 0.38 + d * 0.7, h * 0.86]]),
  ];
}

export default function Splash({ onExit, onDone, mobile }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const barFill = useRef<HTMLDivElement>(null);
  const pctEl = useRef<HTMLSpanElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const exiting = useRef(false);
  const stop = useRef(false);

  const dims = useMemo(() => ({ w: window.innerWidth, h: window.innerHeight }), []);
  const traces = useMemo(() => buildTraces(dims.w, dims.h), [dims]);

  /* ── floating particles ── */
  useEffect(() => {
    const c = cvs.current!;
    const ctx = c.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = dims.w * dpr; c.height = dims.h * dpr;
    ctx.scale(dpr, dpr);
    const n = mobile ? 38 : 80;
    const ps = Array.from({ length: n }, () => ({
      x: Math.random() * dims.w, y: Math.random() * dims.h,
      r: Math.random() * 1.8 + 0.4, vy: -(Math.random() * 0.22 + 0.05), vx: (Math.random() - 0.5) * 0.1,
      o: Math.random() * 0.6 + 0.2, ph: Math.random() * 6.28, lav: Math.random() < 0.28,
    }));
    let raf = 0;
    const frame = (t: number) => {
      if (stop.current) return;
      ctx.clearRect(0, 0, dims.w, dims.h);
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -4) { p.y = dims.h + 4; p.x = Math.random() * dims.w; }
        const a = p.o * (0.55 + 0.45 * Math.sin(t / 700 + p.ph));
        ctx.beginPath();
        ctx.fillStyle = p.lav ? `rgba(216,180,255,${a})` : `rgba(255,122,46,${a})`;
        ctx.shadowColor = p.lav ? '#A855F7' : '#FF7A2E';
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { stop.current = true; cancelAnimationFrame(raf); };
  }, [dims, mobile]);

  /* ── main timeline ── */
  useEffect(() => {
    const assets = preload();
    const paths = Array.from(svg.current!.querySelectorAll<SVGPathElement>('path.tr'));
    const nodes = Array.from(svg.current!.querySelectorAll<SVGCircleElement>('circle.nd'));
    paths.forEach((p) => {
      const L = p.getTotalLength();
      gsap.set(p, { strokeDasharray: L, strokeDashoffset: L });
    });
    const prog = { v: 0 };
    const q = root.current!;

    const ctxg = gsap.context(() => {
      const t = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.current = t;
      t.to(paths, { strokeDashoffset: 0, duration: 1.15, stagger: 0.09, ease: 'power2.inOut' }, 0.1)
        .to(nodes, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, transformOrigin: '50% 50%' }, 0.9)
        .fromTo('.sp-logo', { opacity: 0, scale: 0.8, filter: 'blur(14px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.95 }, 0.45)
        .fromTo('.sp-ring', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1.1, stagger: 0.12 }, 0.5)
        .fromTo('.sp-ch', { opacity: 0, y: 26, rotateX: -70 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.04 }, 1.05)
        .fromTo('.sp-status', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 1.5)
        .fromTo('.sp-bar', { opacity: 0, scaleX: 0.6 }, { opacity: 1, scaleX: 1, duration: 0.5 }, 1.55)
        .to(prog, {
          v: 100, duration: 1.7, ease: 'power1.inOut',
          onUpdate: () => {
            if (barFill.current) barFill.current.style.width = `${prog.v}%`;
            if (pctEl.current) pctEl.current.textContent = `${Math.round(prog.v).toString().padStart(3, '0')}%`;
          },
        }, 1.6)
        .add(async () => { await assets; runExit(false); }, '>+0.1');
    }, q);

    gsap.to('.sp-pulse', { opacity: 0.95, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    return () => { ctxg.revert(); tl.current?.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runExit = (fast: boolean) => {
    if (exiting.current) return;
    exiting.current = true;
    tl.current?.pause();

    // Start superhero theme song on click/exit
    startSuperheroTheme();

    const dur = fast ? 0.7 : 1.15;
    onExit();
    const out = gsap.timeline({ onComplete: onDone });
    out.to(stage.current, { scale: 1.35, opacity: 0, duration: dur, ease: 'power3.in' }, 0)
      .to(svg.current, { opacity: 0, duration: dur * 0.7 }, 0)
      .to(root.current, { opacity: 0, duration: dur * 0.75, ease: 'power2.inOut' }, dur * 0.35);
  };

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        startSuperheroTheme();
        runExit(true);
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const letters = (s: string, cls: string) =>
    s.split('').map((ch, i) => (
      <span key={i} className={`sp-ch inline-block ${cls}`} style={{ perspective: 600 }}>{ch}</span>
    ));

  const verseLetters = (cls: string) => [
    <span key="v" className={`sp-ch inline-block ${cls}`} style={{ perspective: 600 }}>V</span>,
    <span key="e1" className={`sp-ch inline-block ${cls}`} style={{ perspective: 600 }}><VerseE /></span>,
    <span key="r" className={`sp-ch inline-block ${cls}`} style={{ perspective: 600 }}>R</span>,
    <span key="s" className={`sp-ch inline-block ${cls}`} style={{ perspective: 600 }}>S</span>,
    <span key="e2" className={`sp-ch inline-block ${cls}`} style={{ perspective: 600 }}>E</span>,
  ];

  return (
    <div
      ref={root}
      role="dialog"
      aria-label="Circuit Verse intro"
      className="fixed inset-0 z-[100] overflow-hidden bg-night"
      style={{ background: 'radial-gradient(ellipse at 50% 45%, #1A0F2E 0%, #0D0A1A 62%)' }}
      onClick={() => startSuperheroTheme()}
    >
      <canvas ref={cvs} className="absolute inset-0 h-full w-full" style={{ width: dims.w, height: dims.h }} aria-hidden />
      <svg ref={svg} className="absolute inset-0 h-full w-full" viewBox={`0 0 ${dims.w} ${dims.h}`} aria-hidden fill="none"
        style={{ filter: 'drop-shadow(0 0 6px #FF7A2E)' }}>
        {traces.map((d, i) => (
          <path key={i} className="tr" d={d} stroke={i % 3 === 2 ? '#FF9A58' : '#FF7A2E'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {traces.map((d, i) => {
          const nums = d.split(/[ML]/).filter(Boolean).pop()!.trim().split(' ').map(Number);
          return <circle key={i} className="nd" cx={nums[0]} cy={nums[1]} r="4.5" fill="#0D0A1A" stroke="#FF7A2E" strokeWidth="2" style={{ opacity: 0, transform: 'scale(.3)' }} />;
        })}
      </svg>

      <div ref={stage} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div className="relative grid aspect-square place-items-center" style={{ width: 'min(60vw, 300px)' }}>
          {/* violet / orange energy halo matching the classic duo infinity logo */}
          <div className="sp-ring sp-pulse absolute -inset-[14%] rounded-full opacity-80"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,.55) 0%, rgba(255,122,46,.2) 42%, transparent 68%)', filter: 'blur(16px)' }} />
          <div className="sp-ring absolute inset-0 rounded-full border border-neon/40" />
          <div className="sp-ring absolute -inset-[9%] rounded-full border border-dashed border-ember/30"
            style={{ animation: 'spin 24s linear infinite' }} />
          <img src="/assets/logo-infinity-duo.webp" alt="Circuit Verse infinity logo" width={810} height={405}
            className="sp-logo relative w-[92%]"
            style={{ filter: 'drop-shadow(0 0 16px rgba(168,85,247,.85)) drop-shadow(0 0 38px rgba(255,122,46,.45))' }} />
        </div>

        <h1 className="mt-8 font-display text-[clamp(1.2rem,6.4vw,2.1rem)] font-bold uppercase leading-none tracking-[0.08em] sm:text-6xl sm:tracking-[0.16em]" style={{ perspective: 800 }}>
          <span className="inline-block whitespace-nowrap">
            {letters('CIRCUIT', 'text-white-glow')}
            <span className="inline-block w-[0.35em]" />
            {verseLetters('text-verse-glow')}
          </span>
        </h1>

        <p className="sp-status tech-label mt-9 flex items-center gap-1 text-[11px] text-lav sm:text-sm" style={{ opacity: 0 }}>
          INITIALIZING CIRCUIT VERSE<span className="blink">...</span>
        </p>

        <div className="sp-bar mt-4 w-[min(78vw,340px)]" style={{ opacity: 0 }}>
          <div className="relative h-[5px] w-full overflow-hidden rounded-full bg-white/10">
            <div ref={barFill} className="absolute inset-y-0 left-0 w-0 rounded-full"
              style={{ background: 'linear-gradient(90deg,#FF7A2E,#FFB074)', boxShadow: '0 0 14px 2px #FF7A2E, 0 0 36px 4px rgba(255,122,46,.55)' }} />
          </div>
          <div className="tech-label mt-2 flex justify-between text-[10px] tracking-[0.2em] text-white/45">
            <span>SYS.BOOT</span>
            <span ref={pctEl}>000%</span>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-8 sm:top-8">
        <SoundToggle />
        <button
          type="button"
          onClick={() => {
            startSuperheroTheme();
            runExit(true);
          }}
          className="tech-label rounded border border-white/15 bg-white/5 px-4 py-2.5 text-[11px] tracking-[0.22em] text-white/70 backdrop-blur transition hover:border-ember hover:text-ember hover:shadow-[0_0_22px_-2px_rgba(255,122,46,.7)]"
        >
          Skip intro →
        </button>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
