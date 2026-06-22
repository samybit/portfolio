"use client";

import { ArrowDownRight, Download } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SplitText from "@/components/animata/text/split-text";
import GlitchText from "@/components/GlitchText";
import HeroCarabiner3D from "@/components/HeroCarabiner3D";
import EgyptMapTooltip from "@/components/EgyptMapTooltip";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";
import { useScrollMode } from "@/context/ScrollModeContext";

// --- HERO DESCRIPTION RENDERER ---
// Parses the description string (which may contain <br/> tags) and wraps
// the word "Egypt" or "مصر" with the interactive EgyptMapTooltip.
function HeroDescription({ html, className }: { html: string; className: string }) {
  // Split on <br/> (any casing / spacing), keep the rest as a flat string per line
  const lines = html.split(/<br\s*\/?>/);

  const EGYPT_REGEX = /(Egypt|مصر)/g;

  const renderLine = (line: string, lineIdx: number) => {
    const parts = line.split(EGYPT_REGEX);
    return parts.map((part, partIdx) => {
      if (part === "Egypt" || part === "مصر") {
        return (
          <EgyptMapTooltip key={`${lineIdx}-${partIdx}`}>
            <span className="underline decoration-4 decoration-black underline-offset-2 cursor-help">
              {part}
            </span>
          </EgyptMapTooltip>
        );
      }
      return <span key={`${lineIdx}-${partIdx}`}>{part}</span>;
    });
  };

  return (
    <p className={className}>
      {lines.map((line, idx) => (
        <span key={idx}>
          {renderLine(line, idx)}
          {idx < lines.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
}

export default function Hero({ dict }: { dict: Record<string, string> }) {
  const isNeumorphic = useNeumorphicTheme();
  const { isCurtainMode } = useScrollMode();

  return (
    // Added 'relative' to contain the absolute background
    <section id="hero" className="relative min-h-[100svh] flex flex-col justify-center items-start px-6 md:px-12 lg:px-24 border-b-8 border-black pt-30 md:pt-28 pb-11 overflow-hidden">

      {/* --- 3D TACTICAL CARABINER BACKGROUND --- */}
      <HeroCarabiner3D />

      {/* Added 'relative z-10' so the content sits above the 3D grid */}
      <div className="relative z-10 w-full max-w-[90rem] mx-auto flex flex-col min-[1300px]:flex-row min-[1300px]:items-center justify-between gap-12 min-[1300px]:gap-16">

        {/* --- LEFT COLUMN: TYPOGRAPHY --- */}
        <div className="flex-1 animate-slide-up relative z-10">

          <div className="flex items-center gap-4 mb-6">
            <span className={`text-[clamp(0.75rem,4.5vw,1.25rem)] whitespace-nowrap font-bold uppercase tracking-widest border-b-4 pb-1 bg-white ${
              isNeumorphic ? "border-[#a3b1c6]" : "border-black"
            }`}>
              {dict?.availability || "Available for Full-Time Roles"}
            </span>
          </div>

          {/* --- DESKTOP DESCRIPTION (Hidden on mobile) --- */}
          <HeroDescription
            html={dict?.description || "Full-Stack Developer. <br/> MERN Stack Specialist. <br/> Based in Egypt. <br/> Building fast, and effective apps."}
            className="hidden md:block text-2xl md:text-4xl font-bold max-w-2xl uppercase leading-snug text-zinc-800 bg-white/50 backdrop-blur-sm -ms-2 ps-2 hero-subtitle-backdrop mb-6"
          />

          <h1 className="text-[18vw] sm:text-6xl md:text-8xl lg:text-[7.5rem] xl:text-[9rem] font-black uppercase tracking-tighter leading-[0.85]">
            <SplitText text={dict?.samy || "Samy"} className="text-black hero-samy-text cursor-pointer z-10" />

            <br />

            {/* Added cursor-crosshair to match the 'Samy' interaction */}
            <span className="bg-black text-white px-2 sm:px-4 inline-block mt-4 md:mt-4 transform -skew-x-6 z-20 relative cursor-crosshair">
              {/* Wrapped the text in the new engine */}
              <GlitchText text={dict?.barsoum || "Barsoum"} />
            </span>
          </h1>

          {/* --- MOBILE DESCRIPTION (Hidden on desktop) --- */}
          <HeroDescription
            html={dict?.description || "Full-Stack Developer. <br/> MERN Stack Specialist. <br/> Based in Egypt. <br/> Building fast, and effective apps."}
            className="block md:hidden text-2xl md:text-4xl font-bold max-w-2xl uppercase leading-snug text-zinc-800 bg-white/50 backdrop-blur-sm -ms-2 ps-2 hero-subtitle-backdrop mt-6"
          />
        </div>

        {/* --- RIGHT COLUMN: ACTIONS --- */}
        <div className="flex flex-col w-full min-[1300px]:w-[450px] gap-4 md:gap-6 border-black border-t-0 border-s-0 min-[1300px]:border-s-8 min-[1300px]:ps-12 min-[1300px]:py-8 shrink-0 animate-slide-up-delay-1 relative z-0">

          <Link
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              if (isCurtainMode) {
                window.dispatchEvent(new CustomEvent('curtainNavigate', { detail: 1 }));
              } else {
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }
              window.history.pushState(null, '', '#projects');
            }}
            className={`flex justify-between items-center w-full p-4 md:p-8 text-xl md:text-3xl font-black uppercase transition-all duration-300 ease-in-out group ${
              isNeumorphic
                ? "bg-[#e0e5ec] text-[#4b5563] rounded-2xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                : "bg-black text-white border-4 border-black shadow-[8px_8px_0px_#000] hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
            }`}
          >
            <span>{dict?.work || "Work"}</span>
            <ArrowDownRight className="w-6 h-6 md:w-10 md:h-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform rtl:-scale-x-100 rtl:group-hover:-translate-x-2" />
          </Link>

          <Link
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              if (isCurtainMode) {
                window.dispatchEvent(new CustomEvent('curtainNavigate', { detail: 3 }));
              } else {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }
              window.history.pushState(null, '', '#contact');
            }}
            className={`flex justify-between items-center w-full p-4 md:p-8 text-xl md:text-3xl font-black uppercase transition-all duration-300 ease-in-out group ${
              isNeumorphic
                ? "bg-[#e0e5ec] text-[#4b5563] rounded-2xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                : "bg-white text-black border-4 border-black shadow-[8px_8px_0px_#000] hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
            }`}
          >
            <span>{dict?.contact || "Contact"}</span>
            <ArrowDownRight className="w-6 h-6 md:w-10 md:h-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform rtl:-scale-x-100 rtl:group-hover:-translate-x-2" />
          </Link>

          {/* CV Button */}
          <a
            href="/Samy_Barsoum_CV.pdf"
            download="Samy_Barsoum_CV.pdf"
            className={`flex justify-between items-center w-full p-4 md:p-8 text-xl md:text-3xl font-black uppercase transition-all duration-300 ease-in-out group ${
              isNeumorphic
                ? "bg-[#e0e5ec] text-[#4b5563] rounded-2xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                : "bg-white text-black border-4 border-black shadow-[8px_8px_0px_#000] hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
            }`}
          >
            <span>{dict?.getCV || "Get CV"}</span>
            <Download className="w-6 h-6 md:w-10 md:h-10 group-hover:translate-y-2 transition-transform" />
          </a>

        </div>
      </div>
    </section>
  );
}