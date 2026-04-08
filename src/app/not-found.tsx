"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    // We use a large min-height and top padding to ensure it sits perfectly 
    // centered between the floating navbar and the footer
    <section className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center px-6 pt-40 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="brutalist-container w-full max-w-4xl flex flex-col items-center text-center !p-10 md:!p-20"
      >
        <ShieldAlert size={80} className="mb-6 text-black" />

        <h1 className="text-8xl md:text-[12rem] font-black uppercase tracking-tighter leading-none mb-4">
          404
        </h1>

        {/* Skewed highlight block for the error message */}
        <div className="bg-black text-white px-6 py-2 mb-8 transform -skew-x-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-widest">
            Dead End
          </h2>
        </div>

        <p className="text-xl md:text-3xl font-bold uppercase text-zinc-600 mb-12 max-w-2xl leading-snug">
          The requested sector does not exist. You have wandered off the grid.
        </p>

        <Link
          href="/"
          className="group relative inline-flex items-center justify-center bg-black text-white px-8 py-5 text-2xl font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black transition-colors"
        >
          <ArrowLeft className="mr-3 w-8 h-8 group-hover:-translate-x-2 transition-transform" />
          <span>Return Home</span>
        </Link>
      </motion.div>
    </section>
  );
}