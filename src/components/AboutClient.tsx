"use client";

import { ArrowLeft, ArrowRight, GraduationCap, Award, LayoutTemplate, Database, Server, Wrench, ExternalLink, Workflow, Terminal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AudioPlayer from "@/components/AudioPlayer";
import DecryptText from "@/components/DecryptText";
import MedievalCorner from "@/components/MedievalCorner";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";

export default function AboutClient({ dict, tabTitles, locale }: { dict: any, tabTitles: any, locale: string }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isNeumorphic = useNeumorphicTheme();

  // --- FRAMER MOTION CLIP-PATH SETUP ---
  const { scrollY } = useScroll();

  // 1. Animates the parallax clipping mask for the image (from bottom up).
  // Reduced to 315px so the effect completes faster on smaller laptop viewports
  const imageBottomInset = useTransform(scrollY, [0, 315], [0, 115]);
  const clipPathImage = useTransform(imageBottomInset, (val) => `inset(0% 0% ${val}% 0%)`);

  // 2. Animates the exact inverse clipping mask for the backdrop-filter!
  // It covers exactly what the image reveals, creating a perfect seamless boundary.
  const filterTopInset = useTransform(scrollY, [0, 315], [100, -15]);
  const clipPathFilter = useTransform(filterTopInset, (val) => `inset(${val}% 0% 0% 0%)`);

  // 3. Parallax effect specifically for the background image inside the mask.
  const imageY = useTransform(scrollY, [0, 600], [0, -150]);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  // Enforce the tab title on mount and fix the refresh scroll-creep
  useEffect(() => {
    document.title = tabTitles?.about || "About | Samy Barsoum";

    // Tell the browser to turn off its automatic scroll memory
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, [tabTitles]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const stack = [
    {
      category: "Frontend & Design",
      icon: <LayoutTemplate size={32} />,
      tech: ["Next.js", "React", "Angular", "TypeScript", "Tailwind CSS"]
    },
    {
      category: "Backend & Database",
      icon: <Database size={32} />,
      tech: ["NestJS", "Node.js", "Express.js", "Python", "Flask", "Postgres", "MongoDB"]
    },
    {
      category: "Architecture & DevOps",
      icon: <Server size={32} />,
      tech: ["Docker", "Kubernetes", "Jenkins", "Linux OS", "Nexus Repo"]
    },
    {
      category: "API & Testing",
      icon: <Wrench size={32} />,
      tech: ["Postman", "Swagger", "Jest", "Selenium", "BeautifulSoup", "REST APIs", "GraphQL"]
    },
    {
      category: "Agile & Collab",
      icon: <Workflow size={32} />,
      tech: ["Git", "Jira", "Trello", "Notion", "Slack"]
    },
  ];

  const topContent = (
    <>
      {/* --- HEADER --- */}
      <div className="animate-slide-up max-w-7xl mx-auto mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-12 md:gap-6">
        {/* LEFT SIDE: Title & Back Button */}
        <div>
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-xl font-bold uppercase mb-6 bg-white text-black hover:bg-black hover:text-white px-3 py-1 border-4 border-transparent hover:border-black transition-all">
            {locale === 'ar' ? <ArrowRight size={24} /> : <ArrowLeft size={24} />} {dict?.returnGrid || "Return to Grid"}
          </Link>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none flex flex-wrap items-baseline gap-4">
            <DecryptText text={dict?.about || "About"} />
            <span className="bg-black text-white px-4 inline-block transform -skew-x-2"><DecryptText text={dict?.me || "me"} /></span>
          </h1>
        </div>

        {/* RIGHT SIDE: The Music Player */}
        <div className="w-full md:w-auto shrink-0 relative z-10">
          <AudioPlayer dict={dict} />
        </div>
      </div>

      {/* Sized naturally to the content to end right below the cards */}
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10 relative z-10">

        {/* --- EDUCATION & CERTS ROW --- */}
        <div className="animate-slide-up-delay-1 grid grid-cols-1 lg:grid-cols-2 gap-12">

          <section className={`brutalist-container flex flex-col justify-between transition-all duration-300 ${
            isNeumorphic ? "" : "!bg-black !text-white"
          }`}>
            <div>
              <div className={`flex items-center gap-4 border-b-4 pb-4 mb-6 transition-all duration-300 ${
                isNeumorphic ? "border-[#a3b1c6]" : "border-white"
              }`}>
                <GraduationCap size={40} />
                <h2 className="text-4xl font-black uppercase">{dict?.education || "Education"}</h2>
              </div>
              <h3 className="text-3xl font-bold uppercase leading-tight mb-2">{dict?.eduSchool || "Ain Shams University"}</h3>
              <p className={`text-xl font-bold mb-6 uppercase transition-all duration-300 ${
                isNeumorphic ? "text-zinc-500" : "text-zinc-400"
              }`}>{dict?.eduDegree || "Bachelor of Commerce (B.B.A.) // 2019 - 2023"}</p>
              <p className="text-lg md:text-xl font-medium leading-relaxed">
                {dict?.eduDesc || "Specialized in accounting and project management, which strengthened my problem-solving skills and gave me a solid understanding of real-world product needs."}
              </p>
            </div>
          </section>

          <section className="brutalist-container flex flex-col">
            <div className={`flex items-center gap-4 border-b-4 pb-4 mb-6 transition-all duration-300 ${
              isNeumorphic ? "border-[#a3b1c6]" : "border-black"
            }`}>
              <Award size={40} />
              <h2 className="text-4xl font-black uppercase">{dict?.clearances || "Clearances"}</h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* ITI CERTIFICATE */}
              <a
                onClick={(e) => {
                  e.preventDefault();
                  showToast(dict?.notOnline || "MERN Stack certificate is not online yet.");
                }}
                className={`group block border-s-8 ps-4 py-2 transition-all cursor-pointer ${
                  isNeumorphic
                    ? "border-[#a3b1c6] hover:bg-[#d1d9e6] hover:text-[#1e293b]"
                    : "border-black hover:bg-black hover:text-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black uppercase leading-tight">{dict?.mernStack || "MERN Stack & Gen AI"}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 uppercase leading-none whitespace-nowrap">ITI (MCIT)</p>
                      {/* Brutalist Year Tag */}
                      <span className="text-lg font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors leading-none whitespace-nowrap">
                        // 2026
                      </span>
                    </div>
                  </div>
                </div>
              </a>

              {/* CS50x CERTIFICATE */}
              <a
                href="https://cs50.harvard.edu/certificates/09d4b4ad-f9dd-4cf3-a1dc-7385742119f9"
                target="_blank"
                rel="noopener noreferrer"
                className={`group block border-s-8 ps-4 py-2 transition-all cursor-pointer ${
                  isNeumorphic
                    ? "border-[#a3b1c6] hover:bg-[#d1d9e6] hover:text-[#1e293b]"
                    : "border-black hover:bg-black hover:text-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black uppercase leading-tight">{dict?.cs50 || "CS50x"}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 uppercase leading-none whitespace-nowrap">edX (Harvard)</p>
                      <span className="text-lg font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors leading-none whitespace-nowrap">
                        // 2025
                      </span>
                    </div>
                  </div>
                  <ExternalLink size={24} className="opacity-0 group-hover:opacity-100 rtl:translate-x-4 ltr:-translate-x-4 group-hover:translate-x-0 transition-all duration-300 mx-4 shrink-0" />
                </div>
              </a>

              {/* egFWD CERTIFICATE */}
              <a
                href="https://i.ibb.co/ynPJ6szk/FWD-data-Certificate.png"
                target="_blank"
                rel="noopener noreferrer"
                className={`group block border-s-8 ps-4 py-2 transition-all cursor-pointer ${
                  isNeumorphic
                    ? "border-[#a3b1c6] hover:bg-[#d1d9e6] hover:text-[#1e293b]"
                    : "border-black hover:bg-black hover:text-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black uppercase leading-tight">{dict?.dataAnalysis || "Data Analysis"}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 uppercase leading-none whitespace-nowrap">Egypt FWD (MCIT)</p>
                      <span className="text-lg font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors leading-none whitespace-nowrap">
                        // 2021
                      </span>
                    </div>
                  </div>
                  <ExternalLink size={24} className="opacity-0 group-hover:opacity-100 rtl:translate-x-4 ltr:-translate-x-4 group-hover:translate-x-0 transition-all duration-300 mx-4 shrink-0" />
                </div>
              </a>
            </div>
          </section>

        </div>
      </div>
    </>
  );

  return (
    <main className="min-h-screen pb-24 overflow-x-hidden" dir={locale === 'ar' ? 'rtl' : 'ltr'}>

      {/* --- TEXT & PARALLAX BACKGROUND BLOCK --- */}
      {/* 
        This wrapper uses a single DOM tree! 
        1. Base background color is defined here so backdrop-filter has something solid to invert.
        2. Parallax image placed at Z-0 (behind content).
        3. Content placed at Z-10. Native CSS hovers work perfectly!
        4. Backdrop filter placed at Z-20, exactly mathematically inverse to the image. 
      */}
      <div className={`relative w-full ${isNeumorphic ? 'bg-[#e0e5ec]' : 'bg-white'}`}>

        {/* LAYER 0: THE BACKGROUND IMAGE (clipped from bottom up) */}
        <motion.div
          style={{ clipPath: clipPathImage }}
          className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
        >
          <motion.img
            style={{ y: imageY }}
            src="/about.jpg"
            alt=""
            className="absolute -top-[25%] left-0 w-full h-[150%] object-cover object-center"
          />
          {/* Dark overlay to make the image darker as requested */}
          <div className="absolute -top-[25%] left-0 bg-black/30 w-full h-[150%]"></div>
        </motion.div>

        {/* LAYER 1: THE SINGLE-SOURCE CONTENT (Normal text) */}
        <div className="relative z-10 px-6 md:px-12 lg:px-24 pt-28 md:pt-26 pb-6">
          {topContent}
        </div>

        {/* LAYER 2: THE INVERT FILTER (covers the exact opposite of the image!) */}
        <motion.div
          style={{ 
            clipPath: clipPathFilter,
            backdropFilter: 'invert(1) hue-rotate(180deg)'
          }}
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
          aria-hidden="true"
        />

      </div>

      {/* WE START A NEW CONTAINER FOR THE REST OF THE PAGE */}
      <div className="max-w-7xl mx-auto flex flex-col gap-16 mt-8 px-6 md:px-12 lg:px-24 relative z-10">

        {/* --- TECHNICAL ARSENAL --- */}
        <section className="animate-slide-up-delay-2">
          <div className="inline-block bg-black text-white px-6 py-2 mb-8 transform -skew-x-2">
            <h2 className="text-4xl font-black uppercase tracking-widest">{dict?.techArsenal || "Technical Arsenal"}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {stack.map((category, index) => (
              <div
                key={index}
                className={`brutalist-container group transition-all duration-300 flex flex-col ${
                  isNeumorphic
                    ? "hover:!bg-[#d1d9e6] hover:!text-[#1e293b]"
                    : "hover:!bg-black hover:!text-white"
                }`}
              >
                <div className={`flex flex-col items-start gap-4 border-b-4 pb-4 mb-6 transition-all duration-300 ${
                  isNeumorphic ? "border-[#a3b1c6]" : "border-black group-hover:border-white"
                }`}>
                  <div className={`p-3 border-4 text-black transition-all duration-300 ${
                    isNeumorphic
                      ? "border-transparent rounded-xl shadow-[inset_2px_2px_5px_rgba(163,177,198,0.5),_inset_-2px_-2px_5px_rgba(255,255,255,0.7)]"
                      : "border-black group-hover:border-white group-hover:bg-white group-hover:!text-black"
                  }`}>
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-black uppercase leading-none text-left rtl:text-right">{category.category}</h3>
                </div>

                <ul className="flex flex-col gap-3">
                  {category.tech.map((item, i) => (
                    <li key={i} className="text-lg font-bold uppercase flex items-center gap-2">
                      <span className={`w-2 h-2 inline-block transition-all duration-300 shrink-0 ${
                        isNeumorphic
                          ? "bg-[#4b5563] group-hover:bg-[#1e293b]"
                          : "bg-black group-hover:bg-white"
                      }`}></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* --- ARCHIVES / OLD PORTFOLIOS --- */}
        <section className={`animate-slide-up-delay-2 relative p-8 md:p-10 my-10 mx-6 md:mx-10 transition-all duration-300 ${
          isNeumorphic
            ? "brutalist-container"
            : "bg-white border-4 border-black med-border"
        }`}>

          {/* Corner ornaments – only rendered in default / non-neumorphic themes */}
          {!isNeumorphic && (
            <>
              <MedievalCorner pos="tl" />
              <MedievalCorner pos="tr" />
              <MedievalCorner pos="bl" />
              <MedievalCorner pos="br" />
            </>
          )}

          {/* Content Wrapper (z-20 so it renders OVER the corner SVGs) */}
          <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col text-center md:text-left rtl:md:text-right">
              <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight">{dict?.legacySys || "Legacy Systems"}</h2>
              <p className="text-lg md:text-xl font-bold text-zinc-500 uppercase mt-1">{dict?.legacyDesc || "Explore previous portfolio iterations"}</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-6 shrink-0">
              <a
                href="https://my-portfolio-seven-beta-98.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-xl font-black uppercase whitespace-nowrap transition-all duration-300 group ${
                  isNeumorphic
                    ? "bg-[#e0e5ec] text-[#4b5563] rounded-xl shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] hover:bg-[#d1d9e6] hover:text-[#1e293b] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                    : "bg-white text-black border-4 border-black shadow-[8px_8px_0px_#000] hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
                }`}
              >
                {dict?.v1 || "Version 1.0"} <ExternalLink size={24} className="rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://samybit.github.io/brutalist-portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-xl font-black uppercase whitespace-nowrap transition-all duration-300 group ${
                  isNeumorphic
                    ? "bg-[#e0e5ec] text-[#4b5563] rounded-xl shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] hover:bg-[#d1d9e6] hover:text-[#1e293b] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                    : "bg-white text-black border-4 border-black shadow-[8px_8px_0px_#000] hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
                }`}
              >
                {dict?.v2 || "Version 2.0"} <ExternalLink size={24} className="rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>
        </section>

      </div>

      {/* Floating Snackbar/Toast Overlay */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 p-4 border-4 border-black bg-white text-black font-black uppercase text-sm flex items-center justify-between shadow-[8px_8px_0px_0px_#000000] animate-slide-up min-w-[280px] sm:min-w-[350px]"
        >
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="font-black text-xl hover:text-zinc-600 transition-colors mx-6 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

    </main>
  );
}