"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";

export default function NotFoundGame({ locale }: { locale: 'en' | 'ar' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showHint, setShowHint] = useState(true);

  const playerRef = useRef({ x: 50, y: 90, width: 6, height: 6, speed: 1.5 });
  const enemiesRef = useRef<{ x: number; y: number; width: number; height: number; speed: number }[]>([]);
  const scoreRef = useRef(0);
  const animationRef = useRef<number>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const t = {
    en: { score: "Score", high: "High", start: "Play Survival", over: "System Failure", reboot: "Reboot", hint: "Use Left/Right Arrows or Tap Sides" },
    ar: { score: "النقاط", high: "أعلى", start: "إلعب البقاء", over: "فشل النظام", reboot: "إعادة التشغيل", hint: "استخدم الأسهم يمين/يسار أو اضغط على الجوانب" }
  }[locale];

  useEffect(() => {
    const saved = localStorage.getItem("404_highscore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setShowHint(true);
    scoreRef.current = 0;
    playerRef.current.x = 50;
    enemiesRef.current = [];
    keysRef.current = {};
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
    setTimeout(() => {
      setShowHint(false);
    }, 3000);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
    
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      if (x < rect.width / 2) {
        keysRef.current['ArrowLeft'] = true;
      } else {
        keysRef.current['ArrowRight'] = true;
      }
    };
    const handleTouchEnd = () => {
      keysRef.current['ArrowLeft'] = false;
      keysRef.current['ArrowRight'] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);

    let lastTime = performance.now();
    let spawnTimer = 0;

    const update = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      // Update Player
      const p = playerRef.current;
      const speed = p.speed * (deltaTime * 0.06); 
      
      if ((keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) && p.x > 0) {
        p.x -= speed;
      }
      if ((keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) && p.x < 100 - p.width) {
        p.x += speed;
      }

      // Spawn Enemies
      spawnTimer += deltaTime;
      const spawnRate = Math.max(150, 700 - (scoreRef.current * 1.5));
      if (spawnTimer > spawnRate) {
        enemiesRef.current.push({
          x: Math.random() * (100 - 8),
          y: -10,
          width: 5 + Math.random() * 10,
          height: 5 + Math.random() * 5,
          speed: (1 + Math.random() * 1.5 + (scoreRef.current * 0.005)) * (deltaTime * 0.05)
        });
        spawnTimer = 0;
      }

      // Update Enemies & Collision
      for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
        const e = enemiesRef.current[i];
        e.y += e.speed;

        // Collision Check (AABB)
        // Shrunk hitbox slightly for fairness
        if (
          p.x + 1 < e.x + e.width - 1 &&
          p.x + p.width - 1 > e.x + 1 &&
          p.y + 1 < e.y + e.height - 1 &&
          p.y + p.height - 1 > e.y + 1
        ) {
          setGameOver(true);
          setIsPlaying(false);
          if (scoreRef.current > highScore) {
            setHighScore(Math.floor(scoreRef.current));
            localStorage.setItem("404_highscore", Math.floor(scoreRef.current).toString());
          }
          return;
        }

        if (e.y > 100) {
          enemiesRef.current.splice(i, 1);
        }
      }

      scoreRef.current += deltaTime * 0.01;
      setScore(Math.floor(scoreRef.current));

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scaleX = canvas.width / 100;
      const scaleY = canvas.height / 100;

      const isEmber = document.documentElement.classList.contains("theme-color");
      const isNeumorphic = document.documentElement.classList.contains("theme-neumorphic");
      
      // Player
      ctx.fillStyle = isEmber ? "#FF4F00" : (isNeumorphic ? "#1e293b" : "#000000");
      ctx.fillRect(p.x * scaleX, p.y * scaleY, p.width * scaleX, p.height * scaleY);

      // Glitches
      ctx.fillStyle = isEmber ? "#000000" : (isNeumorphic ? "#ef4444" : "#ff0000");
      enemiesRef.current.forEach(e => {
        ctx.fillRect(e.x * scaleX, e.y * scaleY, e.width * scaleX, e.height * scaleY);
      });

      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, gameOver, highScore]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center animate-fade-in">
      <div className="flex justify-between w-full mb-2 px-2 font-black uppercase tracking-widest text-sm md:text-base">
        <span>{t.score}: {score}</span>
        <span>{t.high}: {highScore}</span>
      </div>
      
      <div 
        className="relative w-full h-[300px] md:h-[400px] bg-zinc-100 dark:bg-zinc-200 border-4 border-black overflow-hidden group shadow-[8px_8px_0px_0px_#000000] focus:outline-none"
        onContextMenu={(e) => e.preventDefault()}
      >
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm z-10">
            <button 
              onClick={startGame}
              className="flex items-center gap-2 bg-black text-white px-8 py-5 text-lg font-black uppercase hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#ff0000] transition-all cursor-pointer"
            >
              <Play size={24} /> {t.start}
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/20 backdrop-blur-md z-10">
            <h3 className="text-4xl md:text-5xl font-black text-red-600 mb-2 uppercase tracking-tighter">{t.over}</h3>
            <p className="text-2xl font-black mb-8 text-black bg-white px-4 py-1 -skew-x-6">{t.score}: {score}</p>
            <button 
              onClick={startGame}
              className="flex items-center gap-2 bg-black text-white px-8 py-5 text-lg font-black uppercase hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#ff0000] transition-all cursor-pointer"
            >
              <RotateCcw size={24} /> {t.reboot}
            </button>
          </div>
        )}

        <canvas 
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-full cursor-none touch-none opacity-80"
          tabIndex={0}
        />
        
        {isPlaying && showHint && (
          <div className="absolute bottom-4 left-0 w-full text-center text-xs md:text-sm font-black text-zinc-500 uppercase opacity-50 pointer-events-none tracking-widest animate-fade-in transition-opacity duration-500">
            {t.hint}
          </div>
        )}
      </div>
    </div>
  );
}
