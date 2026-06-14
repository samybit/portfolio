"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";

const LEVELS = [
  {
    // Level 1: The Gap
    start: { x: 50, y: 150 },
    exit: { x: 700, y: 150, w: 40, h: 40 },
    platforms: [
      { x: 0, y: 200, w: 200, h: 400 },
      { x: 600, y: 200, w: 200, h: 400 },
    ],
    hint: {
      en: "Left Click to shoot a stake into the floor. Hold Right Click to pull it up. Press R to recall stakes.",
      ar: "انقر يساراً لإطلاق وتد في الأرضية ويمينياً لسحبها لأعلى للعبور. اضغط R لاسترجاع الأوتاد."
    }
  },
  {
    // Level 2: The Chimney
    start: { x: 50, y: 500 },
    exit: { x: 700, y: 100, w: 40, h: 40 },
    platforms: [
      { x: 0, y: 540, w: 800, h: 60 },
      { x: 0, y: 150, w: 300, h: 20 },
      { x: 650, y: 140, w: 150, h: 20 },
    ],
    hint: {
      en: "Pull a wall inward to create a narrow chimney. Wall-jump up it.",
      ar: "اسحب الحائط للداخل لإنشاء مدخنة ضيقة. اقفز بين الحوائط للصعود."
    }
  },
  {
    // Level 3: The Recall
    start: { x: 50, y: 500 },
    exit: { x: 700, y: 500, w: 40, h: 40 },
    platforms: [
      { x: 0, y: 540, w: 200, h: 60 },
      { x: 300, y: 200, w: 50, h: 400 }, // Middle low wall (blocks floor, must go over)
      { x: 500, y: 0, w: 50, h: 400 },   // Right high wall (blocks ceiling, must go under)
      { x: 600, y: 540, w: 200, h: 60 },
    ],
    hint: {
      en: "Pull the floor up to cross the first wall, then press R to drop the floor and go under the second.",
      ar: "اسحب الأرضية لأعلى لعبور الحائط الأول، ثم اضغط R لإسقاط الأرضية والمرور تحت الثاني."
    }
  },
  {
    // Level 4: The Crush
    start: { x: 50, y: 500 },
    exit: { x: 50, y: 50, w: 40, h: 40 },
    platforms: [
      { x: 0, y: 540, w: 200, h: 60 },
      { x: 300, y: 350, w: 200, h: 20 },
      { x: 0, y: 150, w: 200, h: 20 },
    ],
    hint: {
      en: "Careful not to get crushed between the moving frame and static platforms.",
      ar: "احذر من الانسحاق بين الإطار المتحرك والمنصات الثابتة."
    }
  }
];

export default function WindowframeGame({ locale }: { locale: 'en' | 'ar' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);

  const t = {
    en: { lvl: "Level", start: "Play Frameshift", over: "Crushed", reboot: "Restart", won: "System Escaped!", next: "Next Level", finish: "Finish" },
    ar: { lvl: "مرحلة", start: "إلعب إزاحة الإطار", over: "انسحاق", reboot: "إعادة", won: "تم الهروب!", next: "المرحلة التالية", finish: "انهاء" }
  }[locale];

  const stateRef = useRef({
    frame: { top: 0, bottom: 600, left: 0, right: 800 },
    player: { x: 50, y: 500, w: 20, h: 20, vx: 0, vy: 0, onGround: false },
    projectiles: [] as { x: number, y: number, vx: number, vy: number }[],
    stakes: [] as { edge: 'top'|'bottom'|'left'|'right', offset: number }[],
    keys: {} as { [key: string]: boolean },
    mouse: { x: 400, y: 300, leftPressed: false, rightDown: false },
    lastTime: 0
  });

  const animationRef = useRef<number>(null);

  const loadLevel = (levelIndex: number) => {
    const lvl = LEVELS[levelIndex];
    if (!lvl) return;
    stateRef.current = {
      frame: { top: 0, bottom: 600, left: 0, right: 800 },
      player: { x: lvl.start.x, y: lvl.start.y, w: 20, h: 20, vx: 0, vy: 0, onGround: false },
      projectiles: [],
      stakes: [],
      keys: {},
      mouse: { x: 400, y: 300, leftPressed: false, rightDown: false },
      lastTime: performance.now()
    };
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setGameWon(false);
    setCurrentLevel(0);
    loadLevel(0);
    if (canvasRef.current) canvasRef.current.focus();
  };

  const nextLevel = () => {
    if (currentLevel + 1 >= LEVELS.length) {
      setIsPlaying(false);
      setGameWon(true);
      return;
    }
    const next = currentLevel + 1;
    setCurrentLevel(next);
    setGameOver(false);
    loadLevel(next);
    if (canvasRef.current) canvasRef.current.focus();
  };

  const restartLevel = () => {
    setGameOver(false);
    loadLevel(currentLevel);
    if (canvasRef.current) canvasRef.current.focus();
  };

  useEffect(() => {
    if (!isPlaying || gameOver || gameWon) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- Strict Context Menu Blocking ---
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    canvas.addEventListener("contextmenu", blockContextMenu, { passive: false });

    const handleKeyDown = (e: KeyboardEvent) => { stateRef.current.keys[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { stateRef.current.keys[e.key] = false; };
    
    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = 800 / rect.width;
      const scaleY = 600 / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const pos = getMousePos(e);
      stateRef.current.mouse.x = pos.x;
      stateRef.current.mouse.y = pos.y;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) stateRef.current.mouse.leftPressed = true;
      if (e.button === 2) {
        e.preventDefault();
        e.stopPropagation();
        stateRef.current.mouse.rightDown = true;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 2) stateRef.current.mouse.rightDown = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown, { passive: false });
    window.addEventListener("mouseup", handleMouseUp);

    const update = (time: number) => {
      const s = stateRef.current;
      const lvl = LEVELS[currentLevel];
      const deltaTime = Math.min(time - s.lastTime, 50);
      s.lastTime = time;

      const gravity = 0.6;
      const friction = 0.8;
      const moveSpeed = 1.2;
      const jumpForce = -12;
      const wallJumpX = 8;
      const wallJumpY = -10;
      const pullSpeed = 5;

      const die = () => {
        setGameOver(true);
      };

      // --- Player Logic ---
      if (s.keys['a'] || s.keys['A'] || s.keys['ArrowLeft']) s.player.vx -= moveSpeed;
      if (s.keys['d'] || s.keys['D'] || s.keys['ArrowRight']) s.player.vx += moveSpeed;
      s.player.vx *= friction;
      s.player.vy += gravity;

      let isOnLeftWall = s.player.x <= s.frame.left && (s.keys['a'] || s.keys['A'] || s.keys['ArrowLeft']);
      let isOnRightWall = s.player.x + s.player.w >= s.frame.right && (s.keys['d'] || s.keys['D'] || s.keys['ArrowRight']);
      
      // Platform wall detection
      for (const p of lvl.platforms) {
        if (s.player.y < p.y + p.h && s.player.y + s.player.h > p.y) {
          if (Math.abs(s.player.x - (p.x + p.w)) < 2 && (s.keys['a'] || s.keys['A'] || s.keys['ArrowLeft'])) isOnLeftWall = true;
          if (Math.abs(s.player.x + s.player.w - p.x) < 2 && (s.keys['d'] || s.keys['D'] || s.keys['ArrowRight'])) isOnRightWall = true;
        }
      }

      if ((isOnLeftWall || isOnRightWall) && s.player.vy > 3) {
        s.player.vy = 3; // Wall slide
      }

      // Jump
      if (s.keys['w'] || s.keys['W'] || s.keys['ArrowUp'] || s.keys[' ']) {
        if (s.player.onGround) {
          s.player.vy = jumpForce;
          s.player.onGround = false;
          s.keys['w'] = s.keys['W'] = s.keys['ArrowUp'] = s.keys[' '] = false;
        } else if (isOnLeftWall) {
          s.player.vx = wallJumpX;
          s.player.vy = wallJumpY;
          s.keys['w'] = s.keys['W'] = s.keys['ArrowUp'] = s.keys[' '] = false;
        } else if (isOnRightWall) {
          s.player.vx = -wallJumpX;
          s.player.vy = wallJumpY;
          s.keys['w'] = s.keys['W'] = s.keys['ArrowUp'] = s.keys[' '] = false;
        }
      }

      // X Movement & Collision
      s.player.x += s.player.vx;
      if (s.player.x < s.frame.left) { s.player.x = s.frame.left; s.player.vx = 0; isOnLeftWall = true; }
      if (s.player.x + s.player.w > s.frame.right) { s.player.x = s.frame.right - s.player.w; s.player.vx = 0; isOnRightWall = true; }
      for (const p of lvl.platforms) {
        if (s.player.x < p.x + p.w && s.player.x + s.player.w > p.x &&
            s.player.y < p.y + p.h && s.player.y + s.player.h > p.y) {
          if (s.player.vx > 0) { s.player.x = p.x - s.player.w; s.player.vx = 0; isOnRightWall = true; }
          else if (s.player.vx < 0) { s.player.x = p.x + p.w; s.player.vx = 0; isOnLeftWall = true; }
        }
      }

      // Y Movement & Collision
      s.player.y += s.player.vy;
      s.player.onGround = false;
      if (s.player.y + s.player.h > s.frame.bottom) { s.player.y = s.frame.bottom - s.player.h; s.player.vy = 0; s.player.onGround = true; }
      if (s.player.y < s.frame.top) { s.player.y = s.frame.top; s.player.vy = 0; }
      for (const p of lvl.platforms) {
        if (s.player.x < p.x + p.w && s.player.x + s.player.w > p.x &&
            s.player.y < p.y + p.h && s.player.y + s.player.h > p.y) {
          if (s.player.vy > 0) { s.player.y = p.y - s.player.h; s.player.vy = 0; s.player.onGround = true; }
          else if (s.player.vy < 0) { s.player.y = p.y + p.h; s.player.vy = 0; }
        }
      }

      // Check Exit Goal
      if (s.player.x < lvl.exit.x + lvl.exit.w && s.player.x + s.player.w > lvl.exit.x &&
          s.player.y < lvl.exit.y + lvl.exit.h && s.player.y + s.player.h > lvl.exit.y) {
        nextLevel();
        return;
      }

      // --- Shooting Stakes ---
      if (s.mouse.leftPressed) {
        const cx = s.player.x + s.player.w / 2;
        const cy = s.player.y + s.player.h / 2;
        const dx = s.mouse.x - cx;
        const dy = s.mouse.y - cy;
        const mag = Math.sqrt(dx * dx + dy * dy) || 1;
        s.projectiles.push({
          x: cx, y: cy,
          vx: (dx / mag) * 20,
          vy: (dy / mag) * 20
        });
        s.mouse.leftPressed = false;
      }

      // Projectiles update
      for (let i = s.projectiles.length - 1; i >= 0; i--) {
        const p = s.projectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        let hit = false;
        if (p.x < s.frame.left) { s.stakes.push({ edge: 'left', offset: p.y }); hit = true; }
        else if (p.x > s.frame.right) { s.stakes.push({ edge: 'right', offset: p.y }); hit = true; }
        else if (p.y < s.frame.top) { s.stakes.push({ edge: 'top', offset: p.x }); hit = true; }
        else if (p.y > s.frame.bottom) { s.stakes.push({ edge: 'bottom', offset: p.x }); hit = true; }

        if (hit) s.projectiles.splice(i, 1);
        else if (p.x < -100 || p.x > 900 || p.y < -100 || p.y > 700) s.projectiles.splice(i, 1);
      }

      // --- Frame Pulling & Crushing ---
      if (s.mouse.rightDown) {
        const edges = new Set(s.stakes.map(stake => stake.edge));
        if (edges.has('left')) s.frame.left += pullSpeed;
        if (edges.has('right')) s.frame.right -= pullSpeed;
        if (edges.has('top')) s.frame.top += pullSpeed;
        if (edges.has('bottom')) s.frame.bottom -= pullSpeed;

        // Player boundary push & Crush Check
        const checkCrush = () => {
          for (const p of lvl.platforms) {
            if (s.player.x < p.x + p.w && s.player.x + s.player.w > p.x &&
                s.player.y < p.y + p.h && s.player.y + s.player.h > p.y) {
              die();
            }
          }
        };

        if (s.frame.left > s.player.x) { s.player.x = s.frame.left; checkCrush(); }
        if (s.frame.right < s.player.x + s.player.w) { s.player.x = s.frame.right - s.player.w; checkCrush(); }
        if (s.frame.top > s.player.y) { s.player.y = s.frame.top; s.player.vy = Math.max(0, s.player.vy); checkCrush(); }
        if (s.frame.bottom < s.player.y + s.player.h) { s.player.y = s.frame.bottom - s.player.h; s.player.onGround = true; checkCrush(); }
      }

      // --- Frame Recall ---
      if (s.keys['r'] || s.keys['R']) {
        s.stakes = [];
        s.frame.left = 0;
        s.frame.right = 800;
        s.frame.top = 0;
        s.frame.bottom = 600;
      }

      // --- Drawing ---
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 800, 600);

      const isEmber = document.documentElement.classList.contains("theme-color");
      const isNeumorphic = document.documentElement.classList.contains("theme-neumorphic");
      
      // Inner playable frame
      ctx.fillStyle = isNeumorphic ? "#e2e8f0" : "#f4f4f5";
      ctx.fillRect(s.frame.left, s.frame.top, s.frame.right - s.frame.left, s.frame.bottom - s.frame.top);

      ctx.strokeStyle = "rgba(0,0,0,0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = s.frame.left; x < s.frame.right; x += 40) { ctx.moveTo(x, s.frame.top); ctx.lineTo(x, s.frame.bottom); }
      for (let y = s.frame.top; y < s.frame.bottom; y += 40) { ctx.moveTo(s.frame.left, y); ctx.lineTo(s.frame.right, y); }
      ctx.stroke();

      // Platforms
      ctx.fillStyle = isNeumorphic ? "#94a3b8" : "#d4d4d8";
      for (const p of lvl.platforms) {
        // Only draw platform portions that are inside the frame to enhance the illusion
        const px = Math.max(s.frame.left, Math.min(s.frame.right, p.x));
        const py = Math.max(s.frame.top, Math.min(s.frame.bottom, p.y));
        const pw = Math.max(0, Math.min(s.frame.right, p.x + p.w) - px);
        const ph = Math.max(0, Math.min(s.frame.bottom, p.y + p.h) - py);
        ctx.fillRect(px, py, pw, ph);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(px, py, pw, ph);
      }

      // Frame Border
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 4;
      ctx.strokeRect(s.frame.left, s.frame.top, s.frame.right - s.frame.left, s.frame.bottom - s.frame.top);

      // Exit Door
      ctx.fillStyle = "#22c55e"; // green
      ctx.fillRect(lvl.exit.x, lvl.exit.y, lvl.exit.w, lvl.exit.h);
      ctx.strokeStyle = "#166534";
      ctx.strokeRect(lvl.exit.x, lvl.exit.y, lvl.exit.w, lvl.exit.h);

      // Player
      ctx.fillStyle = isEmber ? "#FF4F00" : "#000000";
      ctx.fillRect(s.player.x, s.player.y, s.player.w, s.player.h);

      // Stakes
      ctx.fillStyle = "#3b82f6";
      for (const stake of s.stakes) {
        if (stake.edge === 'left') ctx.fillRect(s.frame.left, stake.offset - 5, 8, 10);
        if (stake.edge === 'right') ctx.fillRect(s.frame.right - 8, stake.offset - 5, 8, 10);
        if (stake.edge === 'top') ctx.fillRect(stake.offset - 5, s.frame.top, 10, 8);
        if (stake.edge === 'bottom') ctx.fillRect(stake.offset - 5, s.frame.bottom - 8, 10, 8);
      }

      // Projectiles
      ctx.fillStyle = "#3b82f6";
      for (const p of s.projectiles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Aim Line
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(s.player.x + s.player.w/2, s.player.y + s.player.h/2);
      ctx.lineTo(s.mouse.x, s.mouse.y);
      ctx.stroke();
      ctx.setLineDash([]);

      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("contextmenu", blockContextMenu);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, gameOver, gameWon, currentLevel]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center animate-fade-in">
      <div className="flex justify-between w-full mb-2 px-2 font-black uppercase tracking-widest text-sm md:text-base">
        <span>{t.lvl} {currentLevel + 1} / {LEVELS.length}</span>
      </div>
      
      <div 
        className="relative w-full aspect-[4/3] bg-white border-4 border-black overflow-hidden group shadow-[8px_8px_0px_0px_#000000] focus:outline-none"
        onContextMenu={(e) => { e.preventDefault(); return false; }}
      >
        {!isPlaying && !gameOver && !gameWon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm z-10">
            <button 
              onClick={startGame}
              className="flex items-center gap-2 bg-black text-white px-8 py-5 text-lg font-black uppercase hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#3b82f6] transition-all cursor-pointer pointer-events-auto"
            >
              <Play size={24} /> {t.start}
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/20 backdrop-blur-md z-10 pointer-events-none">
            <h3 className="text-4xl md:text-5xl font-black text-red-600 mb-6 uppercase tracking-tighter drop-shadow-md">{t.over}</h3>
            <button 
              onClick={restartLevel}
              className="flex items-center gap-2 bg-black text-white px-8 py-5 text-lg font-black uppercase hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#ff0000] transition-all cursor-pointer pointer-events-auto"
            >
              <RotateCcw size={24} /> {t.reboot}
            </button>
          </div>
        )}

        {gameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/20 backdrop-blur-md z-10 pointer-events-none">
            <h3 className="text-4xl md:text-5xl font-black text-green-700 mb-6 uppercase tracking-tighter drop-shadow-md">{t.won}</h3>
            <button 
              onClick={startGame}
              className="flex items-center gap-2 bg-black text-white px-8 py-5 text-lg font-black uppercase hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#22c55e] transition-all cursor-pointer pointer-events-auto"
            >
              <Play size={24} /> {t.finish}
            </button>
          </div>
        )}

        <canvas 
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full touch-none"
          tabIndex={0}
        />
        
        {isPlaying && (
          <div className="absolute bottom-4 left-0 w-full text-center text-xs md:text-sm font-black text-zinc-500 uppercase opacity-70 pointer-events-none tracking-widest bg-white/50 py-1">
            {LEVELS[currentLevel]?.hint[locale]}
          </div>
        )}
      </div>
    </div>
  );
}
