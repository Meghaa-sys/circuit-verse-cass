import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isAudioMuted, toggleAudio } from '../../lib/audio';

export default function SoundToggle({ className = '' }: { className?: string }) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(isAudioMuted());
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = toggleAudio();
    setMuted(next);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={muted ? 'Unmute Anirudh beat' : 'Mute music'}
      title={muted ? 'Enable Anirudh beat' : 'Mute music'}
      className={`group relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md transition-all hover:border-ember hover:bg-white/10 hover:text-ember hover:shadow-[0_0_18px_rgba(255,122,46,.5)] ${className}`}
    >
      {muted ? (
        <VolumeX size={16} className="text-white/50 transition-colors group-hover:text-ember" />
      ) : (
        <div className="flex items-center gap-1">
          <Volume2 size={16} className="text-ember animate-pulse" />
          <span className="flex items-end gap-[2px] h-3">
            <span className="w-[2px] h-full bg-ember rounded-full animate-[soundWave_0.8s_ease-in-out_infinite]" />
            <span className="w-[2px] h-2/3 bg-lav rounded-full animate-[soundWave_0.8s_ease-in-out_0.2s_infinite]" />
            <span className="w-[2px] h-4/5 bg-neon rounded-full animate-[soundWave_0.8s_ease-in-out_0.4s_infinite]" />
          </span>
        </div>
      )}
      <span className="tech-label text-[10px] tracking-wider hidden sm:inline">
        {muted ? 'MUSIC OFF' : 'MUSIC ON'}
      </span>
      <style>{`
        @keyframes soundWave {
          0%, 100% { height: 25%; }
          50% { height: 100%; }
        }
      `}</style>
    </button>
  );
}

