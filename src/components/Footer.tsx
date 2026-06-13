"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import dynamic from "next/dynamic";

const Footer3D = dynamic(() => import("@/components/Footer3D"), { ssr: false });

export default function Footer({ dict }: { dict: any }) {
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

  const currentYear = new Date().getFullYear();
  const copyrightText = (dict?.copyright || "© {year} SAMYBIT // WITH NEXT.JS & BRUTALISM.").replace('{year}', currentYear.toString());

  return (
    <footer ref={footerRef} className="relative min-h-[20vh] flex items-center justify-center overflow-hidden bg-white border-t-8 border-black py-6 px-6 md:py-8 md:px-12">
      {/* --- LAYER 1: 3D KNOT BACKGROUND (z-0) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* 2. The Engine Killswitch: 'never' pauses the GPU completely */}
        <Footer3D isInView={isInView} isEmber={isEmber} isNeumorphic={isNeumorphic} />
      </div>

      {/* --- LAYER 2: FOOTER CONTENT (z-10) --- */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center gap-6 pointer-events-none">
        <p className="text-xl font-bold uppercase text-black bg-white px-3 py-1" suppressHydrationWarning>
          {copyrightText}
        </p>
        <a
          href="#"
          className="text-lg font-bold uppercase border-b-4 border-black pb-1 hover:bg-black hover:text-white transition-colors pointer-events-auto"
        >
          {dict?.backToTop || "↑ Back to top"}
        </a>
      </div>
    </footer>
  );
}