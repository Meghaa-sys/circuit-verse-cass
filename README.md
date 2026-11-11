# IEEE Circuit Verse — Immersive 3D Event Website

A cinematic, fully responsive website for **IEEE Circuit Verse** (Workshop + Hackathon):
splash intro → real-time 3D electronics lab → About / Events / Workshop / Hackathon / Tracks / Timeline / Prizes / FAQs / Sponsors / Register / Footer.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · Three.js + React Three Fiber + Drei + postprocessing · GSAP (splash & camera) · Framer Motion (UI) · Lenis (smooth scroll)

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build
```

Testing helpers (query string): `?intro=off` skips the splash · `?3d=off|low|high` forces a 3D quality tier.

## ✏️ What you must edit before publishing

Everything editable lives in **`src/data.ts`**:

| Constant | What to do |
|---|---|
| `REGISTER_URL` | Replace `#register` with your real registration form link (all "Register" buttons use it). |
| `WORKSHOP` / `HACKATHON` / `TIMELINE` / `PRIZES` | Dates, venues, team size and prize amounts are marked **TBA** — fill in the real details. |
| `FAQS`, `HACKATHON.tracks`, `BENEFITS` | Indicative copy — adjust to your event rules. |
| `SPONSOR_MAIL`, `SPONSOR_SLOTS` | Placeholder contact e-mail and logo slots. |
| `ORGANISER` | Currently "IEEE Kerala Section" (as in the reference). Change to your branch name if needed. |

**IEEE logo:** the header/footer use a simplified diamond + "IEEE" wordmark (`IeeeMark` in `src/components/ui/Icons.tsx`). Replace it with the official IEEE logo asset supplied by your branch/section.

## How the 3D hero works

`src/components/hero/LabScene.tsx` renders a real WebGL scene — not a flat poster:

- **Lab backdrop** on a plane at depth −8 with animated light pulses locked to the ceiling ring, floor ring, window shaft and monitors → true perspective **mouse parallax** against the foreground.
- **Hooded mascot** (`public/assets/mascot.webp`) on a custom shader: breathing, head sway / cursor follow, pulsing orange circuit lines, **orange rim light**, warm bounce light from the chip, cursor light, floor reflection.
- **3D infinity microchip** (box + instanced glowing pins + logo die), **orbiting energy rings**, **dust particles**, drifting violet **fog**, **bloom + vignette**.
- **Cinematic camera dolly** from the splash into the lab (`src/lib/intro.ts` + GSAP).
- The mascot is positioned by a DOM "slot" in `Hero.tsx`, so the same scene works for the desktop (right side) and mobile (centered) compositions.

**Using a GLB later:** swap `MascotRig` for a drei `useGLTF` model (`gltf-transform optimize --compress meshopt` first). The chip, rings, lights and rig are independent of the mascot.

### Performance & fallbacks
- 3D stack is **lazy-loaded** (separate chunk); the CSS/WebP hero shows instantly underneath and cross-fades.
- Tiers: **high** (desktop: bloom, env reflections, 240 particles) · **low** (mobile: no bloom, 80 particles, lower DPR) · **static** (no WebGL / low-memory / save-data / `prefers-reduced-motion`: layered WebP + CSS float).
- Frame loop pauses when the hero is off-screen; `PerformanceMonitor` drops bloom if the frame rate falls.
- Splash plays once per **session** (`sessionStorage`), has **Skip** (button / Esc / Enter) and is disabled for reduced-motion users.

## Assets (`public/assets`)
`lab-background.webp`, `mascot.webp` (chip + rings removed), `mascot-full.webp` (static fallback), `logo-infinity.webp`.
They were cut from the reference images in `reference/` — regenerate with `python tools/extract_assets.py reference/hero-reference.png reference/lab-background-original.png public/assets`.
For the sharpest result, replace them with the original high-resolution mascot/logo files (same file names).

## Structure
```
src/
  App.tsx                  splash state, smooth scroll, section order
  data.ts                  ALL event copy / links
  components/
    Splash.tsx  Navbar.tsx  Footer.tsx
    hero/Hero.tsx  hero/LabScene.tsx
    sections/  About · Events (overview, workshop, hackathon, tracks) · Timeline · Prizes · Faqs · Sponsors · RegisterCta
    ui/  Btn (magnetic) · TiltCard (3D glass panel) · CursorGlow · Traces · Reveal · Section · Icons
  lib/  env (quality tiers) · intro · lenis · pointer · hooks
tools/extract_assets.py
reference/                 original reference images + brief
```

Palette tokens are in `src/index.css` (`@theme`): night `#0D0A1A`, deep `#1A0F2E`, neon `#A855F7`, ember `#FF7A2E`, lavender `#D8B4FF`.
