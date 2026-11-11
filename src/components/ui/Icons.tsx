type P = { className?: string; size?: number };

/** Microchip icon – orange, pins glow on hover (see .icon-chip in index.css). */
export function ChipIcon({ className = '', size = 64 }: P) {
  const pins = [18, 28, 38, 48];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" className={`icon-chip ${className}`} aria-hidden>
      <rect x="14" y="14" width="36" height="36" rx="5" stroke="#FF7A2E" strokeWidth="3" fill="rgba(255,122,46,.08)" />
      {pins.map((p) => (
        <g key={p} stroke="#FF7A2E" strokeWidth="3" strokeLinecap="round">
          <line x1={p} y1="14" x2={p} y2="6" />
          <line x1={p} y1="50" x2={p} y2="58" />
          <line x1="14" y1={p} x2="6" y2={p} />
          <line x1="50" y1={p} x2="58" y2={p} />
        </g>
      ))}
      <path d="M24 38c0-5 4-8 8-8s8 3 8 8" stroke="#FFB074" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M25 30c0 5 3.5 8 7 8s7-3 7-8" stroke="#FF7A2E" strokeWidth="2.4" strokeLinecap="round" opacity=".55" />
      <circle cx="32" cy="34" r="2.2" fill="#FFB074" />
    </svg>
  );
}

/** </> code icon – violet. */
export function CodeIcon({ className = '', size = 64 }: P) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" className={`icon-code ${className}`} aria-hidden>
      <path className="lt" d="M22 20 8 32l14 12" stroke="#A855F7" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path className="gt" d="M42 20l14 12-14 12" stroke="#A855F7" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 14 28 50" stroke="#D8B4FF" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

/** Stylized 3-bar "E" for VERSE matching the brand lockup */
export function VerseE({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 22"
      fill="currentColor"
      className={`inline-block shrink-0 ${className}`}
      style={{
        width: '0.74em',
        height: '0.82em',
        verticalAlign: '-0.02em',
        margin: '0 0.04em',
        filter: 'drop-shadow(0 0 10px rgba(168,85,247,.65))',
      }}
      aria-hidden="true"
    >
      <rect x="0" y="0.5" width="20" height="3.8" rx="0.6" />
      <rect x="0.5" y="9.1" width="18" height="3.8" rx="0.6" />
      <rect x="0" y="17.7" width="20" height="3.8" rx="0.6" />
    </svg>
  );
}

/** Simplified neutral diamond mark. Swap for the official IEEE logo asset (see README). */
export function IeeeMark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden fill="none">
        <path d="M20 2 38 20 20 38 2 20Z" stroke="#fff" strokeWidth="2.4" fill="rgba(255,255,255,.05)" />
        <path d="M20 8v24M8 20h24" stroke="#fff" strokeWidth="2" />
        <path d="M12 12l16 16M28 12 12 28" stroke="#fff" strokeWidth="1" opacity=".5" />
      </svg>
      <span className="font-display text-[1.7rem] font-black leading-none tracking-tight text-white">IEEE</span>
    </span>
  );
}
