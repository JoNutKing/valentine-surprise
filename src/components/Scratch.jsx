import { useState, useRef, useEffect, useCallback } from "react";
import scratchPhoto from "../assets/baby/1.jpg";

// ข้อความให้กำลังใจตามเปอร์เซ็นต์การขูด — เปลี่ยนใหม่ตามขั้น
const MESSAGES = [
  { at: 0, text: "✨ ลบออกดูนะ..." },
  { at: 8, text: "เก่งมาก! ขูดต่อ 💪" },
  { at: 18, text: "เธอทำได้! ✨" },
  { at: 28, text: "สู้ๆ ใกล้แล้ว 💗" },
  { at: 38, text: "อีกนิดเดียว... 💕" },
  { at: 46, text: "เกือบถึงแล้ว 💝" },
];

function pickMessage(pct) {
  let chosen = MESSAGES[0];
  for (const m of MESSAGES) {
    if (pct >= m.at) chosen = m;
  }
  return chosen.text;
}

export default function Scratch({ onComplete }) {
  const canvasRef = useRef(null);
  const [size, setSize] = useState({ w: 280, h: 320 });
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const checkIntervalRef = useRef(null);

  // คำนวณขนาดตามหน้าจอ
  useEffect(() => {
    const calc = () => {
      const max = Math.min(window.innerWidth - 80, 320);
      setSize({ w: max, h: max + 40 });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // วาดชั้นบนของ canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = size.w;
    canvas.height = size.h;

    const grad = ctx.createLinearGradient(0, 0, size.w, size.h);
    grad.addColorStop(0, "#ffd6e0");
    grad.addColorStop(1, "#ffb3c6");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size.w, size.h);

    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, size.w - 20, size.h - 20);

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "600 26px Prompt, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch Me! ✨", size.w / 2, size.h / 2);

    ctx.globalCompositeOperation = "destination-out";
  }, [size]);

  const checkProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const step = 16;
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let total = 0;
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const i = (y * canvas.width + x) * 4;
        if (img.data[i + 3] === 0) cleared++;
        total++;
      }
    }
    const pct = (cleared / total) * 100;
    setProgress(pct);
    if (pct > 50 && !done) {
      setDone(true);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // หน่วงเวลาให้ดูรูปเต็มๆ ก่อนเปลี่ยนหน้า
      setTimeout(() => onComplete(), 2500);
    }
  }, [done, onComplete]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return {
      x: point.clientX - rect.left,
      y: point.clientY - rect.top,
    };
  };

  const drawAt = (p) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    if (lastPoint.current) {
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(p.x, p.y);
      ctx.lineWidth = 36;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
    ctx.fill();
    lastPoint.current = p;
  };

  const start = (e) => {
    e.preventDefault();
    isDrawing.current = true;
    lastPoint.current = null;
    drawAt(getPos(e));
    // เช็คความคืบหน้าเป็นระยะระหว่างที่กำลังขูด เพื่ออัปเดตข้อความให้กำลังใจ
    if (!checkIntervalRef.current) {
      checkIntervalRef.current = setInterval(checkProgress, 250);
    }
  };
  const move = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    drawAt(getPos(e));
  };
  const end = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    lastPoint.current = null;
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
    checkProgress();
  };

  // เคลียร์ interval ตอน unmount
  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, []);

  const message = pickMessage(progress);

  return (
    <div className="flex flex-col items-center no-select">
      <p
        key={message}
        className="mb-6 min-h-[1.5rem] animate-msg-pop text-rose-500"
      >
        {message}
      </p>

      <div className="rounded-3xl bg-white/40 p-3 shadow-xl backdrop-blur">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ width: size.w, height: size.h }}
        >
          {/* ชั้นใต้: รูปที่จะเผยออกมาเมื่อขูด */}
          <div className="absolute inset-0">
            <img
              src={scratchPhoto}
              alt="surprise"
              className="h-full w-full object-cover"
            />
            {/* gradient overlay เบาๆ ให้กลมกลืนกับโทนเพจ */}
            <div className="absolute inset-0 bg-gradient-to-t from-rose-500/20 via-transparent to-rose-200/20" />
            {/* หัวใจกระพริบมุมล่าง */}
            <div className="absolute bottom-3 right-3 animate-heartbeat text-3xl drop-shadow-lg">
              💖
            </div>
          </div>

          {/* ชั้นบน: canvas สำหรับขูด */}
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 touch-none transition-opacity duration-500 ${
              done ? "opacity-0" : "opacity-100"
            }`}
            onMouseDown={start}
            onMouseMove={move}
            onMouseUp={end}
            onMouseLeave={end}
            onTouchStart={start}
            onTouchMove={move}
            onTouchEnd={end}
          />
        </div>
      </div>

      <p className="mt-6 text-sm text-rose-400/80">ใช้นิ้วลูบบนการ์ดเลย 👆</p>

      <style>{`
        @keyframes msg-pop {
          0% { transform: translateY(8px) scale(0.92); opacity: 0; }
          60% { transform: translateY(0) scale(1.05); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-msg-pop {
          animation: msg-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
      `}</style>
    </div>
  );
}
