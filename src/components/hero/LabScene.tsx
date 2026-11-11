import { MutableRefObject, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, PerformanceMonitor, useTexture } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { pointer } from '../../lib/pointer';
import { intro } from '../../lib/intro';
import type { Quality } from '../../lib/env';

/** Geometry of the DOM "slot" the mascot should occupy, in CSS px relative to the canvas stage. */
export type SlotRect = { cx: number; cy: number; w: number; h: number };

const FOV = 34;
const REST_Z = 10;
const BG_Z = -8;
const MASCOT_ASPECT = 1360 / 1060;
const BG_ASPECT = 1672 / 941;
const CHIP = { u: 0.265, v: 0.495 }; // where the hand holds the chip (uv of the mascot art, v from bottom)

const worldPerPx = (stageH: number) => (2 * REST_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))) / stageH;
const damp = THREE.MathUtils.damp;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const hdr = (hex: string, k: number) => new THREE.Color(hex).multiplyScalar(k);

/* ───────────────────────── shared glow sprite texture ───────────────────────── */
let glowTex: THREE.CanvasTexture | null = null;
function getGlow() {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.25, 'rgba(255,255,255,.55)');
  gr.addColorStop(0.6, 'rgba(255,255,255,.12)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  glowTex = new THREE.CanvasTexture(c);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  return glowTex;
}

function Glow({
  position, scale, color, base = 0.4, amp = 0.15, speed = 1, phase = 0,
}: { position: [number, number, number]; scale: [number, number]; color: string; base?: number; amp?: number; speed?: number; phase?: number }) {
  const m = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    if (m.current) m.current.opacity = Math.max(0, base + amp * Math.sin(clock.elapsedTime * speed + phase));
  });
  return (
    <mesh position={position} scale={[scale[0], scale[1], 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial ref={m} map={getGlow()} color={color} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/* ───────────────────────── camera rig (parallax + cinematic dolly) ───────────────────────── */
function Rig() {
  useFrame(({ camera, clock }, dt) => {
    const t = clock.elapsedTime;
    const e = easeInOut(THREE.MathUtils.clamp(intro.p, 0, 1));
    const sc = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    const tx = pointer.active ? pointer.nx : Math.sin(t * 0.32) * 0.5;
    const ty = pointer.active ? pointer.ny : Math.cos(t * 0.27) * 0.35;
    pointer.sx = damp(pointer.sx, tx, 3, dt);
    pointer.sy = damp(pointer.sy, ty, 3, dt);
    camera.position.set(
      pointer.sx * 0.55 * (1 - sc * 0.6),
      pointer.sy * 0.3 + (1 - e) * 0.55,
      THREE.MathUtils.lerp(6.2, REST_Z, e) + sc * 1.5,
    );
    camera.lookAt(0, (1 - e) * 0.25, 0);
    camera.rotation.z += (1 - e) * (1 - e) * 0.05;
  });
  return null;
}

/* ───────────────────────── lab backdrop (real parallax plane + animated light) ───────────────────────── */
function Backdrop({ tex }: { tex: THREE.Texture }) {
  const { size } = useThree();
  const k = worldPerPx(size.height);
  const scale = (REST_Z - BG_Z) / REST_Z;
  const vw = size.width * k * scale * 1.14;
  const vh = size.height * k * scale * 1.14;
  let w = vw;
  let h = w / BG_ASPECT;
  if (h < vh) { h = vh; w = h * BG_ASPECT; }
  const portrait = size.width / size.height < 1;
  const uc = portrait ? 0.6 : 0.5;
  const px = THREE.MathUtils.clamp((0.5 - uc) * w, -(w - vw) / 2, (w - vw) / 2);
  const at = (u: number, v: number): [number, number, number] => [(u - 0.5) * w, (0.5 - v) * h, 0.02];
  const sz = (su: number, sv: number): [number, number] => [su * w, sv * h];
  return (
    <group position={[px, 0, BG_Z]}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} color="#f6f2fb" />
      </mesh>
      {/* animated light pulses locked to features of the lab art */}
      <Glow position={at(0.63, 0.08)} scale={sz(0.52, 0.16)} color="#FF7A2E" base={0.3} amp={0.14} speed={1.2} />
      <Glow position={at(0.63, 0.67)} scale={sz(0.58, 0.17)} color="#FF7A2E" base={0.36} amp={0.18} speed={1.0} phase={1} />
      <Glow position={at(0.55, 0.32)} scale={sz(0.11, 0.62)} color="#D8B4FF" base={0.1} amp={0.05} speed={0.7} />
      <Glow position={at(0.095, 0.38)} scale={sz(0.24, 0.32)} color="#A855F7" base={0.2} amp={0.08} speed={1.7} />
      <Glow position={at(0.9, 0.45)} scale={sz(0.2, 0.22)} color="#A855F7" base={0.17} amp={0.07} speed={1.4} phase={2} />
      <Glow position={at(0.12, 0.8)} scale={sz(0.36, 0.2)} color="#FF7A2E" base={0.2} amp={0.08} speed={0.9} phase={3} />
      <Glow position={at(0.88, 0.84)} scale={sz(0.36, 0.2)} color="#FF7A2E" base={0.18} amp={0.07} speed={1.1} phase={4} />
    </group>
  );
}

/** Slow drifting violet atmosphere at several depths. */
function Fog({ count }: { count: number }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const { size } = useThree();
  const k = worldPerPx(size.height);
  const W = size.width * k;
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.position.x = Math.sin(t * 0.07 + i * 2.1) * W * 0.18 + (i - 1) * W * 0.2;
    });
  });
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} position={[0, -1.2 + i * 0.5, -5 + i * 2.2]} scale={[W * 1.1, 2.6, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={getGlow()} color={i % 2 ? '#7A3BD0' : '#4A2590'} opacity={0.09} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

/* ───────────────────────── mascot (cloak, breathing, head sway, emissive pulse, bounce light) ───────────────────────── */
const mascotVert = /* glsl */ `
uniform float uTime; uniform float uHead;
varying vec2 vUv; varying vec3 vW;
void main(){
  vUv = uv; vec3 p = position;
  float b = sin(uTime*1.25);
  float head = smoothstep(0.30, 0.85, uv.y);
  float torso = 1.0 - smoothstep(0.0, 1.0, abs(uv.y-0.30)/0.45);
  p.x *= 1.0 + 0.0065*b*torso;                       // chest swell
  p.y += 0.0045*b*smoothstep(0.0,1.0,uv.y);          // shoulders / hood lift
  float sway = sin(uTime*0.5)*0.55 + sin(uTime*0.21+1.3)*0.45;
  p.x += head*head*(0.010*sway + 0.014*uHead);       // head looks around / follows cursor
  p.y += head*head*0.003*sin(uTime*0.9);
  vec4 w = modelMatrix*vec4(p,1.0); vW = w.xyz;
  gl_Position = projectionMatrix*viewMatrix*w;
}`;
const mascotFrag = /* glsl */ `
uniform sampler2D uMap; uniform float uTime; uniform vec3 uLightA; uniform float uLightR;
uniform vec3 uLightB; uniform float uReflect; uniform float uOpacity; uniform vec2 uPx;
varying vec2 vUv; varying vec3 vW;
void main(){
  vec4 c = texture2D(uMap, vUv);
  vec3 col = c.rgb; float a = c.a;
  float lum = dot(col, vec3(.2126,.7152,.0722));
  float warm = smoothstep(.18,.8,col.r) * smoothstep(.02,.35,col.r-col.b);
  float pulse = .5+.5*sin(uTime*2.0 + vUv.y*8.0 - vUv.x*3.0);
  col += col*warm*(.22+.5*pulse);                                   // circuit lines & eyes breathe
  float d1 = distance(vW.xy, uLightA.xy)/uLightR;                   // warm bounce from the floating chip
  float la = 1.0/(1.0+d1*d1*2.2); la *= la;
  float flick = .88+.12*sin(uTime*3.1)+.04*sin(uTime*11.0);
  col += vec3(1.,.46,.14)*la*flick*(.08+lum*1.15);
  float d2 = distance(vW.xy, uLightB.xy)/(uLightR*1.2);             // cursor light
  float lb = 1.0/(1.0+d2*d2*3.0); lb *= lb;
  col += vec3(1.,.5,.2)*lb*.45*(.04+lum*1.0)*uLightB.z;
  float ar = texture2D(uMap, vUv+vec2(uPx.x*5.,0.)).a;             // orange rim light (right / below)
  float ab = texture2D(uMap, vUv+vec2(0.,-uPx.y*5.)).a;
  float rim = a*(1.-ar) + a*(1.-ab)*.6;
  col += vec3(1.,.5,.16)*rim*(.5+.35*pulse);
  if (uReflect > .5) { a *= .26*(1.-smoothstep(0.,.5,vUv.y)); col *= .8; }
  else { a *= smoothstep(0.,.13,vUv.y); }                           // sink into the floor haze
  gl_FragColor = vec4(col, a*uOpacity);
  #include <colorspace_fragment>
}`;

function MascotRig({ tex, logo, slot, quality }: { tex: THREE.Texture; logo: THREE.Texture; slot: MutableRefObject<SlotRect>; quality: Quality }) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const refl = useRef<THREE.Mesh>(null);
  const chipG = useRef<THREE.Group>(null);
  const ringsG = useRef<THREE.Group>(null);
  const glowM = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const violet = useRef<THREE.PointLight>(null);
  const { size, gl } = useThree();
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const uniforms = useMemo(() => ({
    uMap: { value: tex }, uTime: { value: 0 }, uHead: { value: 0 },
    uLightA: { value: new THREE.Vector3() }, uLightR: { value: 2 }, uLightB: { value: new THREE.Vector3() },
    uReflect: { value: 0 }, uOpacity: { value: 1 }, uPx: { value: new THREE.Vector2(1 / 1360, 1 / 1060) },
  }), [tex]);
  const reflUniforms = useMemo(() => ({ ...uniforms, uReflect: { value: 1 } }), [uniforms]);

  useFrame(({ clock }, dt) => {
    const s = slot.current;
    if (!s.w || !group.current || !body.current) return;
    const k = worldPerPx(size.height);
    const hPx = Math.min(s.h, (s.w * 1.12) / MASCOT_ASPECT);
    const H = hPx * k;
    const W = H * MASCOT_ASPECT;
    const t = clock.elapsedTime;

    group.current.position.set((s.cx - size.width / 2) * k, -(s.cy - size.height / 2) * k, 0);
    group.current.rotation.y = damp(group.current.rotation.y, pointer.sx * 0.08, 4, dt);
    group.current.rotation.x = damp(group.current.rotation.x, -pointer.sy * 0.035, 4, dt);

    body.current.scale.set(W, H, 1);
    if (refl.current) { refl.current.scale.set(W, -H, 1); refl.current.position.set(0, -H, 0); }

    // chip & rings follow the art's hand position
    const cx = (CHIP.u - 0.5) * W;
    const cy = (CHIP.v - 0.5) * H;
    const unit = H * 0.205;
    if (chipG.current) {
      chipG.current.position.set(cx, cy + Math.sin(t * 1.4) * unit * 0.07, unit * 0.25);
      chipG.current.scale.setScalar(unit);
      chipG.current.rotation.set(0.42 + Math.sin(t * 0.8) * 0.1, t * 0.6, -0.12);
    }
    if (ringsG.current) { ringsG.current.position.set(cx, cy, unit * 0.2); ringsG.current.scale.setScalar(unit); }
    if (glowM.current) {
      glowM.current.position.set(cx, cy, unit * 0.1);
      glowM.current.scale.setScalar(unit * (3.0 + 0.25 * Math.sin(t * 1.6)));
    }
    if (light.current) { light.current.position.set(cx, cy, unit * 1.3); light.current.intensity = 4.6 * unit * unit * (0.9 + 0.1 * Math.sin(t * 3.1)); }
    if (violet.current) { violet.current.position.set(cx - unit * 2.6, cy + unit * 2.4, unit * 2); violet.current.intensity = 5 * unit * unit; }

    // shader uniforms
    uniforms.uTime.value = t;
    uniforms.uHead.value = pointer.sx;
    uniforms.uLightR.value = H * 0.5;
    group.current.updateWorldMatrix(true, false);
    tmp.set(cx, cy, 0).applyMatrix4(group.current.matrixWorld);
    uniforms.uLightA.value.copy(tmp);
    const rect = gl.domElement.getBoundingClientRect();
    const inside = pointer.active && pointer.y > rect.top && pointer.y < rect.bottom;
    uniforms.uLightB.value.set(
      (pointer.x - rect.left - size.width / 2) * k,
      -(pointer.y - rect.top - size.height / 2) * k,
      inside ? 1 : 0,
    );
  });

  return (
    <group ref={group}>
      <mesh ref={body} renderOrder={2}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <shaderMaterial vertexShader={mascotVert} fragmentShader={mascotFrag} uniforms={uniforms} transparent depthWrite={false} />
      </mesh>
      <mesh ref={refl} renderOrder={1}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <shaderMaterial vertexShader={mascotVert} fragmentShader={mascotFrag} uniforms={reflUniforms} transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>

      {/* warm bloom around the chip */}
      <mesh ref={glowM} renderOrder={3}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={getGlow()} color="#FF7A2E" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      <ambientLight intensity={0.35} color="#7a5cc0" />
      <pointLight ref={light} color="#FF7A2E" decay={2} />
      <pointLight ref={violet} color="#A855F7" decay={2} />

      <group ref={chipG} renderOrder={4}><Chip logo={logo} /></group>
      <group ref={ringsG}><Rings quality={quality} /></group>
    </group>
  );
}

/* ───────────────────────── 3D infinity microchip ───────────────────────── */
function Chip({ logo }: { logo: THREE.Texture }) {
  const pins = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = pins.current;
    if (!m) return;
    const o = new THREE.Object3D();
    let i = 0;
    for (let side = 0; side < 4; side++) {
      for (let n = 0; n < 8; n++) {
        const p = -0.385 + n * 0.11;
        const horiz = side < 2;
        const sgn = side % 2 ? -1 : 1;
        o.position.set(horiz ? p : sgn * 0.55, horiz ? sgn * 0.55 : p, 0);
        o.rotation.set(0, 0, 0);
        o.scale.set(horiz ? 0.05 : 0.14, horiz ? 0.14 : 0.05, 0.04);
        o.updateMatrix();
        m.setMatrixAt(i++, o.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
  }, []);
  const edge = useMemo(() => hdr('#FF7A2E', 2.4), []);
  return (
    <>
      <mesh>
        <boxGeometry args={[1, 1, 0.14]} />
        <meshStandardMaterial color="#0c0714" metalness={0.85} roughness={0.34} envMapIntensity={1.3} />
      </mesh>
      <mesh position={[0, 0, 0.072]}>
        <planeGeometry args={[0.84, 0.84]} />
        <meshStandardMaterial color="#140b20" metalness={0.7} roughness={0.42} envMapIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0, 0.076]}>
        <planeGeometry args={[0.66, 0.33]} />
        <meshBasicMaterial map={logo} transparent toneMapped={false} />
      </mesh>
      {[[0, 0.45, 0.9, 0.014], [0, -0.45, 0.9, 0.014], [0.45, 0, 0.014, 0.9], [-0.45, 0, 0.014, 0.9]].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0.077]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial color={edge} toneMapped={false} />
        </mesh>
      ))}
      <instancedMesh ref={pins} args={[undefined, undefined, 32]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffb27a" emissive="#FF7A2E" emissiveIntensity={1.7} metalness={0.9} roughness={0.28} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

/* ───────────────────────── slow orbiting energy rings ───────────────────────── */
const RING_DEFS = [
  { r: 1.05, tilt: [1.15, 0.25, 0.3], speed: 0.55, arc: Math.PI * 1.55, tube: 0.012, k: 2.4 },
  { r: 1.3, tilt: [0.55, -0.75, 0.95], speed: -0.38, arc: Math.PI * 1.25, tube: 0.01, k: 2.0 },
  { r: 1.55, tilt: [1.35, 0.45, -0.55], speed: 0.24, arc: Math.PI * 1.75, tube: 0.008, k: 1.5 },
] as const;

function Rings({ quality }: { quality: Quality }) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  useFrame(({ clock }) => {
    refs.current.forEach((g, i) => { if (g) g.rotation.z = clock.elapsedTime * RING_DEFS[i].speed; });
  });
  return (
    <>
      {RING_DEFS.map((d, i) => (
        <group key={i} rotation={[d.tilt[0], d.tilt[1], d.tilt[2]]}>
          <group ref={(el) => { refs.current[i] = el; }}>
            <mesh>
              <torusGeometry args={[d.r, d.tube, 8, quality === 'high' ? 160 : 96, d.arc]} />
              <meshBasicMaterial color={hdr('#FF7A2E', d.k)} toneMapped={false} />
            </mesh>
            <mesh position={[Math.cos(d.arc) * d.r, Math.sin(d.arc) * d.r, 0]}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshBasicMaterial color={hdr('#FFB074', 3)} toneMapped={false} />
            </mesh>
          </group>
        </group>
      ))}
    </>
  );
}

/* ───────────────────────── floating dust ───────────────────────── */
const dustVert = /* glsl */ `
uniform float uTime; uniform float uPx; uniform vec3 uBox;
attribute float aSeed; attribute float aSize;
varying float vA; varying vec3 vC;
void main(){
  vec3 p = position;
  p.y = mod(p.y + uBox.y*.5 + uTime*(.05+aSeed*.12), uBox.y) - uBox.y*.5;
  p.x += sin(uTime*.3 + aSeed*20.)*.15;
  vec4 mv = modelViewMatrix*vec4(p,1.);
  gl_Position = projectionMatrix*mv;
  gl_PointSize = aSize*uPx*(9.0/-mv.z);
  vA = .3+.7*(.5+.5*sin(uTime*(.8+aSeed*1.5)+aSeed*40.));
  vC = mix(vec3(1.,.48,.18), vec3(.85,.7,1.), step(.72,aSeed));
}`;
const dustFrag = /* glsl */ `
varying float vA; varying vec3 vC;
void main(){
  float d = length(gl_PointCoord-.5);
  float a = smoothstep(.5,0.,d); a *= a;
  gl_FragColor = vec4(vC*1.5, a*vA);
  #include <colorspace_fragment>
}`;

function Dust({ count }: { count: number }) {
  const { size, gl } = useThree();
  const k = worldPerPx(size.height);
  const box = useMemo(() => new THREE.Vector3(size.width * k * 1.7, size.height * k * 1.2, 0), [size.width, size.height, k]);
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * box.x;
      pos[i * 3 + 1] = (Math.random() - 0.5) * box.y;
      pos[i * 3 + 2] = -6 + Math.random() * 9.5;
      seed[i] = Math.random();
      sz[i] = 0.6 + Math.random() * 1.9;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    g.setAttribute('aSize', new THREE.BufferAttribute(sz, 1));
    return g;
  }, [count, box]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPx: { value: gl.getPixelRatio() }, uBox: { value: box } }), [box, gl]);
  useFrame(({ clock }) => { uniforms.uTime.value = clock.elapsedTime; });
  return (
    <points geometry={geo} frustumCulled={false} renderOrder={5}>
      <shaderMaterial vertexShader={dustVert} fragmentShader={dustFrag} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ───────────────────────── scene root ───────────────────────── */
function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    let a = requestAnimationFrame(() => { a = requestAnimationFrame(onReady); });
    return () => cancelAnimationFrame(a);
  }, [onReady]);
  return null;
}

function Scene({ quality, slot, onReady, bloom }: { quality: Quality; slot: MutableRefObject<SlotRect>; onReady: () => void; bloom: boolean }) {
  const [bg, mascot, logo] = useTexture(['/assets/lab-background.webp', '/assets/mascot.webp', '/assets/logo-infinity.webp']);
  useMemo(() => {
    [bg, mascot, logo].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.generateMipmaps = true;
    });
  }, [bg, mascot, logo]);
  const high = quality === 'high';
  return (
    <>
      <Rig />
      <Backdrop tex={bg} />
      <Fog count={high ? 3 : 2} />
      <MascotRig tex={mascot} logo={logo} slot={slot} quality={quality} />
      <Dust count={high ? 240 : 80} />
      {high && (
        <Environment resolution={64} frames={1} background={false}>
          <Lightformer form="rect" intensity={4} color="#FF7A2E" position={[5, 1, 2]} scale={[2, 6, 1]} />
          <Lightformer form="rect" intensity={2.5} color="#A855F7" position={[-5, 2, 3]} scale={[3, 5, 1]} />
          <Lightformer form="ring" intensity={3} color="#FFB074" position={[0, 5, 1]} scale={3} />
        </Environment>
      )}
      {bloom && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom intensity={0.85} luminanceThreshold={0.34} luminanceSmoothing={0.35} mipmapBlur radius={0.72} />
          <Vignette offset={0.28} darkness={0.55} />
        </EffectComposer>
      )}
      <Ready onReady={onReady} />
    </>
  );
}

export default function LabScene({
  quality, slot, active, onReady, adaptive,
}: { quality: Quality; slot: MutableRefObject<SlotRect>; active: boolean; onReady: () => void; adaptive: boolean }) {
  const degraded = useRef(false);
  const [, force] = useForce();
  return (
    <Canvas
      flat
      frameloop={active ? 'always' : 'never'}
      dpr={quality === 'high' ? [1, 1.75] : [1, 1.4]}
      camera={{ fov: FOV, near: 0.1, far: 60, position: [0, 0, REST_Z] }}
      gl={{ antialias: quality === 'high' ? false : true, alpha: false, powerPreference: 'high-performance', stencil: false }}
      onCreated={({ gl }) => gl.setClearColor('#0D0A1A')}
      style={{ position: 'absolute', inset: 0 }}
    >
      {adaptive && <PerformanceMonitor onDecline={() => { degraded.current = true; force(); }} />}
      <Suspense fallback={null}>
        <Scene quality={quality} slot={slot} onReady={onReady} bloom={quality === 'high' && !degraded.current} />
      </Suspense>
    </Canvas>
  );
}

function useForce(): [number, () => void] {
  const [n, setN] = useState(0);
  return [n, () => setN((v) => v + 1)];
}
