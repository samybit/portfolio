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

      {/* --- TACTICAL CARABINER BACKGROUND --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Topographic Background Pattern (Subtle concentric circles) */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ backgroundImage: 'repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 40px, currentColor 40px, currentColor 41px)' }} 
        />
        
        {/* Tactical Carabiner SVG & Ropes */}
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full text-black">
          <defs>
            {/* Metallic gradient for the carabiner body */}
            <linearGradient id="metallic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d1d5db" />
              <stop offset="50%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#4b5563" />
            </linearGradient>
            
            {/* Soft drop shadow for 3D depth */}
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="8" stdDeviation="6" floodOpacity="0.4"/>
            </filter>
            
            {/* Rope drop shadow */}
            <filter id="rope-shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Ropes (using coordinates in the 1000x1000 canvas) */}
          <g filter="url(#rope-shadow)">
            {/* Top Left Rope (Yellow tension) */}
            <line x1="-100" y1="-100" x2="480" y2="400" stroke="#eab308" strokeWidth="6" strokeDasharray="12 4" />
            <line x1="-100" y1="200" x2="450" y2="500" stroke="#d1d5db" strokeWidth="4" />
            
            {/* Top Right Rope */}
            <line x1="1100" y1="100" x2="520" y2="400" stroke="#eab308" strokeWidth="6" strokeDasharray="12 4" />
            <line x1="1100" y1="-100" x2="520" y2="400" stroke="#9ca3af" strokeWidth="3" />
            <line x1="1100" y1="400" x2="550" y2="500" stroke="#d1d5db" strokeWidth="4" strokeDasharray="20 6" />
            
            {/* Bottom Left Rope */}
            <line x1="-100" y1="1100" x2="450" y2="600" stroke="#eab308" strokeWidth="6" strokeDasharray="12 4" />
            <line x1="-100" y1="700" x2="450" y2="600" stroke="#9ca3af" strokeWidth="4" />
            
            {/* Bottom Right Rope */}
            <line x1="1100" y1="1100" x2="550" y2="600" stroke="#eab308" strokeWidth="6" strokeDasharray="12 4" />
          </g>

          {/* Center Carabiner floating animation */}
          {/* We will add an inline style animation for a slow 3D wobble */}
          <g 
            transform="translate(500, 500)" 
            filter="url(#shadow)" 
            style={{ animation: 'carabiner-float 8s ease-in-out infinite' }}
          >
            {/* Tech UI Rings around Carabiner */}
            <circle cx="0" cy="0" r="160" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" opacity="0.3" />
            <circle cx="0" cy="0" r="180" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            
            {/* The Carabiner Body (Triangle with rounded corners) */}
            <path 
              d="M 0 -120 L 105 75 L -105 75 Z" 
              fill="none" 
              stroke="url(#metallic)" 
              strokeWidth="36" 
              strokeLinejoin="round" 
            />
            
            {/* Carabiner Locking Gate (Silver cylinder mechanism) */}
            <rect x="-30" y="58" width="60" height="34" fill="#6b7280" rx="4" />
            <rect x="-15" y="52" width="30" height="46" fill="#4b5563" rx="2" />
            <rect x="-5" y="52" width="10" height="46" fill="#9ca3af" rx="2" opacity="0.5" />
            
            {/* Tactical Yellow Tape/Marking */}
            {/* This path overlaps the left edge to simulate yellow tape wrapped around */}
            <path d="M -60 -8 L -30 -60" stroke="#eab308" strokeWidth="38" opacity="0.9" />
            <path d="M -54 -18 L -36 -50" stroke="#000" strokeWidth="2" opacity="0.5" />
          </g>
          
          {/* Tech/Arknights style text overlay near the carabiner */}
          <g fill="currentColor" opacity="0.6" style={{ fontFamily: 'monospace', fontSize: '10px' }}>
            <text x="350" y="320">RENEW \ LIMIT 4 AG40</text>
            <text x="350" y="335">UID 00046321840 KTM</text>
            <text x="350" y="350">UN VER.1.1.6</text>
            
            <text x="550" y="320">20196_146</text>
            
            <text x="300" y="500">▼ // ARKNIGHTS:</text>
            <text x="300" y="520">... /Switch/</text>
          </g>
        </svg>

        {/* Global style injected for the carabiner float animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes carabiner-float {
            0%, 100% { transform: translate(500px, 500px) rotate(0deg); }
            50% { transform: translate(500px, 510px) rotate(2deg); }
          }
        `}} />
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