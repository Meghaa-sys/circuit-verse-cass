import { useEffect, useState } from 'react';

function useMedia(query: string, initial = false) {
  const [v, setV] = useState(() => (typeof window === 'undefined' ? initial : window.matchMedia(query).matches));
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setV(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return v;
}

export const usePrefersReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)');
export const useIsMobile = () => useMedia('(max-width: 1023px)');
export const useIsCoarse = () => useMedia('(pointer: coarse)');

export type Quality = 'static' | 'low' | 'high';

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function isLowPower(): boolean {
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (n.deviceMemory !== undefined && n.deviceMemory <= 2) ||
    (n.hardwareConcurrency !== undefined && n.hardwareConcurrency <= 2) ||
    !!n.connection?.saveData;
}

/** Decides how much 3D to run. `?3d=off|low|high` overrides for testing. */
export function pickQuality(reducedMotion: boolean, mobile: boolean): Quality {
  const force = new URLSearchParams(location.search).get('3d');
  if (force === 'off') return 'static';
  if (force === 'low' || force === 'high') return force;
  if (reducedMotion || !hasWebGL() || isLowPower()) return 'static';
  return mobile ? 'low' : 'high';
}
