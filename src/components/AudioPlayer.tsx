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

  const togglePlay = () => {
    if (audioRef.current) {
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

  // Reset the button when the song finishes naturally
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <div className="border-4 border-black p-3 flex items-center justify-between gap-6 bg-white text-black w-full min-w-[280px] max-w-xs shadow-[8px_8px_0px_0px_#000000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Disc3
          size={28}
          className={isPlaying ? "animate-spin text-black shrink-0" : "text-zinc-400 shrink-0"}
          style={{ animationDuration: '3s' }}
        />
        <div className="flex flex-col items-start text-start w-full min-w-0 justify-center pt-1">
          <span className={`text-sm font-black uppercase tracking-widest leading-tight mb-0.5 ${mallory.className}`}>med!cine</span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase leading-none mb-1.5">{dict?.pressToPlay || "Press to Play"}</span>
          <div className="relative w-full h-1 bg-zinc-200 cursor-pointer">
            <div 
              className="absolute top-0 bottom-0 start-0 bg-black pointer-events-none" 
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

      {/* Hidden audio engine with Opus preferred and MP3 fallback for older iPhones */}
      <audio 
        ref={audioRef} 
        preload="metadata"
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
  );
}