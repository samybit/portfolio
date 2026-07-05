"use client";

import { ArrowLeft, ArrowRight, GraduationCap, Award, LayoutTemplate, Database, Server, Wrench, ExternalLink, Workflow, Terminal, Compass } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import AudioPlayer from "@/components/AudioPlayer";
import DecryptText from "@/components/DecryptText";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";
import { useScrollMode } from "@/context/ScrollModeContext";
import CurtainScroller from "@/components/CurtainScroller";
import Footer from "@/components/Footer";
import { AnimatedTimeline } from "@/components/animata/progress/animatedtimeline";
import { MorphingText } from "@/components/ui/morphing-text";
import RippleButton from "@/components/lightswind/ripple-button";

export default function AboutClient({ dict, footerDict, tabTitles, locale }: { dict: Record<string, string>, footerDict: Record<string, string>, tabTitles: Record<string, string>, locale: string }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSummaryCardHovered, setIsSummaryCardHovered] = useState(false);
  const [isSkillsCardHovered, setIsSkillsCardHovered] = useState(false);
  const isNeumorphic = useNeumorphicTheme();
  const { isCurtainMode } = useScrollMode();

  // --- FRAMER MOTION CLIP-PATH SETUP ---
  const { scrollY } = useScroll();

  // Dynamic values to adjust scroll speed on mobile vs desktop
  const clipStartScroll = useMotionValue(0);
  const clipEndScroll = useMotionValue(315);
  const parallaxEndScroll = useMotionValue(600);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Mobile: Delay the start of the reveal until the user scrolls down,
        // so it happens on the last part of the area
        clipStartScroll.set(700); 
        clipEndScroll.set(1200);
        parallaxEndScroll.set(1200);
      } else {
        // Desktop: Start immediately, fast effect
        clipStartScroll.set(0);
        clipEndScroll.set(315);
        parallaxEndScroll.set(600);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clipStartScroll, clipEndScroll, parallaxEndScroll]);

  // Helper to calculate progress between start and end
  const getProgress = (y: number, start: number, end: number) => {
    const range = end - start;
    if (range <= 0) return 0;
    return Math.min(Math.max((y - start) / range, 0), 1);
  };

  // 1. Animates the parallax clipping mask for the image (from bottom up).
  const imageBottomInset = useTransform(scrollY, (y) => {
    return getProgress(y, clipStartScroll.get(), clipEndScroll.get()) * 115;
  });
  const clipPathImage = useTransform(imageBottomInset, (val) => `inset(0% 0% ${val}% 0%)`);

  // 2. Animates the exact inverse clipping mask for the backdrop-filter!
  const filterTopInset = useTransform(scrollY, (y) => {
    const progress = getProgress(y, clipStartScroll.get(), clipEndScroll.get());
    return 100 - (progress * 115);
  });
  const clipPathFilter = useTransform(filterTopInset, (val) => `inset(${val}% 0% 0% 0%)`);

  // 3. Parallax effect specifically for the background image inside the mask.
  const imageY = useTransform(scrollY, (y) => {
    // Parallax can start from 0 for a continuous smooth background scroll
    const progress = getProgress(y, 0, parallaxEndScroll.get());
    return progress * -150;
  });

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  // Fix the refresh scroll-creep
  useEffect(() => {
    // Tell the browser to turn off its automatic scroll memory
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

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

  const timelineStyles = {
    lineColor: isNeumorphic ? "#a3b1c6" : "#d1d5db",
    activeLineColor: isNeumorphic ? "#1e293b" : "#000000",
    dotColor: isNeumorphic ? "#a3b1c6" : "#d1d5db",
    activeDotColor: isNeumorphic ? "#1e293b" : "#000000",
    dotSize: "1rem",
    titleColor: "inherit",
    activeTitleColor: "inherit",
    descriptionColor: "inherit",
    dateColor: "inherit",
  };

  const topContent = (
    <>
      {/* --- HEADER --- */}
      <div className="animate-slide-up max-w-7xl mx-auto mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-12 md:gap-6">
        {/* LEFT SIDE: Title & Back Button */}
        <div>
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-xl font-bold uppercase mb-6 bg-white text-black hover:bg-black hover:text-white px-3 py-1 border-4 border-transparent hover:border-black transition-all">
            {locale === 'ar' ? <ArrowRight size={24} /> : <ArrowLeft size={24} />} {dict?.returnGrid || "Return to Grid"}
          </Link>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none flex flex-wrap items-baseline gap-4 text-white">
            <DecryptText text={dict?.about || "About"} />
            <span className="bg-white text-black px-4 inline-block transform -skew-x-2"><DecryptText text={dict?.me || "me"} /></span>
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

          <section className="brutalist-container flex flex-col text-black">
            <div className={`flex items-center gap-4 border-b-4 pb-3 mb-4 transition-all duration-300 ${
              isNeumorphic ? "border-[#a3b1c6]" : "border-black"
            }`}>
              <Award size={40} />
              <h2 className="text-4xl font-black uppercase">{dict?.clearances || "Clearances"}</h2>
            </div>

            <AnimatedTimeline
              events={[{ id: "1", title: "" }, { id: "2", title: "" }, { id: "3", title: "" }]}
              styles={timelineStyles}
              className="py-0 my-0"
              reverseDirection={true}
              customEventRender={(event) => {
                if (event.id === "1") {
                  return (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        showToast(dict?.notOnline || "MERN Stack certificate is not online yet.");
                      }}
                      className={`group block border-s-8 ps-4 py-1.5 transition-all cursor-pointer w-full text-left rtl:text-right ${
                        isNeumorphic
                          ? "border-[#a3b1c6] hover:bg-[#d1d9e6] hover:text-[#1e293b] active:bg-[#d1d9e6] active:text-[#1e293b]"
                          : "border-black hover:bg-black hover:text-white active:bg-black active:text-white"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <h3 className="text-2xl font-black uppercase leading-tight">{dict?.mernStack || "MERN Stack & Gen AI"}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 group-active:text-zinc-300 uppercase leading-none whitespace-nowrap">ITI (MCIT)</p>
                            <span className="text-lg font-bold text-zinc-600 group-hover:text-zinc-400 group-active:text-zinc-400 transition-colors leading-none whitespace-nowrap">
                              {"// 2026"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                }
                if (event.id === "2") {
                  return (
                    <a
                      href="https://cs50.harvard.edu/certificates/09d4b4ad-f9dd-4cf3-a1dc-7385742119f9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group block border-s-8 ps-4 py-1.5 transition-all cursor-pointer w-full text-left rtl:text-right ${
                        isNeumorphic
                          ? "border-[#a3b1c6] hover:bg-[#d1d9e6] hover:text-[#1e293b] active:bg-[#d1d9e6] active:text-[#1e293b]"
                          : "border-black hover:bg-black hover:text-white active:bg-black active:text-white"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <h3 className="text-2xl font-black uppercase leading-tight">{dict?.cs50 || "CS50x"}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 group-active:text-zinc-300 uppercase leading-none whitespace-nowrap">edX (Harvard)</p>
                            <span className="text-lg font-bold text-zinc-600 group-hover:text-zinc-400 group-active:text-zinc-400 transition-colors leading-none whitespace-nowrap">
                              {"// 2025"}
                            </span>
                          </div>
                        </div>
                        <ExternalLink size={24} className="opacity-0 group-hover:opacity-100 group-active:opacity-100 rtl:translate-x-4 ltr:-translate-x-4 group-hover:translate-x-0 group-active:translate-x-0 transition-all duration-300 mx-4 shrink-0" />
                        <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
                      </div>
                    </a>
                  );
                }
                if (event.id === "3") {
                  return (
                    <a
                      href="https://i.ibb.co/ynPJ6szk/FWD-data-Certificate.png"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group block border-s-8 ps-4 py-1.5 transition-all cursor-pointer w-full text-left rtl:text-right ${
                        isNeumorphic
                          ? "border-[#a3b1c6] hover:bg-[#d1d9e6] hover:text-[#1e293b] active:bg-[#d1d9e6] active:text-[#1e293b]"
                          : "border-black hover:bg-black hover:text-white active:bg-black active:text-white"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <h3 className="text-2xl font-black uppercase leading-tight">{dict?.dataAnalysis || "Data Analysis"}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 group-active:text-zinc-300 uppercase leading-none whitespace-nowrap">Egypt FWD (MCIT)</p>
                            <span className="text-lg font-bold text-zinc-600 group-hover:text-zinc-400 group-active:text-zinc-400 transition-colors leading-none whitespace-nowrap">
                              {"// 2021"}
                            </span>
                          </div>
                        </div>
                        <ExternalLink size={24} className="opacity-0 group-hover:opacity-100 group-active:opacity-100 rtl:translate-x-4 ltr:-translate-x-4 group-hover:translate-x-0 group-active:translate-x-0 transition-all duration-300 mx-4 shrink-0" />
                        <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
                      </div>
                    </a>
                  );
                }
                return null;
              }}
            />
          </section>

        </div>
      </div>
    </>
  );

  const section1 = (
      <div className={`relative w-full ${isCurtainMode ? 'min-h-[100svh]' : ''} ${isNeumorphic ? 'bg-[#e0e5ec]' : 'bg-white'}`}>

        {/* Inline SVG filter defs for the glass overlay */}
        <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
          <defs>
            <filter id="about-glass-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.12 0.12" numOctaves="1" result="warp" />
              <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="15" in="SourceGraphic" in2="warp" />
            </filter>
          </defs>
        </svg>

        {/* Layer 1: Parallax image with clip-path */}
        <motion.div
          style={{ clipPath: clipPathImage }}
          className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
        >
          <motion.img
            style={isCurtainMode ? {} : { y: imageY }}
            src="/about.jpg"
            alt=""
            className={`absolute ${isCurtainMode ? 'top-0 h-full' : '-top-[25%] h-[150%]'} left-0 w-full object-cover object-center`}
          />
          <div className={`absolute ${isCurtainMode ? 'top-0 h-full' : '-top-[25%] h-[150%]'} left-0 bg-black/30 w-full`}></div>
        </motion.div>

        {/* Layer 2: Content */}
        <div className="relative z-10 px-6 md:px-12 lg:px-24 pt-36 md:pt-30 pb-6">
          {topContent}
        </div>

        {/* Layer 3: Inverted color filter overlay + Full-height glass distortion.
             It uses clipPathFilter to grow from the bottom as you scroll. */}
        <motion.div
          style={{ 
            clipPath: clipPathFilter,
            backdropFilter: 'invert(1) hue-rotate(180deg)'
          }}
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none about-glass-overlay"
          aria-hidden="true"
        />
      </div>
  );


  const section2 = (
      <div className={`w-full ${isCurtainMode ? `min-h-[100svh] flex items-center transition-colors duration-300 ${isNeumorphic ? 'bg-[#e0e5ec]' : 'bg-black'}` : ''}`}>
        <div className={`w-full ${isCurtainMode ? 'max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10' : ''}`}>
          <section className="animate-slide-up-delay-2">
            <div className="inline-block bg-black text-white px-6 py-2 mb-8 transform -skew-x-2">
              <MorphingText 
                texts={[dict?.whoIAm || "Who I Am", dict?.summary || "Summary"]}
                className="text-4xl font-black uppercase tracking-widest text-white m-0 p-0"
                forceHover={isSummaryCardHovered}
              />
            </div>

            <div 
              onMouseEnter={() => setIsSummaryCardHovered(true)}
              onMouseLeave={() => setIsSummaryCardHovered(false)}
              className={`p-8 md:p-10 transition-all duration-300 ${
                isNeumorphic 
                  ? "brutalist-container bg-white text-black hover:!translate-x-1 hover:!translate-y-1 hover:!shadow-none" 
                  : "brutalist-container-dark hover:!translate-x-1 hover:!translate-y-1 hover:!shadow-none"
              }`}>
              <div className="flex flex-col gap-6 text-lg md:text-xl font-medium leading-relaxed">
                <p>
                  {dict?.bioP1 || "My journey began with Python automation and scripting, building tools to scrape data and automate tasks. I then expanded into full-stack development, mastering the MERN stack to engineer dynamic applications."}
                </p>
                <p>
                  {dict?.bioP2 || "Today, I focus on building complete, containerized applications using Docker, ensuring that what runs on my machine runs everywhere."}
                </p>
                <p>
                  {dict?.bioP3 || "When I'm not coding, you can find me exploring retro tech, playing classic games, or experimenting with 3D web graphics."}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
  );

  const section3 = (
      <div className={`w-full ${isCurtainMode ? `min-h-[100svh] flex items-center transition-colors duration-300 ${isNeumorphic ? 'bg-[#e0e5ec]' : 'bg-black'}` : ''}`}>
        <div className={`w-full ${isCurtainMode ? 'max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 py-12' : ''}`}>
          <section className="animate-slide-up-delay-2">
            <div className="inline-block bg-black text-white px-6 py-2 mb-8 transform -skew-x-2">
              <MorphingText 
                texts={[dict?.techArsenal || "Technical Arsenal", dict?.skills || "Skills"]}
                className="text-4xl font-black uppercase tracking-widest text-white m-0 p-0"
                forceHover={isSkillsCardHovered}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" dir="ltr">
              {stack.map((category, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setIsSkillsCardHovered(true)}
                  onMouseLeave={() => setIsSkillsCardHovered(false)}
                  className={`group transition-all duration-300 flex flex-col ${
                    isNeumorphic
                      ? "brutalist-container hover:!bg-[#d1d9e6] hover:!text-[#1e293b] hover:!translate-x-1 hover:!translate-y-1 hover:!shadow-none"
                      : "brutalist-container-dark hover:!translate-x-1 hover:!translate-y-1 hover:!shadow-none"
                  }`}
                >
                  <div className={`flex flex-col items-start gap-4 border-b-4 pb-4 mb-6 transition-all duration-300 ${
                    isNeumorphic ? "border-[#a3b1c6]" : "border-white"
                  }`}>
                    <div className={`p-3 border-4 transition-all duration-300 ${
                      isNeumorphic
                        ? "border-transparent text-black rounded-xl shadow-[inset_2px_2px_5px_rgba(163,177,198,0.5),_inset_-2px_-2px_5px_rgba(255,255,255,0.7)]"
                        : "border-white text-white"
                    }`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl xl:text-[1.35rem] 2xl:text-2xl tracking-tighter font-black uppercase leading-none text-left">{category.category}</h3>
                  </div>

                  <ul className="flex flex-col gap-3">
                    {category.tech.map((item, i) => (
                      <li key={i} className="text-lg font-bold uppercase flex items-center gap-2">
                        <span className={`w-2 h-2 inline-block transition-all duration-300 shrink-0 ${
                          isNeumorphic
                            ? "bg-[#4b5563] group-hover:bg-[#1e293b]"
                            : "bg-white"
                        }`}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
  );

  const section4 = (
      <div className={`w-full ${isCurtainMode ? `flex flex-col justify-between min-h-[100svh] transition-colors duration-300 ${isNeumorphic ? 'bg-[#e0e5ec]' : 'bg-black'}` : ''}`}>
        <div className={`w-full ${isCurtainMode ? 'max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 flex-grow flex flex-col justify-center py-12' : ''}`}>
          <div className="animate-slide-up-delay-2 w-full">
            <section className={`p-8 md:p-10 transition-all duration-300 ${
              isNeumorphic
                ? "brutalist-container hover:!translate-x-1 hover:!translate-y-1 hover:!shadow-none"
                : "brutalist-container-dark hover:!translate-x-1 hover:!translate-y-1 hover:!shadow-none"
            }`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col text-center md:text-left rtl:md:text-right">
                <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight">{dict?.legacySys || "Legacy Systems"}</h2>
                 <p className={`text-lg md:text-xl font-bold uppercase mt-1 ${isNeumorphic ? "text-zinc-500" : "text-zinc-400"}`}>{dict?.legacyDesc || "Explore previous portfolio iterations"}</p>
              </div>
              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-6 shrink-0">
                <RippleButton
                  href="https://my-portfolio-seven-beta-98.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-xl font-black uppercase whitespace-nowrap transition-all duration-300 group ${
                    isNeumorphic
                      ? "bg-[#e0e5ec] text-[#4b5563] rounded-xl shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                      : "bg-transparent text-white border-4 border-white shadow-[8px_8px_0px_rgba(255,255,255,0.3)] hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
                  }`}
                >
                  {dict?.v1 || "Version 1.0"}
                  <Compass className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[360deg] shrink-0" />
                  <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
                </RippleButton>
                <RippleButton
                  href="https://samybit.github.io/brutalist-portfolio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-xl font-black uppercase whitespace-nowrap transition-all duration-300 group ${
                    isNeumorphic
                      ? "bg-[#e0e5ec] text-[#4b5563] rounded-xl shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                      : "bg-transparent text-white border-4 border-white shadow-[8px_8px_0px_rgba(255,255,255,0.3)] hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
                  }`}
                >
                  {dict?.v2 || "Version 2.0"}
                  <Compass className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[360deg] shrink-0" />
                  <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
                </RippleButton>
              </div>
            </div>
            </section>
          </div>
        </div>
        {isCurtainMode && <Footer dict={footerDict} />}
      </div>
  );

  const toastOverlay = toastMessage ? (
    <div
      id="toast-notification"
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 p-4 border-4 border-black bg-white text-black font-black uppercase text-sm flex items-center justify-between animate-slide-up min-w-[280px] sm:min-w-[350px] overflow-hidden ${
        isNeumorphic ? "shadow-[8px_8px_0px_0px_#000000]" : "shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]"
      }`}
    >
      <span className="relative z-10">{toastMessage}</span>
      <button
        onClick={() => setToastMessage(null)}
        className="font-black text-xl hover:text-zinc-600 transition-colors ms-6 cursor-pointer relative z-10"
      >
        ×
      </button>
      <motion.div 
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
        className={`absolute bottom-0 ${locale === 'ar' ? 'right-0' : 'left-0'} h-[6px] bg-black`}
      />
    </div>
  ) : null;

  if (isCurtainMode) {
    return (
      <main className="h-[100svh] w-full overflow-hidden flex flex-col bg-black" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <CurtainScroller>
          {section1}
          {section2}
          {section3}
          {section4}
        </CurtainScroller>
        {toastOverlay}
      </main>
    );
  }

  return (
    <main className={`min-h-screen flex flex-col overflow-x-hidden transition-colors duration-300 ${
      isNeumorphic ? "bg-[#e0e5ec]" : "bg-black text-white"
    }`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex-grow flex flex-col">
        {section1}
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-16 mt-8 mb-24 px-6 md:px-12 lg:px-24 relative z-10">
          {section2}
          {section3}
          {section4}
        </div>
      </div>
      <Footer dict={footerDict} />
      {toastOverlay}
    </main>
  );
}