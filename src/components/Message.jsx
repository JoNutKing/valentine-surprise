import { useEffect, useState } from "react";
import couplePhoto from "../assets/baby/2.jpg";

// กระดาษโน๊ต 3 หน้า — แก้ข้อความได้ตรงนี้เลย
const NOTES = [
  {
    text: ["ขอบคุณที่เลือกอยู่ข้างกันนะ", "เค้าดีใจมากๆๆๆ 💗"],
    sign: "- บี๋เอง -",
    rotate: "-2deg",
    tapeColor: "bg-rose-300/60",
  },
  {
    text: ["ทุกวันที่มีบี๋อยู่คือวัน", "ที่ดีที่สุดของเค้า✨"],
    sign: "- บี๋เอง -",
    rotate: "1.5deg",
    tapeColor: "bg-pink-300/60",
  },
  {
    text: ["เป็นแฟนกันนะคับ ", "ห้ามปฎิเสธ5555 💝"],
    sign: "I Love You 💞",
    rotate: "-1deg",
    tapeColor: "bg-rose-400/60",
  },
];

export default function Message({ onReplay }) {
  const [show, setShow] = useState(false);
  const [noteIndex, setNoteIndex] = useState(0);
  const [showReplay, setShowReplay] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  // โชว์ปุ่ม "ดูอีกครั้ง" หลังเปิดหน้าสุดท้ายสักพัก
  useEffect(() => {
    if (noteIndex === NOTES.length - 1) {
      const t = setTimeout(() => setShowReplay(true), 2200);
      return () => clearTimeout(t);
    }
    setShowReplay(false);
  }, [noteIndex]);

  const isLast = noteIndex === NOTES.length - 1;
  const note = NOTES[noteIndex];

  const handleNoteClick = () => {
    if (!isLast) setNoteIndex((i) => i + 1);
  };

  return (
    <div
      className={`flex flex-col items-center transition-all duration-700 ${
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {/* รูปคู่ */}
      <div className="mb-6 h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-xl transform-gpu">
        <img
          src={couplePhoto}
          alt="us"
          className="h-full w-full object-cover transform-gpu backface-hidden [image-rendering:auto]"
        />
      </div>

      {/* กระดาษโน๊ต — เปลี่ยนเมื่อ noteIndex เปลี่ยน */}
      <div style={{ perspective: "900px" }}>
        <button
          key={noteIndex}
          onClick={handleNoteClick}
          disabled={isLast}
          className="animate-paper-open relative block max-w-xs cursor-pointer rounded-md bg-yellow-50 px-8 py-10 text-center shadow-2xl transition active:scale-[0.98] disabled:cursor-default disabled:active:scale-100"
          style={{
            transform: `rotate(${note.rotate})`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* เทปติดบน */}
          <div
            className={`absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rounded-sm shadow-sm ${note.tapeColor}`}
          />
          <p className="text-lg leading-relaxed text-stone-700">
            {note.text.map((line, i) => (
              <span key={i}>
                {line}
                {i < note.text.length - 1 && <br />}
              </span>
            ))}
          </p>
          <p className="mt-6 text-sm text-rose-400">{note.sign}</p>
        </button>
      </div>

      {/* Dot indicator */}
      <div className="mt-6 flex gap-2">
        {NOTES.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === noteIndex ? "w-6 bg-rose-500" : "w-2 bg-rose-300"
            }`}
          />
        ))}
      </div>

      {/* Hint / Replay button */}
      <div className="mt-5 h-12">
        {!isLast && (
          <p className="animate-bounce-soft text-sm text-rose-400">
            แตะกระดาษเพื่อเปิดต่อ 👆
          </p>
        )}
        {isLast && showReplay && (
          <button
            onClick={onReplay}
            className="animate-paper-open rounded-full border border-rose-400/40 bg-white/70 px-5 py-2 text-sm text-rose-500 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white/90 active:scale-95"
          >
            🔁 ดูอีกครั้ง
          </button>
        )}
      </div>

      {/* หัวใจลอยรอบๆ */}
      <FloatingHearts />

      <style>{`
        @keyframes paper-open {
          0% {
            transform: scale(0.3) rotateX(-80deg) rotate(0deg);
            opacity: 0;
          }
          60% {
            transform: scale(1.06) rotateX(8deg) rotate(var(--final-rot, 0deg));
            opacity: 1;
          }
          100% {
            transform: scale(1) rotateX(0deg) rotate(var(--final-rot, 0deg));
            opacity: 1;
          }
        }
        .animate-paper-open {
          animation: paper-open 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          transform-origin: top center;
        }

        @keyframes bounce-soft {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        .animate-bounce-soft {
          animation: bounce-soft 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function FloatingHearts() {
  const hearts = Array.from({ length: 8 });
  return (
    <div className="pointer-events-none absolute inset-0">
      {hearts.map((_, i) => {
        const left = 10 + Math.random() * 80;
        const delay = Math.random() * 2;
        const dur = 4 + Math.random() * 3;
        return (
          <span
            key={i}
            className="absolute bottom-0 text-2xl"
            style={{
              left: `${left}%`,
              animation: `floatUp ${dur}s ease-in ${delay}s infinite`,
            }}
          >
            💕
          </span>
        );
      })}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-100vh) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
