'use client';

import { useEffect, useState } from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const [isNeumorphic, setIsNeumorphic] = useState(false);

  useEffect(() => {
    // Log the error to console
    console.error(error);
    
    // Detect theme class on HTML element
    setIsNeumorphic(document.documentElement.classList.contains("theme-neumorphic"));
  }, [error]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-all duration-300 ${
      isNeumorphic ? "bg-[#e0e5ec] text-[#4b5563]" : "bg-white text-black"
    }`}>
      <div className={`w-full max-w-xl p-8 md:p-12 transition-all duration-300 ${
        isNeumorphic
          ? "bg-[#e0e5ec] rounded-3xl shadow-[9px_9px_16px_rgba(163,177,198,0.6),_-9px_-9px_16px_rgba(255,255,255,0.5)] border border-transparent"
          : "border-8 border-black bg-white shadow-[8px_8px_0px_0px_#000000]"
      }`}>
        {/* Header Icon */}
        <div className={`inline-flex p-4 mb-6 transition-all duration-300 ${
          isNeumorphic
            ? "bg-[#e0e5ec] rounded-2xl shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),_inset_-3px_-3px_6px_rgba(255,255,255,0.7)] text-red-500/80"
            : "bg-black text-white border-4 border-black"
        }`}>
          <AlertOctagon size={48} />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4">
          SYSTEM <br />
          <span className={`px-2 inline-block transform -skew-x-2 mt-1 ${
            isNeumorphic ? "bg-red-500/10 text-red-500" : "bg-black text-white"
          }`}>
            ERROR
          </span>
        </h1>

        {/* Description */}
        <p className={`text-lg md:text-xl font-bold uppercase mb-8 transition-colors ${
          isNeumorphic ? "text-zinc-600" : "text-zinc-500"
        }`}>
          An unexpected exception has occurred in the application layer.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => unstable_retry()}
            className={`flex items-center justify-center gap-2 px-6 py-4 text-lg font-black uppercase transition-all duration-300 cursor-pointer ${
              isNeumorphic
                ? "bg-[#e0e5ec] text-[#1e293b] rounded-xl shadow-[4px_4px_8px_rgba(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.7),_-6px_-6px_12px_rgba(255,255,255,0.6)] active:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),_inset_-3px_-3px_6px_rgba(255,255,255,0.5)] active:translate-y-[2px]"
                : "bg-black text-white border-4 border-black hover:bg-white hover:text-black"
            }`}
          >
            <RefreshCw size={20} /> Try Again
          </button>
          
          <Link
            href="/"
            className={`flex items-center justify-center gap-2 px-6 py-4 text-lg font-black uppercase transition-all duration-300 ${
              isNeumorphic
                ? "bg-[#e0e5ec] text-[#4b5563] rounded-xl shadow-[4px_4px_8px_rgba(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.7),_-6px_-6px_12px_rgba(255,255,255,0.6)] active:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),_inset_-3px_-3px_6px_rgba(255,255,255,0.5)] active:translate-y-[2px]"
                : "bg-white text-black border-4 border-black hover:bg-black hover:text-white"
            }`}
          >
            <Home size={20} /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
