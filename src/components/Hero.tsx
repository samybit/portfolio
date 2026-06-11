"use client";

import { ArrowDownRight, Download } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import SproutingFlowers from "@/components/SproutingFlowers";
import GlitchText from "@/components/GlitchText";

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const [isNeumorphic, setIsNeumorphic] = useState(false);

  useEffect(() => {
    setIsNeumorphic(document.documentElement.classList.contains("theme-neumorphic"));
    const observer = new MutationObserver(() => {
      setIsNeumorphic(document.documentElement.classList.contains("theme-neumorphic"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    // Added 'relative' to contain the absolute background
    <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center items-start px-6 md:px-12 lg:px-24 border-b-8 border-black pt-30 md:pt-28 pb-11 overflow-hidden">

      {/* --- PARAMETRIC 3D MATH BACKGROUND --- */}
      <div className="bg-parametric-wrapper text-black" aria-hidden="true">
        <div className="bg-parametric-core">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="bg-parametric-shape" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
      </div>

      {/* Added 'relative z-10' so the content sits above the 3D grid */}
      <div className="relative z-10 w-full max-w-[90rem] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-16">

        {/* --- LEFT COLUMN: TYPOGRAPHY --- */}
        <div className="flex-1 animate-slide-up">
          <div className="flex items-center gap-4 mb-6">
            <span className={`text-xl font-bold uppercase tracking-widest border-b-4 pb-1 bg-white ${
              isNeumorphic ? "border-[#a3b1c6]" : "border-black"
            }`}>
              Available for Full-Time Roles
            </span>
          </div>

          <h1 className="text-[18vw] sm:text-7xl md:text-9xl lg:text-[8rem] xl:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] mb-6">
            {/* --- WRAP 'SAMY' IN A TRIGGER SPAN --- */}
            <span
              className="relative inline-block cursor-crosshair z-10"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setIsHovered(!isHovered)}
            >
              <span className={`relative z-20 inline-block hero-samy-text ${isHovered ? "text-white" : "text-black"
                }`}>
                Samy
              </span>
              <SproutingFlowers isHovered={isHovered} />
            </span>

            <br />

            {/* Added cursor-crosshair to match the 'Samy' interaction */}
            <span className="bg-black text-white px-2 sm:px-4 inline-block mt-4 md:mt-4 transform -skew-x-6 z-20 relative cursor-crosshair">
              {/* Wrapped the text in the new engine */}
              <GlitchText text="Barsoum" />
            </span>
          </h1>

          <p className="text-2xl md:text-4xl font-bold max-w-2xl uppercase leading-snug text-zinc-800 bg-white/50 backdrop-blur-sm -ml-2 hero-subtitle-backdrop">
            Full-Stack Developer. <br />
            MERN Stack Specialist. <br />
            Based in Egypt. <br />
            Building fast, and effective apps.
          </p>
        </div>

        {/* --- RIGHT COLUMN: ACTIONS --- */}
        <div className="flex flex-col w-full lg:w-[400px] xl:w-[450px] gap-6 border-black border-l-0 lg:border-l-8 lg:pl-12 lg:py-8 shrink-0 animate-slide-up-delay-1">

          <Link
            href="#projects"
            className={`flex justify-between items-center w-full p-8 text-3xl font-black uppercase transition-all duration-300 ease-in-out group ${
              isNeumorphic
                ? "bg-[#e0e5ec] text-[#4b5563] rounded-2xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                : "bg-black text-white border-4 border-black shadow-[8px_8px_0px_#000] hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
            }`}
          >
            <span>Work</span>
            <ArrowDownRight size={40} className="group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
          </Link>

          <Link
            href="#contact"
            className={`flex justify-between items-center w-full p-8 text-3xl font-black uppercase transition-all duration-300 ease-in-out group ${
              isNeumorphic
                ? "bg-[#e0e5ec] text-[#4b5563] rounded-2xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                : "bg-white text-black border-4 border-black shadow-[8px_8px_0px_#000] hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
            }`}
          >
            <span>Contact</span>
            <ArrowDownRight size={40} className="group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
          </Link>

          {/* CV Button */}
          <a
            href="/Samy_Barsoum_CV.pdf"
            download="Samy_Barsoum_CV.pdf"
            className={`flex justify-between items-center w-full p-8 text-3xl font-black uppercase transition-all duration-300 ease-in-out group ${
              isNeumorphic
                ? "bg-[#e0e5ec] text-[#4b5563] rounded-2xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                : "bg-white text-black border-4 border-black shadow-[8px_8px_0px_#000] hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
            }`}
          >
            <span>Get CV</span>
            <Download size={40} className="group-hover:translate-y-2 transition-transform" />
          </a>

        </div>
      </div>
    </section>
  );
}