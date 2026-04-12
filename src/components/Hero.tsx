"use client";

import { ArrowDownRight, Download } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero" className="min-h-[90vh] flex flex-col justify-center items-start px-6 md:px-12 lg:px-24 border-b-8 border-black pt-30 md:pt-34 pb-16 overflow-hidden">
      <div className="w-full max-w-[90rem] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-16">

        {/* --- LEFT COLUMN: TYPOGRAPHY --- */}
        <div className="flex-1 animate-slide-up">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xl font-bold uppercase tracking-widest border-b-4 border-black pb-1">
              Available for Freelance & Roles
            </span>
          </div>

          <h1 className="text-[18vw] sm:text-7xl md:text-9xl lg:text-[8rem] xl:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] mb-8">
            Samy <br />
            <span className="bg-black text-white px-2 sm:px-4 inline-block mt-2 transform -skew-x-6">
              Barsoum
            </span>
          </h1>

          <p className="text-2xl md:text-4xl font-bold max-w-2xl uppercase leading-snug text-zinc-800">
            Full-Stack Developer. <br />
            MERN Stack Specialist. <br />
            Based in Egypt. <br />
            Building fast, and effective apps.
          </p>
        </div>

        {/* --- RIGHT COLUMN: ACTIONS --- */}
        <div className="flex flex-col w-full lg:w-[400px] xl:w-[450px] gap-6 lg:border-l-8 lg:border-black lg:pl-12 lg:py-8 shrink-0 animate-slide-up-delay-1">

          <Link href="#projects" className="brutalist-container !p-8 !bg-black text-white hover:!bg-white hover:text-black flex justify-between items-center w-full text-3xl font-black uppercase transition-all group">
            <span>Work</span>
            <ArrowDownRight size={40} className="group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
          </Link>

          <Link href="#contact" className="brutalist-container !p-8 flex justify-between items-center w-full text-3xl font-black uppercase hover:bg-black hover:text-white transition-all group">
            <span>Contact</span>
            <ArrowDownRight size={40} className="group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
          </Link>

          {/* Download CV Button */}
          <a
            href="/cv.pdf"
            download="Samy_Barsoum_CV.pdf"
            className="brutalist-container !p-8 flex justify-between items-center w-full text-3xl font-black uppercase hover:bg-black hover:text-white transition-all group border-t-4 border-black lg:border-t-0 lg:border-t-transparent"
          >
            <span>Get CV</span>
            <Download size={40} className="group-hover:translate-y-2 transition-transform" />
          </a>

        </div>
      </div>
    </section>
  );
}