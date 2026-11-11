/**
 * Old Anirudh (2012–2015 Golden Era: VIP, Kaththi, Maari, 3) + Massive Cinematic Bass Engine
 *
 * Cinematic Bass Features:
 * - Studio-Grade Mastering Bus with Low-Shelf Sub Booster (+6.5dB @ 80Hz) and Multi-Band Dynamics Compressor
 * - Ultra-Deep Sub-Bass Layer (28Hz–45Hz Sub-Harmonics) shaking the subwoofer
 * - Massive Cinematic Trailer Braams (Detuned low-brass stabs with resonant lowpass filter sweeps)
 * - Cinematic Sub-Boom Trailer Drops (120Hz down to 28Hz earth-shattering impacts)
 * - Punchy Kuthu-Electro Kick with dedicated sub-sine boom
 * - The Iconic Catchy Whistling Lead Motif (VIP / Raghuvaran / Kaththi Swagger Theme)
 * - Groovy Walking Bassline in D-Minor
 * - Distorted Rock Guitar Power Stabs & Crisp Syncopated Folk-Electro Percussion
 * - Weighted Tactile Click SFX (Sub-thud + mechanical snap)
 * - Cinematic Sub-Charge Power-Up & Vacuum Power-Down SFX
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let distortionCurve: Float32Array | null = null;
let isMuted = false;
let isSongPlaying = false;
let loopTimer: number | null = null;

function makeDistortionCurve(amount = 22): Float32Array {
  if (distortionCurve) return distortionCurve;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  distortionCurve = curve;
  return distortionCurve;
}

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      ctx = new AudioCtx();

      // Master gain
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.5, ctx.currentTime);

      // ── Cinematic Low-End Processing Chain ──
      // 1. Low-shelf filter for heavy cinematic sub-bass punch (+6.5dB under 85Hz)
      const lowShelf = ctx.createBiquadFilter();
      lowShelf.type = 'lowshelf';
      lowShelf.frequency.setValueAtTime(85, ctx.currentTime);
      lowShelf.gain.setValueAtTime(6.5, ctx.currentTime);

      // 2. Peaking sub-harmonic boost (+3.5dB at 50Hz for chest-rattling rumble)
      const subRumble = ctx.createBiquadFilter();
      subRumble.type = 'peaking';
      subRumble.frequency.setValueAtTime(50, ctx.currentTime);
      subRumble.gain.setValueAtTime(3.5, ctx.currentTime);
      subRumble.Q.setValueAtTime(1.4, ctx.currentTime);

      // 3. Studio Dynamics Compressor: Glues the mix so heavy bass hits hard without clipping
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-14, ctx.currentTime);
      comp.knee.setValueAtTime(10, ctx.currentTime);
      comp.ratio.setValueAtTime(4.5, ctx.currentTime);
      comp.attack.setValueAtTime(0.003, ctx.currentTime);
      comp.release.setValueAtTime(0.18, ctx.currentTime);

      masterGain.connect(lowShelf);
      lowShelf.connect(subRumble);
      subRumble.connect(comp);
      comp.connect(ctx.destination);
    }
  }
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

export function isAudioMuted(): boolean {
  return isMuted;
}

/**
 * Sound Turn ON effect: Cinematic sub-charge sweep + upbeat ascending whistle chime
 */
export function playTurnOnSound() {
  const c = getContext();
  if (!c) return;

  const now = c.currentTime;

  // 1. Cinematic sub-charge riser (35Hz -> 130Hz)
  const subOsc = c.createOscillator();
  const subGain = c.createGain();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(35, now);
  subOsc.frequency.exponentialRampToValueAtTime(130, now + 0.22);
  subGain.gain.setValueAtTime(0.001, now);
  subGain.gain.linearRampToValueAtTime(0.45, now + 0.12);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
  subOsc.connect(subGain);
  subGain.connect(c.destination);
  subOsc.start(now);
  subOsc.stop(now + 0.25);

  // 2. Ascending whistle notes (D5 -> F#5 -> A5 -> D6)
  const notes = [587.33, 739.99, 880.0, 1174.66];
  notes.forEach((freq, i) => {
    const t = now + 0.04 + i * 0.045;
    const osc = c.createOscillator();
    const gain = c.createGain();
    const filter = c.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.linearRampToValueAtTime(freq * 1.05, t + 0.08);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, t);
    filter.Q.setValueAtTime(4.0, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.32, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);

    osc.start(t);
    osc.stop(t + 0.18);
  });
}

/**
 * Sound Turn OFF effect: Cinematic low-end vacuum collapse & tape brake
 */
export function playTurnOffSound() {
  const c = getContext();
  if (!c) return;

  const now = c.currentTime;

  // 1. High-frequency tape-stop
  const osc = c.createOscillator();
  const gain = c.createGain();
  const filter = c.createBiquadFilter();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(720, now);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.32);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, now);
  filter.frequency.exponentialRampToValueAtTime(70, now + 0.32);

  gain.gain.setValueAtTime(0.32, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);

  osc.start(now);
  osc.stop(now + 0.36);

  // 2. Cinematic sub-bass vacuum drop (95Hz down to 26Hz)
  const subOsc = c.createOscillator();
  const subGain = c.createGain();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(95, now);
  subOsc.frequency.exponentialRampToValueAtTime(26, now + 0.35);
  subGain.gain.setValueAtTime(0.45, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
  subOsc.connect(subGain);
  subGain.connect(c.destination);
  subOsc.start(now);
  subOsc.stop(now + 0.38);
}

/**
 * Toggles audio and plays the corresponding Turn ON / Turn OFF SFX
 */
export function toggleAudio(): boolean {
  isMuted = !isMuted;
  const c = getContext();

  if (isMuted) {
    playTurnOffSound();
    if (c && masterGain) {
      masterGain.gain.setTargetAtTime(0, c.currentTime, 0.08);
    }
  } else {
    playTurnOnSound();
    if (c && masterGain) {
      masterGain.gain.setTargetAtTime(0.5, c.currentTime, 0.08);
      if (!isSongPlaying) {
        startSuperheroTheme();
      }
    }
  }

  return isMuted;
}

/**
 * Weighted tactile click SFX: Sub-thud + mechanical transient snap
 */
export function playClickSound() {
  if (isMuted) return;
  const c = getContext();
  if (!c) return;

  const now = c.currentTime;

  // 1. Subtle cinematic sub-thud (75Hz -> 38Hz)
  const thudOsc = c.createOscillator();
  const thudGain = c.createGain();
  thudOsc.type = 'sine';
  thudOsc.frequency.setValueAtTime(80, now);
  thudOsc.frequency.exponentialRampToValueAtTime(36, now + 0.045);
  thudGain.gain.setValueAtTime(0.38, now);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  thudOsc.connect(thudGain);
  thudGain.connect(c.destination);
  thudOsc.start(now);
  thudOsc.stop(now + 0.055);

  // 2. Snappy transient acoustic click
  const snapOsc = c.createOscillator();
  const snapGain = c.createGain();
  snapOsc.type = 'triangle';
  snapOsc.frequency.setValueAtTime(1650, now);
  snapOsc.frequency.exponentialRampToValueAtTime(220, now + 0.025);
  snapGain.gain.setValueAtTime(0.38, now);
  snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  snapOsc.connect(snapGain);
  snapGain.connect(c.destination);
  snapOsc.start(now);
  snapOsc.stop(now + 0.035);

  // 3. High-energy resonant ping
  const pingOsc = c.createOscillator();
  const pingGain = c.createGain();
  pingOsc.type = 'sine';
  pingOsc.frequency.setValueAtTime(880, now + 0.005);
  pingOsc.frequency.exponentialRampToValueAtTime(1320, now + 0.06);
  pingGain.gain.setValueAtTime(0.24, now + 0.005);
  pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  pingOsc.connect(pingGain);
  pingGain.connect(c.destination);
  pingOsc.start(now + 0.005);
  pingOsc.stop(now + 0.075);
}

/**
 * Old Anirudh High-Energy Beat + Heavy Cinematic Bass
 *
 * 126 BPM Bouncy Kuthu-Rock Fusion + Cinematic Bass Elements:
 * - Earth-shaking 28Hz–45Hz Sub-Bass Layer (Continuous deep rumble)
 * - Cinematic Trailer Braams (Detuned low-brass stabs with resonant sweep)
 * - Cinematic Sub-Boom Drops on Downbeats (120Hz down to 28Hz impact)
 * - The signature Anirudh Whistle Lead (VIP / Raghuvaran / Kaththi Theme)
 * - Heavy Kuthu-Electro Kick with deep sub punch
 * - Groovy Staccato Bassline walking through D-Minor
 * - Distorted Electric Guitar Power Chords (Keba Jeremiah vibe)
 * - Shakers & 16th-note upbeat acoustic rhythm chops
 */
export function startSuperheroTheme() {
  if (isSongPlaying) return;
  const c = getContext();
  if (!c || !masterGain) return;
  const dest: GainNode = masterGain;

  isSongPlaying = true;

  // 126 BPM: Classic energetic tempo of VIP & Kaththi
  const tempo = 126;
  const beatTime = 60 / tempo; // ~0.476s
  const stepTime = beatTime / 4; // 16th note ~0.119s
  const barTime = 16 * stepTime; // 1 bar = 4 beats (~1.905s)
  const loopDuration = 4 * barTime; // 4-bar loop (~7.62s)

  // Master fade-in
  const startTime = c.currentTime;
  dest.gain.setValueAtTime(0.001, startTime);
  dest.gain.linearRampToValueAtTime(isMuted ? 0 : 0.5, startTime + 0.8);

  // Pre-generate noise buffer for snares, claps, shakers
  const noiseBufferSize = c.sampleRate * 0.4;
  const noiseBuffer = c.createBuffer(1, noiseBufferSize, c.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let k = 0; k < noiseBufferSize; k++) {
    noiseData[k] = Math.random() * 2 - 1;
  }

  // Distortion curve for electric guitar stabs & saturated bass
  const distCurve = makeDistortionCurve(24) as unknown as Float32Array<ArrayBuffer>;

  const play4BarLoop = () => {
    if (!isSongPlaying || !c) return;
    const t0 = c.currentTime;

    for (let bar = 0; bar < 4; bar++) {
      const barStart = t0 + bar * barTime;

      // ── 1. CINEMATIC SUB-BOOM IMPACT DROP (Earth-Shaking Sub on Bar 1 & Bar 3) ──
      if (bar === 0 || bar === 2) {
        // Deep sub-harmonic sine drop (120Hz -> 28Hz)
        const boomOsc = c.createOscillator();
        const boomGain = c.createGain();

        boomOsc.type = 'sine';
        boomOsc.frequency.setValueAtTime(120, barStart);
        boomOsc.frequency.exponentialRampToValueAtTime(28, barStart + 0.35);

        boomGain.gain.setValueAtTime(0.95, barStart);
        boomGain.gain.exponentialRampToValueAtTime(0.001, barStart + 1.2);

        boomOsc.connect(boomGain);
        boomGain.connect(dest);

        boomOsc.start(barStart);
        boomOsc.stop(barStart + 1.25);

        // Orchestral taiko / low-tom body impact
        const tomOsc = c.createOscillator();
        const tomGain = c.createGain();
        const tomFilter = c.createBiquadFilter();

        tomOsc.type = 'triangle';
        tomOsc.frequency.setValueAtTime(95, barStart);
        tomOsc.frequency.exponentialRampToValueAtTime(42, barStart + 0.18);

        tomFilter.type = 'lowpass';
        tomFilter.frequency.setValueAtTime(420, barStart);
        tomFilter.frequency.exponentialRampToValueAtTime(90, barStart + 0.4);

        tomGain.gain.setValueAtTime(0.65, barStart);
        tomGain.gain.exponentialRampToValueAtTime(0.001, barStart + 0.45);

        tomOsc.connect(tomFilter);
        tomFilter.connect(tomGain);
        tomGain.connect(dest);

        tomOsc.start(barStart);
        tomOsc.stop(barStart + 0.48);
      }

      // ── 2. CINEMATIC BRASS BRAAMS (Trailer Low-Brass Impacts on Beat 1 & Beat 3) ──
      const brassBeats = [0, 8];
      brassBeats.forEach((step) => {
        const bTime = barStart + step * stepTime;
        const rootFreq = bar === 2 ? 65.41 : 73.42; // C2 or D2
        // Sub D1 (36.71Hz), D2 (73.42Hz), A2 (110Hz)
        const chord = [rootFreq * 0.5, rootFreq, rootFreq * 1.5];

        chord.forEach((freq, idx) => {
          const bOsc1 = c.createOscillator();
          const bOsc2 = c.createOscillator();
          const bFilter = c.createBiquadFilter();
          const bGain = c.createGain();

          bOsc1.type = 'sawtooth';
          bOsc2.type = 'sawtooth';
          bOsc1.frequency.setValueAtTime(freq - 0.7, bTime);
          bOsc2.frequency.setValueAtTime(freq + 0.7, bTime);

          // Resonant lowpass filter sweep gives the signature "BRAAAM" growl
          bFilter.type = 'lowpass';
          bFilter.frequency.setValueAtTime(180, bTime);
          bFilter.frequency.linearRampToValueAtTime(1600, bTime + 0.08);
          bFilter.frequency.exponentialRampToValueAtTime(260, bTime + 0.4);
          bFilter.Q.setValueAtTime(4.5, bTime);

          bGain.gain.setValueAtTime(0.001, bTime);
          bGain.gain.linearRampToValueAtTime(idx === 0 ? 0.45 : 0.22, bTime + 0.025);
          bGain.gain.exponentialRampToValueAtTime(0.001, bTime + 0.48);

          bOsc1.connect(bFilter);
          bOsc2.connect(bFilter);
          bFilter.connect(bGain);
          bGain.connect(dest);

          bOsc1.start(bTime);
          bOsc2.start(bTime);
          bOsc1.stop(bTime + 0.5);
          bOsc2.stop(bTime + 0.5);
        });
      });

      // ── 3. ULTRA-DEEP CONTINUOUS SUB-BASS DRONE (28Hz - 45Hz Foundation) ──
      // Sustained sub frequencies grounding the entire progression
      const rootSub = bar === 2 ? 32.70 : bar === 3 ? 36.71 : 36.71; // C1 or D1
      const subDroneOsc = c.createOscillator();
      const subDroneGain = c.createGain();

      subDroneOsc.type = 'sine';
      subDroneOsc.frequency.setValueAtTime(rootSub, barStart);

      subDroneGain.gain.setValueAtTime(0.001, barStart);
      subDroneGain.gain.linearRampToValueAtTime(0.52, barStart + 0.05);
      subDroneGain.gain.setValueAtTime(0.5, barStart + barTime * 0.85);
      subDroneGain.gain.linearRampToValueAtTime(0.001, barStart + barTime);

      subDroneOsc.connect(subDroneGain);
      subDroneGain.connect(dest);

      subDroneOsc.start(barStart);
      subDroneOsc.stop(barStart + barTime + 0.02);

      // ── 4. HEAVY PUNCHY KUTHU KICK WITH 40Hz SUB BOOM ──
      const kickSteps = [0, 6, 10];
      kickSteps.forEach((step) => {
        const kTime = barStart + step * stepTime;

        // Layer A: Punch transient (165Hz -> 50Hz)
        const kOsc = c.createOscillator();
        const kGain = c.createGain();
        kOsc.type = 'sine';
        kOsc.frequency.setValueAtTime(165, kTime);
        kOsc.frequency.exponentialRampToValueAtTime(48, kTime + 0.1);
        kGain.gain.setValueAtTime(0.95, kTime);
        kGain.gain.exponentialRampToValueAtTime(0.001, kTime + 0.22);
        kOsc.connect(kGain);
        kGain.connect(dest);
        kOsc.start(kTime);
        kOsc.stop(kTime + 0.24);

        // Layer B: Heavy 38Hz sub-bass chest thump
        const subKick = c.createOscillator();
        const subKickGain = c.createGain();
        subKick.type = 'sine';
        subKick.frequency.setValueAtTime(75, kTime);
        subKick.frequency.exponentialRampToValueAtTime(36, kTime + 0.15);
        subKickGain.gain.setValueAtTime(0.75, kTime);
        subKickGain.gain.exponentialRampToValueAtTime(0.001, kTime + 0.26);
        subKick.connect(subKickGain);
        subKickGain.connect(dest);
        subKick.start(kTime);
        subKick.stop(kTime + 0.28);
      });

      // Snappy Snare / Clap on Beat 2 (step 4) & Beat 4 (step 12)
      [4, 12].forEach((sStep) => {
        const sTime = barStart + sStep * stepTime;

        // Snare noise crack
        const sNoise = c.createBufferSource();
        sNoise.buffer = noiseBuffer;
        const sFilter = c.createBiquadFilter();
        sFilter.type = 'bandpass';
        sFilter.frequency.setValueAtTime(1600, sTime);
        sFilter.Q.setValueAtTime(1.8, sTime);

        const sGain = c.createGain();
        sGain.gain.setValueAtTime(0.38, sTime);
        sGain.gain.exponentialRampToValueAtTime(0.001, sTime + 0.12);

        sNoise.connect(sFilter);
        sFilter.connect(sGain);
        sGain.connect(dest);

        sNoise.start(sTime);
        sNoise.stop(sTime + 0.14);

        // Body snap
        const bodyOsc = c.createOscillator();
        const bodyGain = c.createGain();
        bodyOsc.type = 'triangle';
        bodyOsc.frequency.setValueAtTime(220, sTime);
        bodyOsc.frequency.exponentialRampToValueAtTime(80, sTime + 0.07);
        bodyGain.gain.setValueAtTime(0.42, sTime);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, sTime + 0.08);

        bodyOsc.connect(bodyGain);
        bodyGain.connect(dest);

        bodyOsc.start(sTime);
        bodyOsc.stop(sTime + 0.09);
      });

      // Syncopated Kuthu Ghost Rim Taps on steps 7 and 14
      [7, 14].forEach((gStep) => {
        const gTime = barStart + gStep * stepTime;
        const rimOsc = c.createOscillator();
        const rimGain = c.createGain();
        rimOsc.type = 'triangle';
        rimOsc.frequency.setValueAtTime(540, gTime);
        rimOsc.frequency.exponentialRampToValueAtTime(180, gTime + 0.035);
        rimGain.gain.setValueAtTime(0.22, gTime);
        rimGain.gain.exponentialRampToValueAtTime(0.001, gTime + 0.04);
        rimOsc.connect(rimGain);
        rimGain.connect(dest);
        rimOsc.start(gTime);
        rimOsc.stop(gTime + 0.045);
      });

      // 16th-Note Shakers / Hi-Hats with Upbeat Accents
      for (let s = 0; s < 16; s++) {
        const isRoll = bar === 3 && s >= 14;
        const hits = isRoll ? 2 : 1;

        for (let h = 0; h < hits; h++) {
          const hTime = barStart + (s + h * 0.5) * stepTime;
          const hNoise = c.createBufferSource();
          hNoise.buffer = noiseBuffer;

          const hFilter = c.createBiquadFilter();
          hFilter.type = 'highpass';
          hFilter.frequency.setValueAtTime(6800, hTime);

          const hGain = c.createGain();
          const isUpbeat = s % 4 === 2;
          const vol = isRoll ? 0.2 : isUpbeat ? 0.22 : 0.11;
          hGain.gain.setValueAtTime(vol, hTime);
          hGain.gain.exponentialRampToValueAtTime(0.001, hTime + 0.035);

          hNoise.connect(hFilter);
          hFilter.connect(hGain);
          hGain.connect(dest);

          hNoise.start(hTime);
          hNoise.stop(hTime + 0.04);
        }
      }

      // ── 5. GROOVY WALKING BASSLINE WITH SUB-BODY IN D-MINOR ──
      const bassPattern = bar === 0
        ? [
            { step: 0, freq: 73.42, dur: 1.5 }, // D2
            { step: 3, freq: 73.42, dur: 1.5 }, // D2
            { step: 6, freq: 87.31, dur: 1.5 }, // F2
            { step: 8, freq: 98.00, dur: 1.5 }, // G2
            { step: 10, freq: 110.0, dur: 1.5 }, // A2
            { step: 12, freq: 98.00, dur: 1.5 }, // G2
            { step: 14, freq: 87.31, dur: 1.5 }, // F2
          ]
        : bar === 1
        ? [
            { step: 0, freq: 73.42, dur: 1.5 }, // D2
            { step: 3, freq: 87.31, dur: 1.5 }, // F2
            { step: 6, freq: 98.00, dur: 1.5 }, // G2
            { step: 8, freq: 110.0, dur: 1.5 }, // A2
            { step: 10, freq: 130.81, dur: 1.5 }, // C3
            { step: 12, freq: 110.0, dur: 1.5 }, // A2
            { step: 14, freq: 98.00, dur: 1.5 }, // G2
          ]
        : bar === 2
        ? [
            { step: 0, freq: 65.41, dur: 1.5 }, // C2
            { step: 3, freq: 73.42, dur: 1.5 }, // D2
            { step: 6, freq: 87.31, dur: 1.5 }, // F2
            { step: 8, freq: 98.00, dur: 1.5 }, // G2
            { step: 10, freq: 110.0, dur: 1.5 }, // A2
            { step: 12, freq: 98.00, dur: 1.5 }, // G2
            { step: 14, freq: 87.31, dur: 1.5 }, // F2
          ]
        : [
            { step: 0, freq: 73.42, dur: 1.5 }, // D2
            { step: 4, freq: 87.31, dur: 1.5 }, // F2
            { step: 8, freq: 98.00, dur: 1.5 }, // G2
            { step: 10, freq: 103.83, dur: 1.5 }, // G#2
            { step: 12, freq: 110.0, dur: 1.5 }, // A2
            { step: 14, freq: 73.42, dur: 2.0 }, // D2
          ];

      bassPattern.forEach((bp) => {
        const bpTime = barStart + bp.step * stepTime;
        const bpDur = bp.dur * stepTime;

        // Primary slap bass
        const bOsc = c.createOscillator();
        const bFilter = c.createBiquadFilter();
        const bGain = c.createGain();

        bOsc.type = 'sawtooth';
        bOsc.frequency.setValueAtTime(bp.freq, bpTime);

        bFilter.type = 'lowpass';
        bFilter.frequency.setValueAtTime(1200, bpTime);
        bFilter.frequency.exponentialRampToValueAtTime(180, bpTime + bpDur * 0.8);
        bFilter.Q.setValueAtTime(4.2, bpTime);

        bGain.gain.setValueAtTime(0.001, bpTime);
        bGain.gain.linearRampToValueAtTime(0.58, bpTime + 0.015);
        bGain.gain.exponentialRampToValueAtTime(0.001, bpTime + bpDur);

        bOsc.connect(bFilter);
        bFilter.connect(bGain);
        bGain.connect(dest);

        bOsc.start(bpTime);
        bOsc.stop(bpTime + bpDur + 0.02);

        // Sub-harmonic octave underneath (Sub D1 / F1 / G1)
        const subBOsc = c.createOscillator();
        const subBGain = c.createGain();
        subBOsc.type = 'sine';
        subBOsc.frequency.setValueAtTime(bp.freq * 0.5, bpTime);
        subBGain.gain.setValueAtTime(0.48, bpTime);
        subBGain.gain.exponentialRampToValueAtTime(0.001, bpTime + bpDur);
        subBOsc.connect(subBGain);
        subBGain.connect(dest);
        subBOsc.start(bpTime);
        subBOsc.stop(bpTime + bpDur + 0.02);
      });

      // ── 6. DISTORTED ELECTRIC GUITAR POWER CHORDS ──
      if (bar === 0 || bar === 2) {
        const powerChord = [146.83, 220.0, 293.66]; // D3, A3, D4
        powerChord.forEach((freq) => {
          const gOsc = c.createOscillator();
          const gDist = c.createWaveShaper();
          const gFilter = c.createBiquadFilter();
          const gGain = c.createGain();

          gOsc.type = 'sawtooth';
          gOsc.frequency.setValueAtTime(freq, barStart);

          gDist.curve = distCurve;
          gFilter.type = 'lowpass';
          gFilter.frequency.setValueAtTime(2200, barStart);
          gFilter.frequency.exponentialRampToValueAtTime(500, barStart + 0.26);

          gGain.gain.setValueAtTime(0.18, barStart);
          gGain.gain.exponentialRampToValueAtTime(0.001, barStart + 0.32);

          gOsc.connect(gDist);
          gDist.connect(gFilter);
          gFilter.connect(gGain);
          gGain.connect(dest);

          gOsc.start(barStart);
          gOsc.stop(barStart + 0.34);
        });
      }

      // ── 7. THE ICONIC "OLD ANIRUDH" WHISTLE LEAD (VIP / Kaththi Theme) ──
      const whistleMelodyMap: Record<number, Array<{ step: number; freq: number; durSteps: number; glideTo?: number }>> = {
        0: [
          // Bar 1: D5 -> D5 -> F5 -> G5 -> A5
          { step: 0, freq: 587.33, durSteps: 1.5 },
          { step: 2, freq: 587.33, durSteps: 1.5 },
          { step: 4, freq: 698.46, durSteps: 1.5 },
          { step: 6, freq: 783.99, durSteps: 1.5 },
          { step: 8, freq: 880.00, durSteps: 4.5, glideTo: 900.00 },
          { step: 13, freq: 783.99, durSteps: 1.2 },
          { step: 14.5, freq: 698.46, durSteps: 1.5 },
        ],
        1: [
          // Bar 2: G5 -> A5 -> C6 -> A5 -> G5 -> F5 -> D5
          { step: 0, freq: 783.99, durSteps: 1.5 },
          { step: 2, freq: 880.00, durSteps: 1.5 },
          { step: 4, freq: 1046.50, durSteps: 2.5, glideTo: 1046.50 },
          { step: 7, freq: 880.00, durSteps: 2.0 },
          { step: 9.5, freq: 783.99, durSteps: 1.5 },
          { step: 11.5, freq: 698.46, durSteps: 1.5 },
          { step: 13.5, freq: 587.33, durSteps: 2.5 },
        ],
        2: [
          // Bar 3: D5 -> F5 -> G5 -> A5 -> D6
          { step: 0, freq: 587.33, durSteps: 1.5 },
          { step: 2, freq: 698.46, durSteps: 1.5 },
          { step: 4, freq: 783.99, durSteps: 1.5 },
          { step: 6, freq: 880.00, durSteps: 2.0 },
          { step: 8, freq: 1174.66, durSteps: 3.5, glideTo: 1174.66 },
          { step: 12, freq: 1046.50, durSteps: 1.8 },
          { step: 14, freq: 880.00, durSteps: 2.0 },
        ],
        3: [
          // Bar 4: Cascading drop: C6 -> A5 -> G5 -> F5 -> G5 -> F5 -> D5
          { step: 0, freq: 1046.50, durSteps: 1.2 },
          { step: 1.5, freq: 880.00, durSteps: 1.2 },
          { step: 3, freq: 783.99, durSteps: 1.2 },
          { step: 4.5, freq: 698.46, durSteps: 1.5 },
          { step: 6.5, freq: 783.99, durSteps: 1.5 },
          { step: 8.5, freq: 698.46, durSteps: 2.0 },
          { step: 11, freq: 587.33, durSteps: 4.5, glideTo: 587.33 },
        ],
      };

      const melody = whistleMelodyMap[bar] || [];
      melody.forEach((w) => {
        const wTime = barStart + w.step * stepTime;
        const wDur = w.durSteps * stepTime;

        const wOsc = c.createOscillator();
        const wFilter = c.createBiquadFilter();
        const wGain = c.createGain();

        wOsc.type = 'sine';
        wOsc.frequency.setValueAtTime(w.freq, wTime);
        if (w.glideTo && w.glideTo !== w.freq) {
          wOsc.frequency.linearRampToValueAtTime(w.glideTo, wTime + wDur * 0.7);
        }

        wFilter.type = 'bandpass';
        wFilter.frequency.setValueAtTime(w.freq, wTime);
        wFilter.Q.setValueAtTime(5.8, wTime);

        wGain.gain.setValueAtTime(0.001, wTime);
        wGain.gain.linearRampToValueAtTime(0.28, wTime + 0.02);
        wGain.gain.setValueAtTime(0.26, wTime + wDur * 0.75);
        wGain.gain.exponentialRampToValueAtTime(0.001, wTime + wDur);

        wOsc.connect(wFilter);
        wFilter.connect(wGain);
        wGain.connect(dest);

        wOsc.start(wTime);
        wOsc.stop(wTime + wDur + 0.02);
      });
    }
  };

  play4BarLoop();
  const loopIntervalMs = Math.round(loopDuration * 1000) - 20;
  loopTimer = window.setInterval(play4BarLoop, loopIntervalMs);
}

export function stopSuperheroTheme() {
  if (loopTimer) {
    clearInterval(loopTimer);
    loopTimer = null;
  }
  if (ctx && masterGain) {
    masterGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  }
  isSongPlaying = false;
}

// Aliases for convenience & backward compatibility
export const startOldAnirudhBeat = startSuperheroTheme;
export const stopOldAnirudhBeat = stopSuperheroTheme;
export const startRoddyTheme = startSuperheroTheme;
export const stopRoddyTheme = stopSuperheroTheme;

// Auto-resume audio on first user gesture if browser suspended AudioContext
if (typeof window !== 'undefined') {
  const unlock = () => {
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  };
  window.addEventListener('click', unlock, { passive: true });
  window.addEventListener('touchstart', unlock, { passive: true });
  window.addEventListener('keydown', unlock, { passive: true });
}
