import { ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { scrollToTarget } from '../../lib/lenis';
import { useIsCoarse } from '../../lib/env';

type Props = {
  href?: string;
  color: string;                 // css colour driving border + light
  variant?: 'lift' | 'tilt';     // lift: rises & glows · tilt: 3D tilt toward the cursor
  children: ReactNode;
  className?: string;
  label?: string;
  as?: 'a' | 'div';
};

/** Notched glass panel with an illuminated border, cursor spotlight and 3D hover response. */
export default function TiltCard({ href, color, variant = 'tilt', children, className = '', label, as = 'a' }: Props) {
  const coarse = useIsCoarse();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 170, damping: 15 });
  const sry = useSpring(ry, { stiffness: 170, damping: 15 });
  const amp = variant === 'tilt' ? { x: 9, y: 13 } : { x: 2.5, y: 3.5 };

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
    if (coarse) return;
    ry.set((px - 0.5) * amp.y * 2);
    rx.set(-(py - 0.5) * amp.x * 2);
  };
  const leave = () => { rx.set(0); ry.set(0); };

  const common = {
    onPointerMove: onMove,
    onPointerLeave: leave,
    style: { rotateX: srx, rotateY: sry, transformPerspective: 900, ['--c' as string]: color } as React.CSSProperties,
    whileHover: coarse ? undefined : { y: variant === 'lift' ? -10 : -4, scale: 1.015 },
    transition: { type: 'spring' as const, stiffness: 260, damping: 20 },
    className: `cv-panel ${className}`,
  };

  const inner = (
    <>
      <div className="cv-notch">
        <div className="cv-panel-border" />
        <div className="cv-panel-body">
          <div className="cv-spot" />
          {children}
          <span className="cv-bar" />
          <span className="cv-slash"><i /><i /><i /></span>
        </div>
      </div>
    </>
  );

  if (as === 'div' || !href) {
    return <motion.div {...common}>{inner}</motion.div>;
  }
  return (
    <motion.a
      {...common}
      href={href}
      aria-label={label}
      onClick={(e) => {
        if (href.startsWith('#')) {
          e.preventDefault();
          scrollToTarget(href);
        }
      }}
    >
      {inner}
    </motion.a>
  );
}
