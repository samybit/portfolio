"use client";

import { ArrowDownRight, Download, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Highlighter } from "@/components/ui/highlighter";
import SplitText from "@/components/animata/text/split-text";
import GlitchText from "@/components/GlitchText";
import HeroCarabiner3D from "@/components/HeroCarabiner3D";
import EgyptMapTooltip from "@/components/EgyptMapTooltip";
import { CoolMode } from "@/components/ui/cool-mode";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";
import { useEmberTheme } from "@/hooks/useEmberTheme";

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
            <span className="underline decoration-4 decoration-zinc-800 underline-offset-2 cursor-help">
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
  const isEmber = useEmberTheme();

  const getHighlightColor = (isDarkButton: boolean) => {
    if (isEmber) return isDarkButton ? "#1BADF0" : "#facc15";
    if (isNeumorphic) return isDarkButton ? "#ffffff" : "#94a3b8";
    return isDarkButton ? "#facc15" : "#ef4444";
  };

  const [isWorkHovered, setIsWorkHovered] = useState(false);
  const [isContactHovered, setIsContactHovered] = useState(false);
  const [isCvHovered, setIsCvHovered] = useState(false);

  return (
    // Added 'relative' to contain the absolute background
    <section id="hero" className="relative min-h-[100svh] flex flex-col justify-center items-start px-6 md:px-12 lg:px-24 border-b-8 border-black pt-30 md:pt-28 pb-11 overflow-hidden bg-black">

      {/* --- 3D TACTICAL CARABINER BACKGROUND --- */}
      <HeroCarabiner3D />

      {/* Added 'relative z-10' so the content sits above the 3D grid */}
      <div className="relative z-10 w-full max-w-[90rem] mx-auto grid grid-cols-1 min-[1300px]:grid-cols-[1fr_28rem] min-[1300px]:items-center gap-12 min-[1300px]:gap-16">

        {/* --- LEFT COLUMN: TYPOGRAPHY --- */}
        <div className="animate-slide-up relative z-10">

          <div className="flex items-center gap-4 mb-6">
            <span className={`text-[clamp(0.75rem,4.5vw,1.25rem)] whitespace-nowrap font-bold uppercase tracking-widest border-b-4 pb-1 ${isNeumorphic ? "bg-[#e0e5ec] border-[#a3b1c6] text-[#4b5563]" : "text-white border-white bg-transparent"
              }`}>
              {dict?.availability || "Available: Full-Time / Freelance"}
            </span>
          </div>

          {/* --- DESKTOP DESCRIPTION (Hidden on mobile) --- */}
          <HeroDescription
            html={dict?.description || "Full-Stack Developer. <br/> Next.js • Spring Boot • MongoDB • Docker <br/> Based in Egypt. <br/> Building web apps & APIs."}
            className={`hidden md:block text-lg md:text-2xl font-bold max-w-2xl leading-snug -ms-2 ps-2 hero-subtitle-backdrop mb-6 ${
              isNeumorphic ? "text-[#2d3748]" : "text-white/80"
            }`}
          />

          <h1 className="text-[18vw] sm:text-6xl md:text-8xl lg:text-[7.5rem] xl:text-[9rem] font-black uppercase tracking-tighter leading-[0.85]">
            <SplitText text={dict?.samy || "Samy"} className="text-white hero-samy-text z-10" />

            <br />

            <span className="inline-flex mt-4 md:mt-4 transform -skew-x-6 z-20 relative">
              {/* Bottom Layer: Solid white text, unclipped, overflows naturally against the black hero bg */}
              <span className="absolute inset-0 text-white px-2 sm:px-4 z-0 pointer-events-none flex items-center" aria-hidden="true">
                <GlitchText text={dict?.barsoum || "Barsoum"} />
              </span>

              {/* Top Layer: White bg, black text, clipped to padding box */}
              <span className="absolute inset-0 bg-white text-black px-2 sm:px-4 z-10 overflow-hidden flex items-center">
                <GlitchText text={dict?.barsoum || "Barsoum"} />
              </span>

              {/* Structural Layer: Invisible, sets wrapper dimensions */}
              <span className="relative invisible px-2 sm:px-4 z-[-1] pointer-events-none flex items-center" aria-hidden="true">
                <GlitchText text={dict?.barsoum || "Barsoum"} />
              </span>
            </span>
          </h1>

          {/* --- MOBILE DESCRIPTION (Hidden on desktop) --- */}
          <HeroDescription
            html={dict?.description || "Full-Stack Developer. <br/> Next.js • Spring Boot • MongoDB • Docker <br/> Based in Egypt. <br/> Building web apps & APIs."}
            className={`block md:hidden text-lg md:text-2xl font-bold max-w-2xl leading-snug -ms-2 ps-2 hero-subtitle-backdrop mt-6 ${
              isNeumorphic ? "text-[#2d3748]" : "text-white/80"
            }`}
          />
        </div>

        {/* --- RIGHT COLUMN: ACTIONS --- */}
        <div className={`flex flex-col w-full gap-4 md:gap-6 border-t-0 border-s-0 min-[1300px]:border-s-8 min-[1300px]:ps-12 min-[1300px]:py-8 animate-slide-up-delay-1 relative z-0 ${isNeumorphic ? "border-black" : "border-white"
          }`}>

          {/* CV Button */}
          <CoolMode options={{ particle: "brutalist-cv" }}>
            <a
              href="/Samy_Barsoum_CV.pdf"
              download="Samy_Barsoum_CV.pdf"
              onMouseEnter={() => setIsCvHovered(true)}
              onMouseLeave={() => setIsCvHovered(false)}
              onTouchStart={() => setIsCvHovered(true)}
              onTouchEnd={() => setIsCvHovered(false)}
              className={`flex justify-between items-center w-full p-4 md:p-8 text-xl md:text-3xl font-black uppercase transition-all duration-300 ease-in-out group ${isNeumorphic
                  ? "bg-[#e0e5ec] text-[#4b5563] rounded-2xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                  : "bg-white text-black border-4 border-white shadow-[8px_8px_0px_rgba(255,255,255,0.3)] hover:bg-black hover:text-white hover:border-white hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
                }`}
            >
              <Highlighter show={isCvHovered} action="highlight" color={getHighlightColor(true)}>
                {dict?.getCV || "Get CV"}
              </Highlighter>
              <div className="relative w-6 h-6 md:w-10 md:h-10">
                <Download className={`absolute inset-0 w-full h-full transition-all duration-500 ${isCvHovered ? "opacity-0 scale-50 translate-y-4" : ""}`} />
                <FileText className={`absolute inset-0 w-full h-full transition-all duration-500 ${isCvHovered ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-50 -translate-y-4"}`} />
              </div>
            </a>
          </CoolMode>

          {/* Work Button */}
          <Link
            href="#projects"
            onMouseEnter={() => setIsWorkHovered(true)}
            onMouseLeave={() => setIsWorkHovered(false)}
            onTouchStart={() => setIsWorkHovered(true)}
            onTouchEnd={() => setIsWorkHovered(false)}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              window.history.pushState(null, '', '#projects');
            }}
            className={`flex justify-between items-center w-full p-4 md:p-8 text-xl md:text-3xl font-black uppercase transition-all duration-300 ease-in-out group ${isNeumorphic
                ? "bg-[#e0e5ec] text-[#4b5563] rounded-2xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                : "bg-transparent text-white border-4 border-white shadow-[8px_8px_0px_rgba(255,255,255,0.2)] hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
              }`}
          >
            <Highlighter show={isWorkHovered} action="highlight" color={getHighlightColor(false)}>
              {dict?.work || "Projects"}
            </Highlighter>
            <ArrowDownRight className={`w-6 h-6 md:w-10 md:h-10 transition-transform rtl:-scale-x-100 ${isWorkHovered ? "[animation:arrow-snap-sequence_0.8s_ease-in-out_forwards]" : ""}`} />
          </Link>

          {/* Contact Button */}
          <Link
            href="#contact"
            onMouseEnter={() => setIsContactHovered(true)}
            onMouseLeave={() => setIsContactHovered(false)}
            onTouchStart={() => setIsContactHovered(true)}
            onTouchEnd={() => setIsContactHovered(false)}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              window.history.pushState(null, '', '#contact');
            }}
            className={`flex justify-between items-center w-full p-4 md:p-8 text-xl md:text-3xl font-black uppercase transition-all duration-300 ease-in-out group ${isNeumorphic
                ? "bg-[#e0e5ec] text-[#4b5563] rounded-2xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                : "bg-transparent text-white border-4 border-white shadow-[8px_8px_0px_rgba(255,255,255,0.2)] hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
              }`}
          >
            <Highlighter show={isContactHovered} action="highlight" color={getHighlightColor(false)}>
              {dict?.contact || "Contact"}
            </Highlighter>
            <ArrowDownRight className={`w-6 h-6 md:w-10 md:h-10 transition-transform rtl:-scale-x-100 ${isContactHovered ? "[animation:arrow-snap-sequence_0.8s_ease-in-out_forwards]" : ""}`} />
          </Link>

        </div>
      </div>
    </section>
  );
}