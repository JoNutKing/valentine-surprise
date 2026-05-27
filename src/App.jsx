import { useState, useRef } from "react";
import Landing from "./components/Landing";
import Scratch from "./components/Scratch";
import Message from "./components/Message";
import musicSrc from "./assets/mp3/0527.MP3";

export default function App() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
    } else {
      a.volume = 0.5;
      a.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          /* ไม่มีไฟล์ /music.mp3 หรือ browser block */
        });
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-pink-200 via-pink-100 to-rose-200 font-prompt">
      <Sparkles />

      <audio ref={audioRef} src={musicSrc} loop preload="auto" />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-6">
        {step === 0 && (
          <Landing
            onNext={() => setStep(1)}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
          />
        )}
        {step === 1 && <Scratch onComplete={() => setStep(2)} />}
        {step === 2 && <Message onReplay={() => setStep(0)} />}
      </div>
    </div>
  );
}

function Sparkles() {
  const dots = Array.from({ length: 18 });
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {dots.map((_, i) => {
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const size = 4 + Math.random() * 6;
        const delay = Math.random() * 3;
        return (
          <span
            key={i}
            className="absolute animate-sparkle rounded-full bg-white"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              boxShadow: "0 0 8px rgba(255,255,255,0.8)",
            }}
          />
        );
      })}
    </div>
  );
}
