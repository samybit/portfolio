"use client";

import { motion } from "framer-motion";

export default function Quote() {
  return (
    <section className="snap-start w-full border-b-8 border-black bg-black text-white py-24 md:py-32 px-6 md:px-12 lg:px-24 flex items-center justify-center relative overflow-hidden">
      
      {/* Decorative massive quote mark in the background */}
      <div className="absolute -top-12 left-4 md:left-12 text-zinc-900 font-black text-[20rem] leading-none opacity-50 pointer-events-none select-none">
        "
      </div>
      
      <div className="max-w-6xl mx-auto flex flex-col gap-6 relative z-10">
        <motion.blockquote 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none"
        >
          "It's no use going back to yesterday, because I was a different person then."
        </motion.blockquote>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row md:items-center gap-6 mt-8"
        >
          {/* Brutalist Divider */}
          <div className="h-2 w-24 bg-white"></div>
          
          {/* Attribution */}
          <span className="text-lg md:text-xl font-bold tracking-widest uppercase text-zinc-400">
            [ Alice in Wonderland / Lewis Carroll ]
          </span>
        </motion.div>
      </div>
    </section>
  );
}
