import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { VerseE } from './ui/Icons';

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

/** Builds PCB circuit traces converging directly from the screen edges into the central orbit dial. */
function buildTraces(w: number, h: number, cx: number, cy: number, r: number) {
  const mk = (pts: [number, number][]) => 'M' + pts.map((p) => p.join(' ')).join(' L');
  const d = Math.min(w, h) * 0.06;

  // Exact points on the orbit perimeter at designated angles
  const ptOnRing = (angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return [Math.round(cx + r * Math.cos(rad)), Math.round(cy + r * Math.sin(rad))] as [number, number];
  };

  const p15 = ptOnRing(15);
  const p45 = ptOnRing(45);
  const p75 = ptOnRing(75);
  const p110 = ptOnRing(110);
  const p140 = ptOnRing(140);
  const p165 = ptOnRing(165);
  const p200 = ptOnRing(200);
  const p225 = ptOnRing(225);
  const p255 = ptOnRing(255);
  const p285 = ptOnRing(285);
  const p315 = ptOnRing(315);
  const p345 = ptOnRing(345);

  return [
    // Left side traces converging into left side of the dial
    mk([[0, h * 0.2], [cx - r * 1.5, h * 0.2], [cx - r * 1.5 + d, p200[1]], p200]),
    mk([[0, h * 0.42], [cx - r * 1.3, h * 0.42], p165]),
    mk([[0, h * 0.65], [cx - r * 1.4, h * 0.65], [cx - r * 1.15, p140[1]], p140]),
    mk([[0, h * 0.85], [cx - r * 1.6, h * 0.85], [cx - r * 1.6 + d, p110[1]], p110]),

    // Right side traces converging into right side of the dial
    mk([[w, h * 0.18], [cx + r * 1.5, h * 0.18], [cx + r * 1.5 - d, p345[1]], p345]),
    mk([[w, h * 0.44], [cx + r * 1.3, h * 0.44], p15]),
    mk([[w, h * 0.68], [cx + r * 1.4, h * 0.68], [cx + r * 1.15, p45[1]], p45]),
    mk([[w, h * 0.88], [cx + r * 1.6, h * 0.88], [cx + r * 1.6 - d, p75[1]], p75]),

    // Top traces converging into top of the dial
    mk([[w * 0.28, 0], [w * 0.28, cy - r * 1.4], [p255[0], cy - r * 1.4 + d], p255]),
    mk([[w * 0.72, 0], [w * 0.72, cy - r * 1.4], [p285[0], cy - r * 1.4 + d], p285]),

    // Bottom traces converging into bottom of the dial
    mk([[w * 0.32, h], [w * 0.32, cy + r * 1.4], [p110[0], cy + r * 1.4 - d], p110]),
    mk([[w * 0.68, h], [w * 0.68, cy + r * 1.4], [p75[0], cy + r * 1.4 - d], p75]),
  ];
}

export default function Splash({ onExit, onDone, mobile }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const barFill = useRef<HTMLDivElement>(null);
  const pctEl = useRef<HTMLSpanElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const exiting = useRef(false);
  const stop = useRef(false);
  const chargeRef = useRef(0);

  const [dims, setDims] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const [center, setCenter] = useState(() => ({
    cx: window.innerWidth / 2,
    cy: window.innerHeight * 0.4,
    r: Math.min(window.innerWidth * 0.3, 135),
  }));

  // Re-measure dial position & screen dimensions
  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth, h = window.innerHeight;
      setDims({ w, h });
      if (dialRef.current) {
        const rect = dialRef.current.getBoundingClientRect();
        setCenter({
          cx: rect.left + rect.width / 2,
          cy: rect.top + rect.height / 2,
          r: rect.width / 2,
        });
      } else {
        setCenter({
          cx: w / 2,
          cy: h * 0.4,
          r: Math.min(w * 0.3, 135),
        });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const traces = useMemo(() => buildTraces(dims.w, dims.h, center.cx, center.cy, center.r), [dims, center]);

  /* ── Omnitrix gravitational particle energy convergence engine ── */
  useEffect(() => {
    const c = cvs.current!;
    const ctx = c.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = dims.w * dpr;
    c.height = dims.h * dpr;
    ctx.scale(dpr, dpr);

    const count = mobile ? 48 : 95;
    const colors = [
      '#FF7A2E', // Electric Orange
      '#FFA96B', // Soft Amber
      '#A855F7', // Neon Violet
      '#D8B4FF', // Soft Lavender
      '#FFFFFF', // Core Spark
    ];

    const spawnEdge = () => {
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      if (side === 0) { x = Math.random() * dims.w; y = -10; } // top
      else if (side === 1) { x = dims.w + 10; y = Math.random() * dims.h; } // right
      else if (side === 2) { x = Math.random() * dims.w; y = dims.h + 10; } // bottom
      else { x = -10; y = Math.random() * dims.h; } // left
      return { x, y };
    };

    const ps = Array.from({ length: count }, () => {
      const initial = Math.random() < 0.65 ? spawnEdge() : { x: Math.random() * dims.w, y: Math.random() * dims.h };
      return {
        x: initial.x,
        y: initial.y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random() * 80 + 30,
        orbiting: false,
        angle: Math.random() * 6.28,
        orbitR: center.r * (0.8 + Math.random() * 0.35),
      };
    });

    let raf = 0;
    const frame = () => {
      if (stop.current) return;
      ctx.clearRect(0, 0, dims.w, dims.h);

      const cx = center.cx;
      const cy = center.cy;
      const chargePct = chargeRef.current / 100;

      for (const p of ps) {
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.hypot(dx, dy);

        if (!p.orbiting && dist < center.r * 1.05) {
          // Transition into orbital energy spin upon reaching the dial
          p.orbiting = true;
          p.angle = Math.atan2(p.y - cy, p.x - cx);
          p.orbitR = center.r * (0.75 + Math.random() * 0.3);
        }

        if (p.orbiting) {
          // Rapidly orbit the core
          const speed = (0.05 + chargePct * 0.08) * (p.r > 1.8 ? 1 : -1);
          p.angle += speed;
          p.orbitR -= 0.35; // gradually spirals into core
          p.x = cx + Math.cos(p.angle) * p.orbitR;
          p.y = cy + Math.sin(p.angle) * p.orbitR;

          if (p.orbitR < center.r * 0.25 || p.life-- <= 0) {
            // Core absorbs energy; respawn at edge
            const nxt = spawnEdge();
            p.x = nxt.x; p.y = nxt.y;
            p.vx = (Math.random() - 0.5) * 0.8;
            p.vy = (Math.random() - 0.5) * 0.8;
            p.orbiting = false;
            p.life = Math.random() * 80 + 40;
          }
        } else {
          // Gravitational pull towards the dial
          const grav = (0.28 + chargePct * 0.95) * Math.min(2.5, 95 / Math.max(dist, 20));
          p.vx += (dx / dist) * grav;
          p.vy += (dy / dist) * grav;

          // Subtle vortex spin
          p.vx += (-dy / dist) * (0.12 + chargePct * 0.3);
          p.vy += (dx / dist) * (0.12 + chargePct * 0.3);

          p.vx *= 0.95;
          p.vy *= 0.95;
          p.x += p.vx;
          p.y += p.vy;
        }

        // Draw energy streak
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 3.5, p.y - p.vy * 3.5);
        ctx.strokeStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.orbiting ? 12 : 7;
        ctx.lineWidth = p.r;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Particle head spark
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.8, 0, 6.283);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      stop.current = true;
      cancelAnimationFrame(raf);
    };
  }, [dims, center, mobile]);

  /* ── Main timeline: PCB traces draw, dial charges, letters flip ── */
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
      t.to(paths, { strokeDashoffset: 0, duration: 1.15, stagger: 0.08, ease: 'power2.inOut' }, 0.1)
        .to(nodes, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.06, transformOrigin: '50% 50%' }, 0.85)
        .fromTo('.sp-dial', { opacity: 0, scale: 0.7, filter: 'blur(16px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.95 }, 0.4)
        .fromTo('.sp-ch', { opacity: 0, y: 26, rotateX: -70 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.04 }, 1.05)
        .fromTo('.sp-status', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 1.45)
        .fromTo('.sp-bar', { opacity: 0, scaleX: 0.6 }, { opacity: 1, scaleX: 1, duration: 0.5 }, 1.5)
        .to(prog, {
          v: 100, duration: 1.7, ease: 'power1.inOut',
          onUpdate: () => {
            chargeRef.current = prog.v;
            if (barFill.current) barFill.current.style.width = `${prog.v}%`;
            if (pctEl.current) pctEl.current.textContent = `${Math.round(prog.v).toString().padStart(3, '0')}%`;
          },
        }, 1.55)
        .add(async () => { await assets; runExit(false); }, '>+0.1');
    }, q);

    gsap.to('.sp-pulse', { opacity: 0.95, duration: 1.0, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    return () => { ctxg.revert(); tl.current?.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Ben 10 Omnitrix Watch Pop & Iris Portal Blast ── */
  const runExit = (fast: boolean) => {
    if (exiting.current) return;
    exiting.current = true;
    tl.current?.pause();

    // Trigger hero 3D camera dolly in the background
    onExit();

    const dur = fast ? 0.65 : 1.15;
    const exitTl = gsap.timeline({ onComplete: onDone });

    // 1. Recoil / lock into dial core
    exitTl.to(dialRef.current, {
      scale: 0.92,
      duration: 0.14,
      ease: 'power2.in',
    }, 0)

    // 2. The Omnitrix POP! Dial springs up towards the screen
    .to(dialRef.current, {
      scale: 1.35,
      y: -12,
      duration: 0.34,
      ease: 'back.out(2.4)',
    }, 0.14)

    // 3. Surrounding texts dissolve into energy
    .to(['.sp-title-wrap', '.sp-status', '.sp-bar', svg.current], {
      opacity: 0,
      scale: 0.88,
      duration: 0.25,
      ease: 'power2.in',
    }, 0.1)

    // 4. Omnitrix shockwave blast ring expands across the entire viewport
    .fromTo(shockwaveRef.current, {
      scale: 0.35,
      opacity: 1,
      borderWidth: '16px',
    }, {
      scale: 16,
      opacity: 0,
      borderWidth: '2px',
      duration: dur * 0.82,
      ease: 'power3.out',
    }, 0.2)

    // 5. White-hot energy core flash
    .fromTo(flashRef.current, {
      opacity: 0,
    }, {
      opacity: 0.92,
      duration: 0.14,
      ease: 'power1.in',
    }, 0.2)
    .to(flashRef.current, {
      opacity: 0,
      duration: 0.42,
      ease: 'power2.out',
    }, 0.34)

    // 6. Iris circular aperture blast: opens like a watch portal into the hero lab
    .to(root.current, {
      clipPath: `circle(160% at ${center.cx}px ${center.cy}px)`,
      duration: dur * 0.72,
      ease: 'power3.inOut',
    }, 0.24)

    // 7. Dial expands and dissolves into the blast
    .to(dialRef.current, {
      scale: 2.2,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    }, 0.3);
  };

  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape' || e.key === 'Enter') runExit(true); };
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
      style={{
        background: 'radial-gradient(ellipse at 50% 42%, #1A0F2E 0%, #0D0A1A 68%)',
        clipPath: `circle(100% at ${center.cx}px ${center.cy}px)`,
      }}
    >
      {/* Background converging particles canvas */}
      <canvas ref={cvs} className="absolute inset-0 h-full w-full" style={{ width: dims.w, height: dims.h }} aria-hidden />

      {/* PCB Circuit Traces conducting energy straight to the dial */}
      <svg ref={svg} className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${dims.w} ${dims.h}`} aria-hidden fill="none">
        <defs>
          <linearGradient id="traceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="50%" stopColor="#FF7A2E" />
            <stop offset="100%" stopColor="#FFA96B" />
          </linearGradient>
        </defs>

        {/* Base PCB lines */}
        {traces.map((d, i) => (
          <path
            key={`base-${i}`}
            className="tr"
            d={d}
            stroke={i % 3 === 1 ? '#A855F7' : i % 3 === 2 ? '#FF9A58' : '#FF7A2E'}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,122,46,.7))' }}
          />
        ))}

        {/* Continuous streaming energy pulses running into the center */}
        {traces.map((d, i) => (
          <path
            key={`pulse-${i}`}
            className="tr-flow"
            d={d}
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: '16 260',
              animation: `flow ${2.2 + (i % 4) * 0.4}s linear infinite`,
              filter: 'drop-shadow(0 0 8px #FF7A2E) drop-shadow(0 0 14px #A855F7)',
            }}
          />
        ))}

        {/* Illuminated circuit terminal pads on the dial edge */}
        {traces.map((d, i) => {
          const nums = d.split(/[ML]/).filter(Boolean).pop()!.trim().split(' ').map(Number);
          return (
            <g key={`node-${i}`}>
              <circle cx={nums[0]} cy={nums[1]} r="7" fill="rgba(255,122,46,.25)" />
              <circle
                className="nd"
                cx={nums[0]}
                cy={nums[1]}
                r="4.2"
                fill="#0D0A1A"
                stroke={i % 2 === 0 ? '#FF7A2E' : '#A855F7'}
                strokeWidth="2.4"
                style={{ opacity: 0, transform: 'scale(.3)' }}
              />
            </g>
          );
        })}
      </svg>

      {/* Main Omnitrix / Dial Stage */}
      <div ref={stage} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        {/* The Central Circular Dial / Orbit Core */}
        <div ref={dialRef} className="sp-dial relative grid aspect-square place-items-center" style={{ width: 'min(62vw, 310px)' }}>
          {/* Dual Violet & Orange Energy Core Flare */}
          <div
            className="sp-pulse absolute -inset-[18%] rounded-full opacity-85"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,.6) 0%, rgba(255,122,46,.25) 45%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Omnitrix Outer Mechanical Bezel with Notches */}
          <div
            className="absolute -inset-[11%] rounded-full border border-white/20"
            style={{
              boxShadow: '0 0 28px rgba(255,122,46,.45), inset 0 0 24px rgba(168,85,247,.3)',
              background: 'radial-gradient(circle, rgba(26,15,46,.4) 0%, rgba(13,10,26,.8) 75%)',
            }}
          >
            {/* Bezel tick marks */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <span
                key={deg}
                className="absolute left-1/2 top-1 h-2.5 w-[2px] -translate-x-1/2 origin-bottom bg-ember shadow-[0_0_8px_#FF7A2E]"
                style={{ transform: `rotate(${deg}deg) translateY(-2px)` }}
              />
            ))}
          </div>

          {/* Rotating Dashed Energy Gear Rings */}
          <div
            className="absolute -inset-[6%] rounded-full border-2 border-dashed border-lav/45"
            style={{ animation: 'spin 14s linear infinite' }}
          />
          <div
            className="absolute inset-[1%] rounded-full border border-dashed border-ember/60"
            style={{ animation: 'spin 9s linear infinite reverse' }}
          />
          <div
            className="absolute inset-[7%] rounded-full border border-neon/50"
            style={{ boxShadow: '0 0 16px rgba(168,85,247,.6)' }}
          />

          {/* Classic Violet and Orange Infinity Logo */}
          <img
            src="/assets/logo-infinity-duo.webp"
            alt="Circuit Verse infinity logo"
            width={810}
            height={405}
            className="sp-logo relative w-[90%]"
            style={{ filter: 'drop-shadow(0 0 16px rgba(168,85,247,.85)) drop-shadow(0 0 38px rgba(255,122,46,.45))' }}
          />
        </div>

        {/* CIRCUIT VERSE Title */}
        <div className="sp-title-wrap">
          <h1
            className="mt-7 font-display text-[clamp(1.2rem,6.4vw,2.1rem)] font-bold uppercase leading-none tracking-[0.08em] sm:text-6xl sm:tracking-[0.16em]"
            style={{ perspective: 800 }}
          >
            <span className="inline-block whitespace-nowrap">
              {letters('CIRCUIT', 'text-white-glow')}
              <span className="inline-block w-[0.35em]" />
              {verseLetters('text-verse-glow')}
            </span>
          </h1>
        </div>

        {/* Initialization Status */}
        <p className="sp-status tech-label mt-8 flex items-center gap-1 text-[11px] text-lav sm:text-sm" style={{ opacity: 0 }}>
          INITIALIZING CIRCUIT VERSE<span className="blink">...</span>
        </p>

        {/* Progress Gauge */}
        <div className="sp-bar mt-4 w-[min(78vw,340px)]" style={{ opacity: 0 }}>
          <div className="relative h-[5px] w-full overflow-hidden rounded-full bg-white/10">
            <div
              ref={barFill}
              className="absolute inset-y-0 left-0 w-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #A855F7, #FF7A2E 50%, #FFA96B)',
                boxShadow: '0 0 14px 2px #FF7A2E, 0 0 36px 4px rgba(168,85,247,.55)',
              }}
            />
          </div>
          <div className="tech-label mt-2 flex justify-between text-[10px] tracking-[0.2em] text-white/50">
            <span>CORE.CHARGE</span>
            <span ref={pctEl}>000%</span>
          </div>
        </div>
      </div>

      {/* Ben 10 Expanding Shockwave Ring (Triggers on activation) */}
      <div
        ref={shockwaveRef}
        className="pointer-events-none absolute rounded-full border-solid border-ember"
        style={{
          left: `${center.cx}px`,
          top: `${center.cy}px`,
          width: '260px',
          height: '260px',
          marginLeft: '-130px',
          marginTop: '-130px',
          opacity: 0,
          boxShadow: '0 0 65px 25px rgba(255,122,46,.9), inset 0 0 45px rgba(168,85,247,.8)',
        }}
      />

      {/* Full-screen energy flash overlay */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 bg-white"
        style={{ opacity: 0 }}
      />

      {/* Skip Button */}
      <button
        type="button"
        onClick={() => runExit(true)}
        className="tech-label absolute right-4 top-4 z-20 rounded border border-white/15 bg-white/5 px-4 py-2.5 text-[11px] tracking-[0.22em] text-white/70 backdrop-blur transition hover:border-ember hover:text-ember hover:shadow-[0_0_22px_-2px_rgba(255,122,46,.7)] sm:right-8 sm:top-8"
      >
        Skip intro →
      </button>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes flow { to { stroke-dashoffset: -276; } }
      `}</style>
    </div>
  );
}
