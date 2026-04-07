"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CTA() {
  return (
    // We add a lot of vertical margin to give the overlapping elements room to breathe
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-6xl mx-auto my-40 px-6 relative flex flex-col items-center justify-center group"
    >

      {/* --- THE CANVAS (Background) --- */}
      {/* It sits absolutely behind the content, slightly skewed/offset visually */}
      <div className="absolute w-full md:w-[85%] h-[120%] border-8 border-black z-0 overflow-hidden bg-black -rotate-1 md:-rotate-2 transition-transform duration-500 group-hover:rotate-0">

        {/* IMPORTANT: Change '/painting.jpg' to exactly match your filename in the public folder */}
        <Image
          src="/painting.jpg"
          alt="Classical Art Background"
          fill
          className="object-cover grayscale contrast-[1.5] brightness-[0.4] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-[0.7] transition-all duration-700 ease-in-out"
        />

        {/* A subtle halftone/dot overlay to make it look printed */}
        <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_0)] bg-[size:4px_4px] opacity-30 mix-blend-overlay pointer-events-none"></div>
      </div>

      {/* --- THE PLACARD (Foreground) --- */}
      {/* We make this pure white so it violently clashes with the dark, moody background */}
      <div className="relative z-10 w-full max-w-3xl brutalist-container !bg-white !text-black p-8 md:p-16 text-center flex flex-col items-center gap-6 rotate-1 md:rotate-2 shadow-[16px_16px_0px_0px_#000000] group-hover:rotate-0 transition-transform duration-500">

        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
          Ready to build?
        </h2>

        <p className="text-xl max-w-xl font-bold uppercase text-zinc-600">
          Currently open for freelance projects and full-time roles. Let's make something impactful.
        </p>

        <Link
          href="#contact"
          className="group/btn relative inline-flex items-center justify-center bg-black text-white px-8 py-4 text-xl font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black transition-colors duration-200 mt-6"
        >
          <span>Get in touch</span>
          <ArrowUpRight className="ml-2 w-6 h-6 group-hover/btn:rotate-45 transition-transform duration-200" />
        </Link>
      </div>

    </motion.div>
  );
}