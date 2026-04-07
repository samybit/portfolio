"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, TerminalSquare } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center items-start px-6 md:px-12 lg:px-24 border-b-8 border-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-6xl w-full"
      >
        <div className="flex items-center gap-4 mb-6">
          <TerminalSquare size={32} className="text-black" />
          <span className="text-xl font-bold uppercase tracking-widest border-b-4 border-black pb-1">
            Available for Freelance & Roles
          </span>
        </div>

        <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] mb-8">
          Samy <br />
          <span className="bg-black text-white px-4 inline-block mt-2 transform -skew-x-6">
            Barsoum
          </span>
        </h1>

        <p className="text-2xl md:text-4xl font-bold max-w-3xl mb-12 uppercase leading-snug text-zinc-800">
          Full-Stack Web Developer. <br />
          MERN Stack Specialist. <br />
          Building fast, brutal, and effective digital experiences.
        </p>

        <div className="flex flex-wrap gap-6">
          <Link
            href="#projects"
            className="brutalist-container !p-5 !bg-black text-white hover:!bg-white hover:text-black flex items-center gap-3 text-2xl font-black uppercase transition-colors"
          >
            See my work <ArrowDownRight size={32} />
          </Link>
          <Link
            href="#contact"
            className="brutalist-container !p-5 flex items-center gap-3 text-2xl font-black uppercase hover:bg-black hover:text-white transition-colors"
          >
            Hire Me
          </Link>
        </div>
      </motion.div>
    </section>
  );
}