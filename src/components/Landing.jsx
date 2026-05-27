import { useState, useRef, useMemo } from "react";
import MusicPlayer from "./MusicPlayer";
import bouquetImg from "../assets/photos/1.png";

const HEART_EMOJIS = ["💖", "💕", "💗", "💝", "❤️", "🌸", "💞"];

export default function Landing({ onNext, isPlaying, onTogglePlay }) {
  const [bursts, setBursts] = useState([]);
  const [pressed, setPressed] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const burstIdRef = useRef(0);

  // หัวใจร่วง — สุ่มครั้งเดียวตอน mount แล้วใช้ตลอด
  const fallingHearts = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 14 + Math.random() * 24,
        duration: 6 + Math.random() * 7,
        delay: Math.random() * 8,
        sway: (Math.random() - 0.5) * 80,
        spin: (Math.random() - 0.5) * 540,
        emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
        opacity: 0.55 + Math.random() * 0.4,
      })),
    [],
  );

  const handleClick = (e) => {
    if (leaving) return;

    // เด้งปุ่ม
    setPressed(true);
    setTimeout(() => setPressed(false), 250);

    // สร้างหัวใจระเบิด 14 ดวงจากจุดที่กด
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const id = ++burstIdRef.current;
    const pieces = Array.from({ length: 14 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const dist = 80 + Math.random() * 90;
      return {
        id: `${id}-${i}`,
        x: cx,
        y: cy,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 40,
        rot: (Math.random() - 0.5) * 360,
        size: 18 + Math.random() * 14,
        emoji: ["💖", "💕", "💗", "💞", "❤️", "🌸"][Math.floor(Math.random() * 6)],
      };
    });
    setBursts((prev) => [...prev, ...pieces]);

    // ลบ particles หลัง animation จบ
    setTimeout(() => {
      setBursts((prev) => prev.filter((p) => !pieces.find((q) => q.id === p.id)));
    }, 1400);

    // fade out แล้วค่อยไปหน้าถัดไป
    setLeaving(true);
    setTimeout(() => onNext(), 750);
  };

  return (
    <>
      {/* หัวใจร่วงจากด้านบน — sibling เพื่อไม่ให้โดน scale ของ fading container */}
      <div
        className={`pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-700 ${leaving ? "opacity-0" : "opacity-100"
          }`}
      >
        {fallingHearts.map((h) => (
          <span
            key={h.id}
            className="falling-heart absolute top-0 will-change-transform"
            style={{
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              opacity: h.opacity,
              "--dur": `${h.duration}s`,
              "--delay": `${h.delay}s`,
              "--sway": `${h.sway}px`,
              "--spin": `${h.spin}deg`,
              filter: "drop-shadow(0 2px 6px rgba(244, 114, 182, 0.4))",
            }}
          >
            {h.emoji}
          </span>
        ))}
      </div>

      <div
        className={`relative z-10 flex -translate-y-12 flex-col items-center text-center transition-all duration-700 ${leaving ? "scale-110 opacity-0" : "scale-100 opacity-100"
          }`}
      >
        <div className="mb-10">
          <MusicPlayer isPlaying={isPlaying} onToggle={onTogglePlay} title="เพลงรัก" />
        </div>

        <h1 className="font-pacifico text-4xl sm:text-5xl md:text-6xl text-rose-500 drop-shadow-[0_2px_4px_rgba(244,114,182,0.3)] leading-snug select-none px-4 flex flex-col items-center gap-1 sm:gap-2">
          <span className="block">May your day be</span>
          <span className="block">as bright as your</span>
          <span className="relative inline-block text-pink-600 font-semibold animate-pulse mt-1 drop-shadow-[0_2px_8px_rgba(219,39,119,0.4)]">
            smile.
            <span className="absolute -bottom-1.5 left-1/2 w-14 h-1 -translate-x-1/2 rounded-full bg-pink-400/30 blur-[2px]" />
          </span>
        </h1>

        <div className="my-8 flex flex-col items-center">
          <div className="animate-float">
            <img
              src={bouquetImg}
              alt="ช่อดอกไม้"
              className="h-44 w-44 object-contain drop-shadow-xl sm:h-52 sm:w-52"
            />
          </div>
          {/* เงาทรงรีบนพื้น — หดและเข้มสลับกับการลอยของช่อดอกไม้ */}
          <div className="-mt-2 h-3 w-28 animate-float-shadow rounded-full bg-rose-600/40 blur-md sm:w-32" />
        </div>

        <button
          onClick={handleClick}
          disabled={leaving}
          className={`relative overflow-hidden rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-8 py-3 text-white shadow-lg shadow-rose-300/50 transition-all duration-200 hover:scale-105 hover:shadow-rose-400/60 active:scale-95 ${pressed ? "scale-90" : ""
            }`}
        >
          {/* ripple shine */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 hover:translate-x-full" />
          <span className="relative inline-flex items-center gap-2">
            ไปต่อเลย!
            <span className="inline-block animate-heartbeat">💝</span>
          </span>
        </button>
      </div>

      {/* หัวใจระเบิด — แยกออกมาเป็น sibling ของ fade container เพื่อไม่ให้โดน scale ของ parent */}
      <div className="pointer-events-none fixed inset-0 z-50">
        {bursts.map((p) => (
          <span
            key={p.id}
            className="burst-piece absolute"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              fontSize: `${p.size}px`,
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              "--rot": `${p.rot}deg`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes burst {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.1) rotate(var(--rot));
            opacity: 0;
          }
        }
        .burst-piece {
          animation: burst 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }

        @keyframes fallDown {
          0% {
            transform: translate3d(0, -10vh, 0) rotate(0deg);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--sway), 110vh, 0) rotate(var(--spin));
            opacity: 0;
          }
        }
        .falling-heart {
          /* backwards = ระหว่าง delay ก่อน animation เริ่ม ให้ใช้ keyframe 0% (อยู่เหนือจอ + opacity 0) */
          animation: fallDown var(--dur) linear var(--delay) infinite backwards;
          opacity: 0;
        }
      `}</style>
    </>
  );
}
