"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Disc3 } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
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
      <div className="flex items-center gap-3">
        <Disc3
          size={28}
          className={isPlaying ? "animate-spin text-black" : "text-zinc-400"}
          style={{ animationDuration: '3s' }}
        />
        <div className="flex flex-col items-start">
          <span className="text-sm font-black uppercase tracking-widest leading-none mb-1">Crystals / 01</span>
          <span className="text-xs font-bold text-zinc-500 uppercase leading-none">Press to Play</span>
        </div>
      </div>

      <button
        onClick={togglePlay}
        className="bg-black text-white w-10 h-10 flex items-center justify-center shrink-0 hover:bg-white hover:text-black border-2 border-black transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
      </button>

      {/* Hidden audio engine pointing to the file in your public folder */}
      <audio ref={audioRef} src="/track.mp3" preload="metadata" />
    </div>
  );
}