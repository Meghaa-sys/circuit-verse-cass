import { ReactNode, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { scrollToTarget } from '../../lib/lenis';
import { useIsCoarse } from '../../lib/env';
import { playClickSound } from '../../lib/audio';

type Props = {
  href: string;
  variant?: 'primary' | 'ghost' | 'outline';
  children: ReactNode;
  className?: string;
  magnetic?: boolean;
  arrow?: 'up' | 'right' | 'none';
};

/** Button with cursor-following illumination (--mx/--my) and optional magnetic pull. */
export default function Btn({ href, variant = 'primary', children, className = '', magnetic = false, arrow = 'right' }: Props) {
  const wrap = useRef<HTMLSpanElement>(null);
  const coarse = useIsCoarse();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const cls = variant === 'primary' ? 'btn btn-primary' : variant === 'ghost' ? 'btn btn-ghost' : 'btn btn-outline-orange';
  const Arrow = arrow === 'up' ? ArrowUpRight : ArrowRight;

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  const onWrapMove = (e: React.PointerEvent) => {
    if (!magnetic || coarse || !wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.38);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.span
      ref={wrap}
      style={{ x: sx, y: sy }}
      onPointerMove={onWrapMove}
      onPointerLeave={reset}
      className={`inline-block ${className}`}
    >
      <a
        href={href}
        onPointerMove={onMove}
        onClick={(e) => {
          playClickSound();
          if (href.startsWith('#')) {
            e.preventDefault();
            scrollToTarget(href);
          }
        }}
        {...(!href.startsWith('#') && !href.startsWith('mailto:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={`${cls} w-full sm:w-auto`}
      >
        <span>{children}</span>
        {arrow !== 'none' && <Arrow size={18} strokeWidth={2.4} />}
      </a>
    </motion.span>
  );
}
