"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, TerminalSquare } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    // Padding and min-height specs are left exactly the same as the previous fix
    <section id="hero" className="min-h-[90vh] flex flex-col justify-center items-start px-6 md:px-12 lg:px-24 border-b-8 border-black pt-30 md:pt-34 pb-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[90rem] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-16"
      >
        {/* Left Column: Typography Block */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            {/* <TerminalSquare size={32} className="text-black" /> */}
            <span className="text-xl font-bold uppercase tracking-widest border-b-4 border-black pb-1">
              Available for Freelance & Roles
            </span>
          </div>

          {/* Adjusted the max size slightly to allow room for the side panel */}
          <h1 className="text-7xl md:text-9xl lg:text-[8rem] xl:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] mb-8">
            Samy <br />
            <span className="bg-black text-white px-4 inline-block mt-2 transform -skew-x-6">
              Barsoum
            </span>
          </h1>

          <p className="text-2xl md:text-4xl font-bold max-w-2xl uppercase leading-snug text-zinc-800">
            Full-Stack Web Developer. <br />
            MERN Stack Specialist. <br />
            Building fast, brutal, and effective digital experiences.
          </p>
        </div>

        {/* Right Column: Creative Action Block */}
        <div className="flex flex-col sm:flex-row lg:flex-col w-full lg:w-[400px] xl:w-[450px] gap-6 lg:border-l-8 lg:border-black lg:pl-12 lg:py-8 shrink-0">
          <Link
            href="#projects"
            className="brutalist-container !p-8 !bg-black text-white hover:!bg-white hover:text-black flex justify-between items-center w-full text-3xl font-black uppercase transition-all group"
          >
            <span>Work</span>
            <ArrowDownRight size={40} className="group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
          </Link>

          <Link
            href="#contact"
            className="brutalist-container !p-8 flex justify-between items-center w-full text-3xl font-black uppercase hover:bg-black hover:text-white transition-all group"
          >
            <span>Hire Me</span>
            <ArrowDownRight size={40} className="group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}