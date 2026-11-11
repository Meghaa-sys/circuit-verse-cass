# PROJECT: IEEE CIRCUIT VERSE – IMMERSIVE 3D EVENT WEBSITE

Act as a senior creative developer, 3D web designer and UI/UX engineer. Build a premium, highly interactive, cinematic 3D website for **IEEE Circuit Verse**, an event featuring a Workshop and Hackathon.

Do not create a generic hackathon template. Reproduce the visual direction of the provided references while improving the quality, realism, responsiveness and interactions.

## 1. VISUAL IDENTITY

Use this exact palette:

- Deep Night: #0D0A1A
- Rich Violet: #1A0F2E
- Neon Violet: #A855F7
- Electric Orange: #FF7A2E
- Soft Lavender: #D8B4FF

IMPORTANT:
The infinity logo must retain its violet and lavender identity. Orange must dominate all other environmental lighting, buttons, circuit lines, energy rings and UI highlights.

Typography:
- Headings: Orbitron or Exo 2
- Body: Inter or Space Grotesk
- Technical labels: Space Mono

## 2. SPLASH SCREEN

Before entering the homepage, create a cinematic introductory experience.

Sequence:
1. Show a dark screen with subtle floating particles.
2. Draw orange circuit traces from the screen edges.
3. Reveal the infinity logo with its violet-lavender glow.
4. Animate the CIRCUIT VERSE lettering.
5. Display "INITIALIZING CIRCUIT VERSE..."
6. Create a glowing progress indicator.
7. Transition into the main lab scene using a smooth cinematic camera movement.

Include a Skip Intro option and remember the intro state during the browsing session. Respect prefers-reduced-motion.

Do not make the intro unnecessarily long.

## 3. HERO SECTION – 3D FUTURISTIC LAB

Create a full-screen cinematic 3D electronics research laboratory.

Background:
- Metallic walls and reflective floor.
- Circular illuminated ceiling structure.
- Orange neon light strips.
- Violet ambient light.
- Large futuristic windows.
- Holographic circuit monitors.
- Floating particles and subtle atmospheric fog.
- Orange light reflecting naturally on the floor.

Use the supplied lab-background.webp as the visual base.

Build additional depth with layered objects, lighting and 3D geometry.

## 4. HOODED MASCOT

Place the hooded futuristic character on the right side of the desktop hero.

The character must:
- Have a dark futuristic cloak.
- Have glowing orange eyes.
- Have detailed circuit patterns.
- Hold a floating infinity microchip.
- Have realistic metallic and fabric materials.

Use the supplied mascot asset or a GLB model.

Animations:
- Subtle breathing movement.
- Slight head movement.
- Floating chip rotation.
- Slow orbiting energy rings.
- Orange rim lighting.
- Mouse movement should create subtle parallax.

Do not make the mascot cartoonish.

## 5. HERO CONTENT

Left side:

IEEE PRESENTS

CIRCUIT VERSE

WORKSHOP / HACKATHON

"A two-part tech odyssey to build skills, innovate, and turn circuit ideas into real solutions."

Primary CTA: REGISTER NOW

Secondary CTA: EXPLORE EVENTS

The logo must use its original violet/lavender treatment.

## 6. EVENT CARDS

Create two premium 3D glass-style event cards.

WORKSHOP
- Orange illuminated border.
- Microchip icon.
- "Build skills. Get hands-on with circuits and systems."
- Hover: card slightly lifts, border glows and icon animates.

HACKATHON
- Violet illuminated border.
- Code icon.
- "Innovate, prototype, and solve real-world challenges."
- Hover: subtle 3D tilt and glow.

Cards should be clickable and navigate to their respective event sections.

## 7. INTERACTIONS AND LIGHTING

Use:
- Smooth scroll.
- Mouse-based parallax.
- 3D tilt on cards.
- Cursor-following orange glow.
- Animated circuit traces.
- Floating dust particles.
- Chip rotation.
- Subtle animated light pulses.
- Smooth section transitions.
- Button hover illumination.
- Magnetic CTA interaction where appropriate.

Orange lighting should illuminate nearby objects rather than simply appearing as flat orange borders.

Create realistic bloom, reflections, ambient occlusion and shadows, but optimize rendering performance.

## 8. WEBSITE SECTIONS

Build a complete multi-section website:

1. Splash screen
2. Hero / 3D lab
3. About Circuit Verse
4. Workshop details
5. Hackathon details
6. Event timeline
7. Prizes and benefits
8. FAQs
9. Sponsors and partners
10. Footer with IEEE branding

Keep the design language consistent throughout.

## 9. TECH STACK

Preferred:
- React or Next.js
- TypeScript
- Tailwind CSS
- Three.js / React Three Fiber
- Drei
- GSAP for cinematic transitions
- Framer Motion for UI interactions

Use actual 3D assets where available. Do not fake all 3D effects using a single flat image.

If GLB models are unavailable, use layered PNG assets with Three.js planes, CSS transforms and lighting effects as a fallback.

## 10. RESPONSIVE DESIGN

Desktop:
- Wide 3D environment.
- Text on left, mascot on right.
- Event cards side by side.

Mobile:
- Portrait composition.
- Compact navigation.
- Logo and title first.
- Mascot centered.
- Stacked event cards.
- Full-width CTA buttons.
- Reduced particle count and rendering complexity.

Maintain good text readability and avoid horizontal scrolling.

## 11. PERFORMANCE

- Lazy-load 3D assets.
- Use compressed textures.
- Use optimized GLB models.
- Use WebP images.
- Avoid excessive bloom and particle counts.
- Add a static visual fallback for low-powered devices.
- Ensure fast initial loading.
- Make animations smooth on mobile.

## 12. FINAL EXPECTATION

The result should feel like entering a futuristic innovation laboratory.

It must look premium, immersive, realistic and technically polished.

Do not use generic gradients as a replacement for real lighting. Do not use a flat poster as the entire homepage. Build real interactive sections, functional navigation, responsive layouts and reusable components.

Use the provided visual references as the design direction, not as screenshots to place directly into the website.

Build the complete working website, not just a design mockup.