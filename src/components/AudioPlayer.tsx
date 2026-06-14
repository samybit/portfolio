"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Disc3 } from "lucide-react";
import localFont from "next/font/local";

const mallory = localFont({
  src: "../app/fonts/Mallory.otf",
  display: "swap",
});

export default function AudioPlayer({ dict }: { dict?: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current && audioRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 64; 

      try {
        sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioCtxRef.current.destination);
      } catch (e) {
        console.warn("Audio source already connected", e);
      }
    }
  };

  useEffect(() => {
    return () => {
      // Prevent memory leaks and Zombie AudioContexts when navigating away
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(console.error);
        audioCtxRef.current = null;
      }
    };
  }, []);

  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    // Retina-sharp and dynamic resizing
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    
    if (cssWidth === 0 || cssHeight === 0) return; // Prevent negative math errors if hidden

    animationRef.current = requestAnimationFrame(drawVisualizer);
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    if (canvas.width !== Math.floor(cssWidth * dpr) || canvas.height !== Math.floor(cssHeight * dpr)) {
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
    }

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isNeumorphic = document.documentElement.classList.contains("theme-neumorphic");
    const isEmber = document.documentElement.classList.contains("theme-color");
    
    if (isEmber) {
      ctx.fillStyle = "#FF4F00";
    } else if (isNeumorphic) {
      ctx.fillStyle = "#8c9bb0";
      ctx.shadowColor = "rgba(163, 177, 198, 0.5)";
      ctx.shadowBlur = 4 * dpr;
      ctx.shadowOffsetX = 2 * dpr;
      ctx.shadowOffsetY = 2 * dpr;
    } else {
      ctx.fillStyle = "black";
    }
    
    const barCount = 14; 
    const gap = 4 * dpr;
    const w = (canvas.width - (barCount - 1) * gap) / barCount;
    
    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor(i * (bufferLength / 2.5) / barCount);
      const value = dataArray[dataIndex] || 0;
      const barHeight = Math.max(2 * dpr, Math.floor((value / 255) * canvas.height));
      
      const x = i * (w + gap);
      
      if (isNeumorphic && ctx.roundRect) {
        ctx.beginPath();
        const radius = Math.min(w / 2, barHeight);
        ctx.roundRect(x, canvas.height - barHeight, w, barHeight, [radius, radius, 0, 0]);
        ctx.fill();
      } else {
        // Brutalist / Ember / Fallback
        ctx.fillRect(x, canvas.height - barHeight, w, barHeight);
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      if (audioCtxRef.current?.state === "suspended") {
        audioCtxRef.current.resume();
      }
      drawVisualizer();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (!audioCtxRef.current) initAudio();

      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      const newTime = (Number(e.target.value) / 100) * audio.duration;
      audio.currentTime = newTime;
      setProgress(Number(e.target.value));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <div className="relative w-full min-w-[280px] max-w-xs z-10">

      {/* The main styled card (Acts as the peer for hover syncing) */}
      <div className="peer audio-player-container border-4 border-black p-3 flex items-center justify-between gap-6 bg-white text-black w-full shadow-[8px_8px_0px_0px_#000000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all relative z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Disc3
            size={28}
            className={isPlaying ? "animate-spin text-black shrink-0" : "text-zinc-400 shrink-0"}
            style={{ animationDuration: '3s' }}
          />
          <div className="flex flex-col items-start text-start w-full min-w-0 justify-center pt-1">
            <span className={`text-sm font-black uppercase tracking-widest leading-tight mb-0.5 ${mallory.className}`}>med!cine</span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase leading-none mb-1.5">{dict?.pressToPlay || "Press to Play"}</span>
            <div className="audio-progress-track relative w-full h-1 bg-zinc-200 cursor-pointer">
              <div 
                className="audio-progress-fill absolute top-0 bottom-0 start-0 bg-black pointer-events-none" 
                style={{ width: `${progress || 0}%` }} 
              />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress || 0} 
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer m-0 p-0"
              />
            </div>
          </div>
        </div>

        <button
          onClick={togglePlay}
          className="bg-black text-white w-10 h-10 flex items-center justify-center shrink-0 hover:bg-white hover:text-black border-2 border-black transition-colors rtl:rotate-180"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} className="rtl:rotate-180" /> : <Play size={20} className="ml-0.5 rtl:ml-0 rtl:mr-0.5 rtl:rotate-180" />}
        </button>

        {/* Hidden audio engine with CORS enabled for Web Audio API */}
        <audio 
          ref={audioRef} 
          preload="metadata"
          crossOrigin="anonymous"
          onTimeUpdate={(e) => {
            const audio = e.currentTarget;
            if (audio.duration) {
              setProgress((audio.currentTime / audio.duration) * 100);
            }
          }}
        >
          <source src="/track.opus" type="audio/ogg; codecs=opus" />
          <source src="/track.mp3" type="audio/mpeg" />
        </audio>
      </div>

      {/* 
        CLEAN IMPLEMENTATION: 
        Isolated canvas layered above the player block.
        No backgrounds, no borders, no Neumorphic clashing.
        Just raw data bars floating smoothly above.
        Follows the peer's hover translation.
      */}
      <canvas 
        ref={canvasRef} 
        className={`audio-visualizer-canvas absolute bottom-full left-0 w-full h-10 mb-1 transition-all duration-300 pointer-events-none z-0 ${isPlaying ? "opacity-100" : "opacity-0"} peer-hover:translate-y-1 peer-hover:translate-x-1`} 
      />
    </div>
  );
}