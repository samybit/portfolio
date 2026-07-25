"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Disc3 } from "lucide-react";
import localFont from "next/font/local";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";

const mallory = localFont({
  src: "../app/fonts/Mallory.otf",
  display: "swap",
});

const tracks = [
  { title: "med!cine", opus: "/track.opus", mp3: "/track.mp3" },
  { title: "Eternal Flame", opus: "/track2.opus", mp3: "/track2.mp3" }
];

export default function AudioPlayer({ dict }: { dict?: Record<string, string> }) {
  const isNeumorphic = useNeumorphicTheme();
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const peaksRef = useRef<number[]>([]);
  const visualizerTypeRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isTitleLong, setIsTitleLong] = useState(false);

  const switchTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setProgress(0);
  };

  const prevTrack = () => switchTrack((currentTrackIndex - 1 + tracks.length) % tracks.length);
  const nextTrack = () => switchTrack((currentTrackIndex + 1) % tracks.length);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Auto-play prevented", e));
      }
    }
  }, [currentTrackIndex]);
  
  useEffect(() => {
    if (titleRef.current) {
      // The container is 110px. If the text's natural width is bigger, it's too long.
      setIsTitleLong(titleRef.current.scrollWidth > 110);
    }
  }, [currentTrackIndex]);


  const initAudio = () => {
    if (!audioCtxRef.current && audioRef.current) {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      
      switch(visualizerTypeRef.current) {
        case 0: analyserRef.current.fftSize = 64; analyserRef.current.smoothingTimeConstant = 0.8; break;
        case 1: analyserRef.current.fftSize = 128; analyserRef.current.smoothingTimeConstant = 0.85; break;
        case 2: analyserRef.current.fftSize = 256; analyserRef.current.smoothingTimeConstant = 0.5; break;
        case 3: analyserRef.current.fftSize = 256; analyserRef.current.smoothingTimeConstant = 0.7; break;
      }
      analyserRef.current.minDecibels = -90; // High dynamic range for pro audio
      analyserRef.current.maxDecibels = -10;

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
      ctx.fillStyle = "white";
    }
    
    switch (visualizerTypeRef.current) {
      case 0: {
        // Blocky
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
            ctx.fillRect(x, canvas.height - barHeight, w, barHeight);
          }
        }
        break;
      }
      case 1: {
        // Fluid Waveform
        const pointsCount = 40; 
        const sliceWidth = canvas.width / (pointsCount - 1);
        
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        
        const points = [];
        for (let i = 0; i < pointsCount; i++) {
          const value = dataArray[i] || 0;
          const h = (value / 255) * canvas.height * 0.9;
          points.push({ x: i * sliceWidth, y: canvas.height - h });
        }

        ctx.lineTo(points[0].x, points[0].y);

        for (let i = 0; i < pointsCount - 1; i++) {
          const midX = (points[i].x + points[i + 1].x) / 2;
          const midY = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
        }
        
        ctx.lineTo(points[pointsCount - 1].x, points[pointsCount - 1].y);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 2: {
        // Mirrored Spectrum
        const barCount = 80; 
        const gap = Math.max(1, 1 * dpr);
        const w = (canvas.width - (barCount - 1) * gap) / barCount;
        
        for (let i = 0; i < barCount; i++) {
          const dataIndex = Math.floor(i * (100 / barCount));
          const value = dataArray[dataIndex] || 0;
          
          const normalized = value / 255;
          const h = Math.max(2 * dpr, normalized * canvas.height * 0.95);
          
          const y = (canvas.height - h) / 2;
          const x = i * (w + gap);
          
          if (isNeumorphic && ctx.roundRect) {
            ctx.beginPath();
            const radius = Math.min(w / 2, h / 2);
            ctx.roundRect(x, y, w, h, [radius]);
            ctx.fill();
          } else {
            ctx.fillRect(x, y, w, h);
          }
        }
        break;
      }
      case 3: {
        // Peak Hold Analyzer
        const barCount = 42; 
        const gap = 2 * dpr;
        const w = (canvas.width - (barCount - 1) * gap) / barCount;
        
        if (peaksRef.current.length !== barCount) {
          peaksRef.current = new Array(barCount).fill(0);
        }
        
        const maxBarHeight = canvas.height - (4 * dpr);
        
        for (let i = 0; i < barCount; i++) {
          const dataIndex = Math.floor(i * (100 / barCount));
          const value = dataArray[dataIndex] || 0;
          
          const normalized = value / 255;
          const h = Math.max(2 * dpr, normalized * maxBarHeight);
          
          let peak = peaksRef.current[i];
          if (normalized >= peak) {
            peak = normalized; 
          } else {
            peak -= 0.008; 
            if (peak < normalized) peak = normalized;
          }
          peaksRef.current[i] = peak;

          const x = i * (w + gap);
          const y = canvas.height - h;
          
          if (isNeumorphic && ctx.roundRect) {
            ctx.beginPath();
            const radius = Math.min(w / 2, h);
            ctx.roundRect(x, y, w, h, [radius, radius, 0, 0]);
            ctx.fill();
          } else {
            ctx.fillRect(x, y, w, h);
          }
          
          const peakY = canvas.height - (peak * maxBarHeight);
          if (isNeumorphic && ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x, peakY - (3 * dpr), w, 2 * dpr, [1 * dpr]);
            ctx.fill();
          } else {
            ctx.fillRect(x, peakY - (3 * dpr), w, 2 * dpr);
          }
        }
        break;
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
        
        // Easter Egg: Cycle visualizer style on pause!
        visualizerTypeRef.current = (visualizerTypeRef.current + 1) % 4;
        
        // Update hardware analyser ballistics for the new style immediately
        if (analyserRef.current) {
          switch(visualizerTypeRef.current) {
            case 0: analyserRef.current.fftSize = 64; analyserRef.current.smoothingTimeConstant = 0.8; break;
            case 1: analyserRef.current.fftSize = 128; analyserRef.current.smoothingTimeConstant = 0.85; break;
            case 2: analyserRef.current.fftSize = 256; analyserRef.current.smoothingTimeConstant = 0.5; break;
            case 3: analyserRef.current.fftSize = 256; analyserRef.current.smoothingTimeConstant = 0.7; break;
          }
        }
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
    <div className="relative w-full min-w-[260px] max-w-[280px] z-10">

      {/* The main styled card (Acts as the peer for hover syncing) */}
      <div className={`peer audio-player-container border-4 border-black p-3 flex items-center justify-between gap-6 bg-white text-black w-full hover:translate-y-1 hover:translate-x-1 hover:!shadow-none transition-all relative z-10 ${
        isNeumorphic ? "shadow-[8px_8px_0px_0px_#000000]" : "shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]"
      }`}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Disc3
            size={28}
            className={isPlaying ? "animate-spin text-black shrink-0" : "text-zinc-400 shrink-0"}
            style={{ animationDuration: '3s' }}
          />
          <div className="flex flex-col items-start text-start w-full min-w-0 justify-center pt-1">
            <div className="flex items-center justify-between w-full pe-1">
              <div className="w-[110px] overflow-hidden" dir="ltr">
                <span 
                  ref={titleRef}
                  className={`inline-block text-sm font-black uppercase tracking-widest leading-tight mb-0.5 whitespace-nowrap ${(isTitleLong && isPlaying) ? 'animate-slide-x' : ''} ${mallory.className}`}
                >
                  {tracks[currentTrackIndex].title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ms-2">
                <button onClick={prevTrack} className="hover:opacity-50 transition-opacity cursor-pointer" aria-label="Previous Track">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21l-12-18h24z"/></svg>
                </button>
                <button onClick={nextTrack} className="hover:opacity-50 transition-opacity cursor-pointer" aria-label="Next Track">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l12 18h-24z"/></svg>
                </button>
              </div>
            </div>
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
          className="bg-black text-white w-10 h-10 flex items-center justify-center shrink-0 hover:bg-white hover:text-black border-2 border-black transition-colors rtl:rotate-180 cursor-pointer"
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
          <source src={tracks[currentTrackIndex].opus} type="audio/ogg; codecs=opus" />
          <source src={tracks[currentTrackIndex].mp3} type="audio/mpeg" />
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