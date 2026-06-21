"use client";

import { ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { playTick } from "@/utils/audio";
import DecryptText from "@/components/DecryptText";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";

// Custom inline SVG for Github
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  image: string;
}

interface ProjectsDictionary {
  title: string;
  swipeHint: string;
  viewAll: string;
  hide: string;
  repo: string;
  demo: string;
  offline: string;
  viewGithub: string;
  prev: string;
  next: string;
  pageFormat: string;
  newTab: string;
  list: Project[];
}

interface ProjectCardProps {
  project: Project;
  dict: ProjectsDictionary;
  animate?: boolean;
  disableObserver?: boolean;
  isNeumorphic?: boolean;
  asHeading?: boolean;
}

const ProjectCard = ({ project, dict, animate = false, disableObserver = false, isNeumorphic = false, asHeading = true }: ProjectCardProps) => {
  const [isToggled, setIsToggled] = useState(false);

  // Cleanly check if valid links exist (ignoring empty strings and "#" placeholders)
  const hasGithub = project.github && project.github !== "" && project.github !== "#";
  const hasDemo = project.demo && project.demo !== "" && project.demo !== "#";

  return (
    <div 
      className={`group/card brutalist-container bg-white border-black flex flex-col h-full w-full min-h-[320px] lg:min-h-0 ${animate ? 'animate-slide-up' : ''} ${!disableObserver ? 'project-card' : ''} ${isToggled ? 'mobile-force-hover' : ''}`}
    >

      <div 
        className="relative flex-1 flex flex-col min-h-0 pb-4 md:pb-5 cursor-pointer lg:cursor-auto"
        onClick={() => {
          if (window.innerWidth < 1024 && disableObserver) {
            setIsToggled(!isToggled);
          }
        }}
      >

        {/* Default Content Block */}
        <div className="flex flex-col flex-1">
          <div>
            {asHeading ? (
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase mb-2 md:mb-3 tracking-tight leading-none md:leading-tight">
                {project.title}
              </h3>
            ) : (
              <div className="text-xl sm:text-2xl md:text-3xl font-black uppercase mb-2 md:mb-3 tracking-tight leading-none md:leading-tight">
                {project.title}
              </div>
            )}
            <p className="text-sm sm:text-base md:text-lg font-medium text-zinc-800 leading-snug">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-auto pt-4">
            {project.tech.map((tech: string, i: number) => (
              <span
                key={i}
                className={`px-2 py-1 md:px-2.5 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isNeumorphic
                    ? "bg-[#d1d9e6]/70 text-[#4b5563] rounded-md"
                    : "bg-black text-white"
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* INSTANT HOVER IMAGE OVERLAY */}
        <div className="project-image-overlay hidden lg:group-hover/card:block absolute inset-0 z-10 bg-white">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="w-full h-full object-cover border-4 border-black"
              unoptimized
            />
          ) : (
            <div className="w-full h-full border-4 border-black bg-zinc-100 flex items-center justify-center">
              <span className="font-black text-zinc-400 uppercase tracking-widest text-sm text-center px-4">Screenshot Missing</span>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM LINKS BLOCK */}
      <div className="flex flex-wrap gap-4 border-t-4 border-black pt-3 md:pt-4 flex-none relative z-20 min-h-[48px] md:min-h-[52px]">
        {hasGithub && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center gap-1.5 text-sm md:text-base font-bold uppercase px-3 py-1.5 transition-all duration-300 ease-in-out shrink-0 ${
              isNeumorphic
                ? "bg-[#e0e5ec] text-[#4b5563] rounded-xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                : "border-2 border-black hover:bg-white hover:text-black"
            }`}
          >
            <GithubIcon size={20} /> {dict?.repo || "Repo"}
            <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
          </a>
        )}

        {hasDemo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center gap-1.5 text-sm md:text-base font-bold uppercase px-3 py-1.5 transition-all duration-300 ease-in-out shrink-0 ${
              isNeumorphic
                ? "bg-[#e0e5ec] text-[#4b5563] rounded-xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                : "border-2 border-black hover:bg-white hover:text-black"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5 me-1" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-black"></span>
            </span>
            <span className="sr-only">Active live demo indicator: </span>
            {dict?.demo || "Live Demo"} <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
          </a>
        )}

        {/* Fallback state when both links are missing */}
        {!hasGithub && !hasDemo && (
          <span className="text-sm md:text-base font-bold uppercase text-zinc-500 flex items-center cursor-not-allowed">
            {dict?.offline || "[ Offline / Local Build ]"}
          </span>
        )}
      </div>
    </div>
  );
};

export default function Projects({ dict }: { dict: ProjectsDictionary }) {
  const [page, setPage] = useState(0);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const isNeumorphic = useNeumorphicTheme();
  const [mobileScrollProgress, setMobileScrollProgress] = useState(0);
  const isDraggingSlider = useRef(false);
  const mobileSwipeRef = useRef<HTMLDivElement>(null);

  const projects = dict?.list || [];

  const itemsPerPage = 4;
  const totalPages = Math.ceil(projects.length / itemsPerPage) || 1;

  const nextSlide = () => {
    playTick();
    setPage((p) => (p + 1) % totalPages);
  };

  const prevSlide = () => {
    playTick();
    setPage((p) => (p - 1 + totalPages) % totalPages);
  };

  const currentProjects = projects.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handleMobileScroll = () => {
    if (!mobileSwipeRef.current || isDraggingSlider.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = mobileSwipeRef.current;
    if (scrollWidth <= clientWidth) return;
    const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    setMobileScrollProgress(progress);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const progress = parseFloat(e.target.value);
    setMobileScrollProgress(progress);
    if (!mobileSwipeRef.current) return;
    const { scrollWidth, clientWidth } = mobileSwipeRef.current;
    const maxScroll = scrollWidth - clientWidth;
    mobileSwipeRef.current.scrollLeft = (progress / 100) * maxScroll;
  };

  // --- MOBILE SCROLL HOVER EFFECTS ---
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-60% 0px -20% 0px", // Zone shifted lower: starts at 60% depth, ends at 80% depth
      threshold: 0
    };

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const card = entry.target;

        if (window.innerWidth < 1024) {
          if (entry.isIntersecting) {
            card.classList.add('mobile-active');
          } else {
            card.classList.remove('mobile-active');
          }
        } else {
          card.classList.remove('mobile-active');
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => scrollObserver.observe(card));

    return () => scrollObserver.disconnect();
  }, [page, showAllMobile]);

  // Handle title splitting dynamically for languages (first word on top, rest on bottom)
  const titleWords = (dict?.title || "Selected Works").split(" ");
  const titleFirst = titleWords[0];
  const titleRest = titleWords.slice(1).join(" ");

  return (
    <section id="projects" className="snap-start relative w-full min-h-[100svh] flex flex-col pt-24 pb-8 px-6 md:px-12 lg:px-24 border-b-8 border-black overflow-hidden">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 lg:mb-12 gap-6 flex-none">
        <div className="w-full md:w-auto">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            <DecryptText text={titleFirst} />
            <br />
            {titleRest && <DecryptText text={titleRest} />}
          </h2>

          <p className="hidden lg:block text-lg font-bold uppercase text-zinc-500 mt-4 tracking-widest">
            {dict?.pageFormat ? dict.pageFormat.replace('{current}', `0${page + 1}`).replace('{total}', `0${totalPages}`) : `[ PAGE 0${page + 1} / 0${totalPages} ]`}
          </p>

          <div className={`flex lg:hidden items-center justify-between mt-6 p-2 transition-all duration-300 ${
            isNeumorphic
              ? "bg-[#e0e5ec] rounded-2xl shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),_inset_-3px_-3px_6px_rgba(255,255,255,0.7)]"
              : "border-2 border-black bg-white"
          }`}>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-500 ps-2">
              {showAllMobile ? "[ Scroll ↓ ]" : `[ ${dict?.swipeHint || "Swipe to explore"} ]`}
            </span>
            <button
              onClick={() => setShowAllMobile(!showAllMobile)}
              className={`px-3 py-2 text-xs sm:text-sm font-black uppercase transition-all duration-300 ${
                isNeumorphic
                  ? "bg-[#e0e5ec] text-[#4b5563] rounded-xl shadow-[4px_4px_8px_rgba(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.7),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)] active:translate-y-[2px]"
                  : "bg-black text-white border-2 border-transparent hover:border-black"
              }`}
            >
              {showAllMobile ? (dict?.hide || "Hide Projects") : (dict?.viewAll || "View All Projects")}
            </button>
          </div>
        </div>

        <a
          href="https://github.com/samybit"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block text-xl font-bold uppercase border-b-4 border-black pb-1 hover:bg-black hover:text-white transition-colors"
        >
          {dict?.viewGithub || "View full GitHub →"}
          <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
        </a>
      </div>

      {/* --- DESKTOP VIEW: Paginated Grid & Controls --- */}
      <div className="hidden lg:grid grid-cols-[1fr_5rem] gap-6 xl:gap-8 flex-1 min-h-0">

        {/* The 2x2 Grid container */}
        <div className="grid grid-cols-2 grid-rows-2 gap-6 xl:gap-8 h-full w-full">
          {currentProjects.map((project: Project, index: number) => (
            <ProjectCard key={`desktop-${page}-${index}`} project={project} dict={dict} animate={true} isNeumorphic={isNeumorphic} />
          ))}
        </div>

        {/* The Sidebar Controls */}
        <div className={`flex flex-col border-4 border-black bg-white h-full w-full transition-all duration-200 ease-in-out ${
          isNeumorphic
            ? "brutalist-shadow-static"
            : "shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#000] active:translate-x-2 active:translate-y-2 active:shadow-none rtl:shadow-[-8px_8px_0px_#000] rtl:hover:-translate-x-1 rtl:hover:shadow-[-4px_4px_0px_#000] rtl:active:-translate-x-2"
        }`}>
          <button onClick={prevSlide} className="flex-1 flex flex-col items-center justify-center gap-2 border-b-4 border-black hover:bg-black hover:text-white transition-colors group">
            <ArrowUp size={32} className="group-hover:-translate-y-2 transition-transform" />
            <span className="font-black uppercase tracking-widest text-xs rotate-180 [writing-mode:vertical-rl] rtl:-rotate-180">{dict?.prev || "Prev"}</span>
          </button>
          <button onClick={nextSlide} className="flex-1 flex flex-col items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors group">
            <span className="font-black uppercase tracking-widest text-xs [writing-mode:vertical-rl]">{dict?.next || "Next"}</span>
            <ArrowDown size={32} className="group-hover:translate-y-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* --- MOBILE VIEW --- */}
      {showAllMobile ? (
        <div className="flex lg:hidden flex-col gap-6 pb-8 flex-1">
          {projects.map((project: Project, index: number) => (
            <div key={`mobile-list-${index}`} className="w-full">
              <ProjectCard project={project} dict={dict} animate={true} isNeumorphic={isNeumorphic} asHeading={false} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col lg:hidden flex-1 w-full relative">
          <div
            ref={mobileSwipeRef}
            onScroll={handleMobileScroll}
            className="flex overflow-x-auto gap-4 pt-5 pb-6 snap-x snap-mandatory -mx-6 px-6 w-[calc(100%+3rem)] min-h-[320px] hide-scrollbar"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {projects.map((project: Project, index: number) => (
              <div key={`mobile-swipe-${index}`} className="w-[85vw] sm:w-[60vw] shrink-0 snap-center h-full">
                <ProjectCard project={project} dict={dict} animate={false} disableObserver={true} isNeumorphic={isNeumorphic} asHeading={false} />
              </div>
            ))}
            <div className="w-[1px] shrink-0"></div>
          </div>
          
          {/* Brutalist Mobile Slider */}
          <div className="mt-2 w-full flex items-center justify-center px-4 max-w-[85vw] mx-auto">
            <input 
              aria-label={dict?.swipeHint || "Scroll projects"}
              type="range" 
              min="0" 
              max="100" 
              step="any"
              value={mobileScrollProgress}
              onChange={handleSliderChange}
              onPointerDown={() => isDraggingSlider.current = true}
              onPointerUp={() => isDraggingSlider.current = false}
              onTouchStart={() => isDraggingSlider.current = true}
              onTouchEnd={() => isDraggingSlider.current = false}
              className={`w-full appearance-none h-3 border-2 border-black outline-none transition-all duration-300
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                ${isNeumorphic 
                  ? "bg-[#e0e5ec] shadow-[inset_2px_2px_4px_rgba(163,177,198,0.5),_inset_-2px_-2px_4px_rgba(255,255,255,0.7)] [&::-webkit-slider-thumb]:bg-[#e0e5ec] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[4px_4px_8px_rgba(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.5)] [&::-webkit-slider-thumb]:border-none" 
                  : "bg-white [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:shadow-[4px_4px_0px_#000]"
                }
              `}
            />
          </div>
        </div>
      )}

      {/* --- MOBILE GITHUB LINK (Bottom CTA) --- */}
      <div className="flex md:hidden mt-4 w-full flex-none">
        <a
          href="https://github.com/samybit"
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full p-4 text-lg font-black uppercase text-center transition-all duration-300 ${
            isNeumorphic
              ? "bg-[#e0e5ec] text-[#4b5563] rounded-2xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)] active:translate-y-[2px]"
              : "bg-black text-white border-4 border-black hover:bg-white hover:text-black"
          }`}
        >
          {dict?.viewGithub || "View Full GitHub →"}
          <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
        </a>
      </div>

    </section >
  );
}