import { useEffect, useRef } from 'react';
import { pointer } from '../../lib/pointer';
import { useIsCoarse, usePrefersReducedMotion } from '../../lib/env';

/** Soft orange light that follows the cursor and lifts nearby surfaces. */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const coarse = useIsCoarse();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (coarse || reduced) return;
    let raf = 0;
    let x = pointer.x;
    let y = pointer.y;
    const tick = () => {
      x += (pointer.x - x) * 0.12;
      y += (pointer.y - y) * 0.12;
      if (ref.current) ref.current.style.transform = `translate3d(${x - 320}px, ${y - 320}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [coarse, reduced]);

  if (coarse || reduced) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[6] h-[640px] w-[640px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(255,122,46,.22) 0%, rgba(255,122,46,.08) 34%, transparent 64%)',
        mixBlendMode: 'screen',
        willChange: 'transform',
      }}
    />
  );
}
