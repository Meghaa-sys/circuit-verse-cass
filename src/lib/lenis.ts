import Lenis from 'lenis';

export let lenis: Lenis | null = null;

export function startLenis() {
  if (lenis) return lenis;
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  const raf = (time: number) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  return lenis;
}

export function stopLenis() {
  lenis?.destroy();
  lenis = null;
}

export function scrollToTarget(hash: string) {
  const el = hash === '#' || hash === '#home' ? document.documentElement : document.querySelector(hash);
  if (!el) return;
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: hash === '#home' ? 0 : -64, duration: 1.4 });
  else (el as HTMLElement).scrollIntoView({ behavior: 'smooth' });
}
