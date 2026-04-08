"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TerminalSquare, ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 z-50 w-full px-6 md:px-12 py-6 pointer-events-none flex flex-col"
    >
      <div className="flex justify-between items-start w-full">
        {/* Logo Block - Fixed to use Next.js Link pointing to "/" */}
        <Link
          href="/"
          className="pointer-events-auto bg-white border-4 border-black p-3 flex items-center gap-3 brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all group"
        >
          <TerminalSquare size={32} className="text-black" />
          <span className="text-2xl font-black uppercase tracking-tighter">Samy.</span>
        </Link>

        {/* Desktop Nav Links Block */}
        <div className="pointer-events-auto hidden md:flex items-center gap-4 bg-white border-4 border-black p-3 brutalist-shadow">
          <Link href="/about" className="text-lg font-bold uppercase hover:bg-black hover:text-white px-3 py-1 transition-colors">
            About
          </Link>

          <Link href="/#projects" className="text-lg font-bold uppercase hover:bg-black hover:text-white px-3 py-1 transition-colors">
            Work
          </Link>
          <a
            href="https://github.com/samybit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-lg font-bold uppercase hover:bg-black hover:text-white px-3 py-1 transition-colors"
          >
            GitHub <ArrowUpRight size={20} />
          </a>
          <Link
            href="/#contact"
            className="bg-black text-white px-5 py-2 text-lg font-bold uppercase border-4 border-black hover:bg-white hover:text-black transition-colors ml-2"
          >
            Hire Me
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto md:hidden bg-white border-4 border-black p-3 brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={32} className="text-black" /> : <Menu size={32} className="text-black" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="pointer-events-auto md:hidden w-full mt-4 bg-white border-4 border-black p-6 flex flex-col gap-2 brutalist-shadow origin-top"
          >
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="text-3xl font-black uppercase p-4 border-b-4 border-black hover:bg-black hover:text-white transition-colors"
            >
              About
            </Link>
            
            <Link
              href="/#projects"
              onClick={() => setIsOpen(false)}
              className="text-3xl font-black uppercase p-4 border-b-4 border-black hover:bg-black hover:text-white transition-colors"
            >
              Work
            </Link>
            <a
              href="https://github.com/samybit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between items-center text-3xl font-black uppercase p-4 border-b-4 border-black hover:bg-black hover:text-white transition-colors"
            >
              GitHub <ArrowUpRight size={32} />
            </a>
            <Link
              href="/#contact"
              onClick={() => setIsOpen(false)}
              className="mt-4 bg-black text-white text-center p-5 text-3xl font-black uppercase border-4 border-black hover:bg-white hover:text-black transition-colors"
            >
              Hire Me
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}