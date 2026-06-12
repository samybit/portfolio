"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import dynamic from "next/dynamic";

const Footer3D = dynamic(() => import("@/components/Footer3D"), { ssr: false });

export default function Footer() {
  // 1. Hardware Observer: Tracks if the footer is anywhere near the viewport
  const footerRef = useRef<HTMLElement>(null);
  // The margin ensures it wakes up slightly before the user actually sees it
  const isInView = useInView(footerRef, { margin: "200px 0px 200px 0px" });

  const [isEmber, setIsEmber] = useState(false);
  const [isNeumorphic, setIsNeumorphic] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsEmber(document.documentElement.classList.contains("theme-color"));
      setIsNeumorphic(document.documentElement.classList.contains("theme-neumorphic"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-white border-t-8 border-black p-6 md:p-12">
      {/* --- LAYER 1: 3D KNOT BACKGROUND (z-0) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* 2. The Engine Killswitch: 'never' pauses the GPU completely */}
        <Footer3D isInView={isInView} isEmber={isEmber} isNeumorphic={isNeumorphic} />
      </div>

      {/* --- LAYER 2: FOOTER CONTENT (z-10) --- */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center gap-4 pointer-events-none">
        <div className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
          Samy Barsoum
        </div>
        <p className="text-xl font-bold uppercase text-black bg-white px-3 py-1" suppressHydrationWarning>
          © {new Date().getFullYear()} SAMYBIT // WITH NEXT.JS & BRUTALISM.
        </p>
        <a
          href="#"
          className="mt-4 text-lg font-bold uppercase border-b-4 border-black pb-1 hover:bg-black hover:text-white transition-colors pointer-events-auto"
        >
          ↑ Back to top
        </a>
      </div>
    </footer>
  );
}