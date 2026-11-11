import { useEffect, useState } from 'react';

/** Scroll-spy: returns the id of the section currently crossing the middle of the viewport. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '');
  const key = ids.join('|');
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}

export function useScrolled(threshold = 24) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const on = () => setS(window.scrollY > threshold);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [threshold]);
  return s;
}
