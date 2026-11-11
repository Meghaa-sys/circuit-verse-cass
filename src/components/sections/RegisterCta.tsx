import { REGISTER_URL } from '../../data';
import Btn from '../ui/Btn';
import Reveal from '../ui/Reveal';
import { Section } from '../ui/Section';
import { CornerTrace } from '../ui/Traces';

export default function RegisterCta() {
  return (
    <Section id="register" className="overflow-hidden bg-gradient-to-b from-[#120a22] to-night">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,122,46,.4),transparent_65%)]" />
      <Reveal>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-ember/50 bg-gradient-to-br from-[#241238]/90 to-night/90 px-6 py-16 text-center shadow-[0_0_90px_-20px_rgba(255,122,46,.65)] backdrop-blur sm:px-12">
          <CornerTrace className="absolute left-0 top-3 w-40 opacity-80 sm:w-56" />
          <CornerTrace className="absolute right-0 top-3 w-40 -scale-x-100 opacity-80 sm:w-56" />
          <img src="/assets/logo-infinity.webp" alt="" className="floaty mx-auto w-40" style={{ filter: 'drop-shadow(0 0 16px rgba(168,85,247,.7))' }} />
          <h2 className="mt-6 font-display text-3xl font-black uppercase leading-tight tracking-wide text-white sm:text-5xl">
            Ready to enter the <span className="text-ember-glow">Circuit Verse</span>?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">Secure your spot in the Workshop, the Hackathon — or both — and turn circuit ideas into real solutions.</p>
          <div className="mt-9 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center"><Btn href={REGISTER_URL} magnetic arrow="up">Register Now</Btn><Btn href="#timeline" variant="ghost">View timeline</Btn></div>
        </div>
      </Reveal>
    </Section>
  );
}
