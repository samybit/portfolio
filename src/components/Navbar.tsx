"use client";

import { motion } from "framer-motion";
import { TerminalSquare } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      // fixed position takes it out of flow (doesn't push hero down)
      // pointer-events-none lets you click "through" the empty space
      className="fixed top-0 left-0 z-50 w-full px-6 md:px-12 py-6 flex justify-between items-start pointer-events-none"
    >
      {/* Logo Block - pointer-events-auto makes it clickable again */}
      <a 
        href="#" 
        className="pointer-events-auto bg-white border-4 border-black p-3 flex items-center gap-3 brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all group"
      >
        <TerminalSquare size={32} className="text-black" />
        <span className="text-2xl font-black uppercase tracking-tighter">Samy.</span>
      </a>

      {/* Nav Links Block */}
      <div className="pointer-events-auto hidden md:flex items-center gap-4 bg-white border-4 border-black p-3 brutalist-shadow">
        <a href="#projects" className="text-lg font-bold uppercase hover:bg-black hover:text-white px-3 py-1 transition-colors">
          Work
        </a>
        <a href="https://github.com/samybit" target="_blank" rel="noopener noreferrer" className="text-lg font-bold uppercase hover:bg-black hover:text-white px-3 py-1 transition-colors">
          GitHub
        </a>
        <a 
          href="#contact" 
          className="bg-black text-white px-5 py-2 text-lg font-bold uppercase border-4 border-black hover:bg-white hover:text-black transition-colors ml-2"
        >
          Hire Me
        </a>
      </div>
    </motion.nav>
  );
}