/** Animated circuit-trace decorations. Orange energy pulses travel along fixed violet/orange copper. */

export function CornerTrace({ className = '', accent = '#FF7A2E' }: { className?: string; accent?: string }) {
  return (
    <svg viewBox="0 0 280 120" className={className} fill="none" aria-hidden style={{ filter: `drop-shadow(0 0 5px ${accent})` }}>
      <path d="M0 18H120L160 58H250" stroke={accent} strokeWidth="2" opacity=".85" />
      <path d="M0 32H112L152 72H206" stroke="#A855F7" strokeWidth="1.4" opacity=".75" />
      <path d="M0 18H120L160 58H250" stroke="#FFD2A8" strokeWidth="2.4" className="trace-flow" />
      <path d="M0 32H112L152 72H206" stroke="#E5CCFF" strokeWidth="1.8" className="trace-flow slow" />
      <circle cx="256" cy="58" r="3.4" fill="#0D0A1A" stroke={accent} strokeWidth="1.6" className="node-pulse" />
      <circle cx="212" cy="72" r="2.6" fill="#0D0A1A" stroke="#A855F7" strokeWidth="1.4" className="node-pulse" />
    </svg>
  );
}

/** Horizontal divider with a travelling pulse and end nodes. */
export function TraceDivider({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 20" preserveAspectRatio="none" className={`h-5 w-full ${className}`} fill="none" aria-hidden
      style={{ filter: 'drop-shadow(0 0 4px #FF7A2E)' }}>
      <path d="M0 10H230L244 4H356L370 10H600" stroke="#FF7A2E" strokeOpacity=".55" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      <path d="M0 10H230L244 4H356L370 10H600" stroke="#FFD2A8" strokeWidth="1.8" className="trace-flow" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Soft full-section circuit wallpaper. */
export function CircuitWallpaper({ className = '' }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden fill="none"
      preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 800">
      <g stroke="#FF7A2E" strokeOpacity=".16" strokeWidth="1.2">
        <path d="M0 120H180L230 170H420" /><path d="M0 200H120L170 250H300" />
        <path d="M1200 640H1010L960 590H760" /><path d="M1200 560H1080L1030 510H900" />
        <path d="M600 0V90L640 130V230" /><path d="M520 800V700L480 660V580" />
      </g>
      <g stroke="#A855F7" strokeOpacity=".2" strokeWidth="1.2">
        <path d="M1200 140H1020L970 190H800" /><path d="M0 700H160L210 650H400" />
      </g>
      <g fill="#0D0A1A" stroke="#FF7A2E" strokeOpacity=".5">
        <circle cx="420" cy="170" r="4" className="node-pulse" /><circle cx="300" cy="250" r="4" />
        <circle cx="760" cy="590" r="4" className="node-pulse" /><circle cx="900" cy="510" r="4" />
        <circle cx="640" cy="230" r="4" /><circle cx="480" cy="580" r="4" className="node-pulse" />
      </g>
    </svg>
  );
}
