"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CTA() {
  return (
    // border-y-8 adds a heavy black line above and below the entire section
    <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center overflow-hidden border-t-8 border-b-8 border-black group my-24">

      {/* --- FULL BLEED BACKGROUND --- */}
      <div className="absolute inset-0 z-0 bg-black">
        <Image
          src="/painting.jpg"
          alt="Classical Art Background"
          fill
          className="object-cover grayscale contrast-[1.2] brightness-[0.35] group-hover:grayscale-0 group-hover:brightness-[0.6] transition-all duration-700 ease-in-out"
        />
        {/* Aggressive dot grid overlay to give it a newspaper print texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#000_3px,transparent_0)] bg-[size:16px_16px] opacity-50 mix-blend-overlay pointer-events-none"></div>
      </div>

      {/* --- THE CONTENT BOX --- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 w-full max-w-5xl px-6"
      >
        {/* Massive 20px shadow makes the box feel physically detached from the painting */}
        <div className="brutalist-container !bg-white !text-black p-10 md:p-20 text-center flex flex-col items-center gap-8 shadow-[20px_20px_0px_0px_#000000]">

          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            Ready to build?
          </h2>

          <p className="text-xl md:text-2xl max-w-2xl font-bold uppercase text-zinc-600">
            Currently open for freelance projects and full-time roles. Let's make something impactful.
          </p>

          <Link
            href="#contact"
            className="group/btn relative inline-flex items-center justify-center bg-black text-white px-10 py-5 text-2xl font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black transition-colors duration-200 mt-6"
          >
            <span>Get in touch</span>
            <ArrowUpRight className="ml-3 w-8 h-8 group-hover/btn:rotate-90 transition-transform duration-200" />
          </Link>

        </div>
      </motion.div>

    </section>
  );
}