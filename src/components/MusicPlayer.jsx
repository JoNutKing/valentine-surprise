export default function MusicPlayer({ isPlaying, onToggle, title = "Our Song" }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isPlaying ? "หยุดเพลง" : "เล่นเพลง"}
      className="group flex items-center gap-2 rounded-full border border-white/70 bg-white/40 px-1.5 py-1.5 pr-2.5 shadow-md shadow-rose-300/40 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/60 active:scale-95"
    >
      {/* Vinyl disc */}
      <div
        className="relative h-7 w-7 rounded-full bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 shadow-inner"
        style={{
          animation: isPlaying ? "spin-vinyl 3.5s linear infinite" : "none",
        }}
      >
        <div className="absolute inset-1 rounded-full border border-stone-700/60" />
        <div className="absolute inset-[5px] rounded-full border border-stone-700/40" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
        <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-rose-400 to-pink-500" />
        <div className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-900" />
      </div>

      {/* Title + waveform */}
      <div className="flex flex-col items-start">
        <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-[10px] font-semibold leading-tight text-transparent">
          {title}
        </span>
        <div className="mt-0.5 flex h-2 items-end gap-[2px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-[2px] rounded-full bg-gradient-to-t from-rose-400 to-pink-500"
              style={{
                height: isPlaying ? "100%" : "20%",
                transformOrigin: "bottom",
                animation: isPlaying
                  ? `wave-bar 0.${6 + i}s ease-in-out ${i * 0.08}s infinite alternate`
                  : "none",
                transition: "height 200ms",
              }}
            />
          ))}
        </div>
      </div>

      {/* Play/Pause icon */}
      <div className="ml-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow transition group-hover:shadow-rose-400/60">
        {isPlaying ? (
          <svg width="9" height="10" viewBox="0 0 12 14" fill="currentColor">
            <rect x="0" y="0" width="4" height="14" rx="1.5" />
            <rect x="8" y="0" width="4" height="14" rx="1.5" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 13 14" fill="currentColor">
            <path d="M1 1.3v11.4c0 .9 1 1.5 1.8 1l9.4-5.7c.7-.4.7-1.5 0-1.9L2.8.3C2 -.2 1 .4 1 1.3z" />
          </svg>
        )}
      </div>

      <style>{`
        @keyframes spin-vinyl {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wave-bar {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </button>
  );
}
