"use client";

import { ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { playTick } from "@/utils/audio";
import DecryptText from "@/components/DecryptText";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";

// Custom inline SVG for Github with animated tail wag on hover
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <>
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes github-tail-wag {
        0%, 100% { transform: rotate(0deg); }
        15% { transform: rotate(-18deg); }
        30% { transform: rotate(12deg); }
        45% { transform: rotate(-12deg); }
        60% { transform: rotate(8deg); }
        75% { transform: rotate(-4deg); }
      }
      .github-tail {
        transform-origin: 9px 18px;
        transform-box: view-box;
        transition: transform 0.2s ease-in-out;
      }
      .group:hover .github-tail {
        animation: github-tail-wag 2s ease-in-out 1;
      }
    `}} />
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
      style={{ overflow: "visible" }}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" className="github-tail" />
    </svg>
  </>
);

interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  images: string[];
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
  hoveredImages?: string[] | null;
  hoveredTitle?: string | null;
  cardIndex?: number;
  hoveredIndex?: number | null;
  onHover?: (images: string[], title: string, index: number) => void;
  onLeave?: () => void;
}

const ProjectCard = ({ 
  project, 
  dict, 
  animate = false, 
  disableObserver = false, 
  isNeumorphic = false, 
  asHeading = true,
  hoveredImages = null,
  hoveredTitle = null,
  cardIndex,
  hoveredIndex = null,
  onHover,
  onLeave
}: ProjectCardProps) => {
  const [isToggled, setIsToggled] = useState(false);

  // Cleanly check if valid links exist (ignoring empty strings and "#" placeholders)
  const hasGithub = project.github && project.github !== "" && project.github !== "#";
  const hasDemo = project.demo && project.demo !== "" && project.demo !== "#";

  const mainImage = project.images?.[0] || "";

  let otherImage = "";
  if (hoveredImages && hoveredIndex !== null && cardIndex !== undefined) {
    const imageIndex = cardIndex < hoveredIndex ? cardIndex : cardIndex - 1;
    otherImage = hoveredImages[imageIndex] || "";
  }

  const cardContent = (
    <div 
      className={`relative overflow-hidden group/card flex flex-col h-full w-full min-h-[320px] lg:min-h-0 ${!disableObserver ? 'project-card' : ''} ${isToggled ? 'mobile-force-hover' : ''} ${
        isNeumorphic ? "brutalist-container bg-white border-black" : "brutalist-container-dark"
      }`}
      onMouseEnter={() => {
        if (window.innerWidth >= 1024) {
          onHover?.(project.images, project.title, cardIndex ?? 0);
        }
      }}
      onMouseLeave={() => {
        if (window.innerWidth >= 1024) {
          onLeave?.();
        }
      }}
    >
      {/* OTHER CARD HOVERED IMAGE OVERLAY (Desktop only - covers the WHOLE card) */}
      {hoveredTitle && hoveredTitle !== project.title && (
        <div className={`absolute inset-0 z-30 ${
          isNeumorphic ? "bg-white" : "bg-black"
        }`}>
          {otherImage ? (
            <Image
              src={otherImage}
              alt="Hovered Project Preview"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              isNeumorphic ? "bg-zinc-100" : "bg-zinc-900"
            }`}>
              <span className={`font-black uppercase tracking-widest text-sm text-center px-4 ${
                isNeumorphic ? "text-zinc-400" : "text-zinc-600"
              }`}>Screenshot Missing</span>
            </div>
          )}
        </div>
      )}

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
            <p className={`text-sm sm:text-base md:text-lg font-medium leading-snug ${
              isNeumorphic ? "text-zinc-800" : "text-zinc-300"
            }`}>
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
                    : "bg-white text-black"
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* INSTANT HOVER IMAGE OVERLAY (Mobile/CSS active state) */}
        <div className={`project-image-overlay hidden absolute inset-0 z-10 ${
          isNeumorphic ? "bg-white" : "bg-black"
        }`}>
          {mainImage ? (
            <Image
              src={mainImage}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`w-full h-full object-cover border-4 ${
                isNeumorphic ? "border-black" : "border-white"
              }`}
            />
          ) : (
            <div className={`w-full h-full border-4 flex items-center justify-center ${
              isNeumorphic ? "border-black bg-zinc-100" : "border-white bg-zinc-900"
            }`}>
              <span className={`font-black uppercase tracking-widest text-sm text-center px-4 ${
                isNeumorphic ? "text-zinc-400" : "text-zinc-600"
              }`}>Screenshot Missing</span>
            </div>
          )}
        </div>


      </div>

      {/* BOTTOM LINKS BLOCK */}
      <div className={`flex flex-wrap gap-4 border-t-4 pt-3 md:pt-4 flex-none relative z-20 min-h-[48px] md:min-h-[52px] ${
        isNeumorphic ? "border-black" : "border-white"
      }`}>
        {hasGithub && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center gap-1.5 text-sm md:text-base font-bold uppercase px-3 py-1.5 transition-all duration-300 ease-in-out shrink-0 ${
              isNeumorphic
                ? "bg-[#e0e5ec] text-[#4b5563] rounded-xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                : "border-2 border-white text-white hover:bg-white hover:text-black"
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
                : "border-2 border-white text-white hover:bg-white hover:text-black"
            }`}
          >
            {/* Perfectly Concentric Vector Live Indicator */}
            <svg
              className="w-3.5 h-3.5 me-1 shrink-0 overflow-visible"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="8"
                cy="8"
                r="7"
                className={`animate-ping opacity-60 ${
                  isNeumorphic ? "fill-black" : "fill-current"
                }`}
                style={{ transformOrigin: "8px 8px" }}
              />
              <circle
                cx="8"
                cy="8"
                r="3.5"
                className={isNeumorphic ? "fill-black" : "fill-current"}
              />
            </svg>
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

  if (animate) {
    return (
      <div className="animate-slide-up h-full w-full">
        {cardContent}
      </div>
    );
  }

  return cardContent;
};

interface PlaceholderCardProps {
  index: number;
  hoveredTitle: string | null;
  hoveredImages: string[] | null;
  hoveredIndex: number | null;
  isNeumorphic: boolean;
}

const PlaceholderCard = ({
  index,
  hoveredTitle,
  hoveredImages,
  hoveredIndex,
  isNeumorphic
}: PlaceholderCardProps) => {
  // Find the image for this slot from the hovered card's images
  let otherImage = "";
  if (hoveredImages && hoveredIndex !== null) {
    const imageIndex = index < hoveredIndex ? index : index - 1;
    otherImage = hoveredImages[imageIndex] || "";
  }

  if (!hoveredTitle) return null; // completely hidden when no hover

  return (
    <div 
      className={`relative overflow-hidden w-full h-full min-h-[320px] lg:min-h-0 ${
        isNeumorphic ? "brutalist-container bg-white border-black" : "brutalist-container-dark"
      }`}
    >
      {otherImage ? (
        <Image
          src={otherImage}
          alt="Hovered Project Preview"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${
          isNeumorphic ? "bg-zinc-100" : "bg-zinc-900"
        }`}>
          <span className={`font-black uppercase tracking-widest text-sm text-center px-4 ${
            isNeumorphic ? "text-zinc-400" : "text-zinc-600"
          }`}>Screenshot Missing</span>
        </div>
      )}
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
  const [hoveredImages, setHoveredImages] = useState<string[] | null>(null);
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const projects = dict?.list || [];

  const itemsPerPage = 4;
  const totalPages = Math.ceil(projects.length / itemsPerPage) || 1;

  const nextSlide = () => {
    playTick();
    setHoveredImages(null);
    setHoveredTitle(null);
    setHoveredIndex(null);
    setPage((p) => (p + 1) % totalPages);
  };

  const prevSlide = () => {
    playTick();
    setHoveredImages(null);
    setHoveredTitle(null);
    setHoveredIndex(null);
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
    <section id="projects" className={`snap-start relative w-full min-h-[100svh] flex flex-col pt-24 pb-8 px-6 md:px-12 lg:px-24 border-b-8 border-black overflow-hidden ${
      isNeumorphic ? "bg-white text-black" : "bg-black text-white"
    }`}>
      {/* --- CREATIVE ENGINEERING BLUEPRINT & DOT MATRIX BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
        {/* Subtle Top Ambient Lighting */}
        <div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none ${
            isNeumorphic ? "opacity-30" : "opacity-20"
          }`}
          style={{
            background: isNeumorphic 
              ? "radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.06), transparent 70%)"
              : "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.12), transparent 70%)"
          }}
        />

        {/* Micro Technical Dot Matrix */}
        <div 
          className={`absolute inset-0 ${isNeumorphic ? "opacity-20" : "opacity-25"}`}
          style={{
            backgroundImage: isNeumorphic
              ? "radial-gradient(rgba(0, 0, 0, 0.4) 1.2px, transparent 1.2px)"
              : "radial-gradient(rgba(255, 255, 255, 0.35) 1.2px, transparent 1.2px)",
            backgroundSize: "32px 32px"
          }}
        />

        {/* Subtle Crosshair Plus Markers */}
        <div 
          className={`absolute inset-0 ${isNeumorphic ? "opacity-15" : "opacity-20"}`}
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><path d='M48 42v12M42 48h12' stroke='${isNeumorphic ? '%23000000' : '%23ffffff'}' stroke-width='1.5' stroke-linecap='square'/></svg>")`,
            backgroundSize: "96px 96px"
          }}
        />
      </div>

      {/* --- HEADER --- */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-8 lg:mb-12 gap-6 flex-none">
        <div className="w-full md:w-auto">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            <DecryptText text={titleFirst} />
            <br />
            {titleRest && <DecryptText text={titleRest} />}
          </h2>

          <p className={`hidden lg:block text-lg font-bold uppercase mt-4 tracking-widest ${
            isNeumorphic ? "text-zinc-500" : "text-zinc-400"
          }`}>
            {dict?.pageFormat ? dict.pageFormat.replace('{current}', `0${page + 1}`).replace('{total}', `0${totalPages}`) : `[ PAGE 0${page + 1} / 0${totalPages} ]`}
          </p>

          <div className={`flex lg:hidden items-center justify-between mt-6 p-2 transition-all duration-300 ${
            isNeumorphic
              ? "bg-[#e0e5ec] rounded-2xl shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),_inset_-3px_-3px_6px_rgba(255,255,255,0.7)]"
              : "border-2 border-white bg-black"
          }`}>
            <span className={`text-xs sm:text-sm font-bold uppercase tracking-widest ps-2 ${
              isNeumorphic ? "text-zinc-500" : "text-zinc-400"
            }`}>
              {showAllMobile ? "[ Scroll ↓ ]" : `[ ${dict?.swipeHint || "Swipe to explore"} ]`}
            </span>
            <button
              onClick={() => setShowAllMobile(!showAllMobile)}
              className={`px-3 py-2 text-xs sm:text-sm font-black uppercase transition-all duration-300 ${
                isNeumorphic
                  ? "bg-[#e0e5ec] text-[#4b5563] rounded-xl shadow-[4px_4px_8px_rgba(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.7),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)] active:translate-y-[2px]"
                  : "bg-white text-black border-2 border-transparent hover:border-white"
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
          className={`hidden md:block text-xl font-bold uppercase border-b-4 pb-1 transition-colors ${
            isNeumorphic ? "border-black hover:bg-black hover:text-white" : "border-white hover:bg-white hover:text-black"
          }`}
        >
          {dict?.viewGithub || "View full GitHub →"}
          <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
        </a>
      </div>

      {/* --- DESKTOP VIEW: Paginated Grid & Controls --- */}
      <div className="relative z-10 hidden lg:grid grid-cols-[1fr_5rem] gap-6 xl:gap-8 flex-1 min-h-0">

        {/* The 2x2 Grid container */}
        <div className="grid grid-cols-2 grid-rows-2 gap-6 xl:gap-8 h-full w-full">
          {Array.from({ length: 4 }).map((_, index) => {
            if (index < currentProjects.length) {
              const project = currentProjects[index];
              return (
                <ProjectCard 
                  key={`desktop-${page}-${index}`} 
                  project={project} 
                  dict={dict} 
                  animate={true} 
                  isNeumorphic={isNeumorphic} 
                  hoveredImages={hoveredImages}
                  hoveredTitle={hoveredTitle}
                  cardIndex={index}
                  hoveredIndex={hoveredIndex}
                  onHover={(images, title, idx) => {
                    setHoveredImages(images);
                    setHoveredTitle(title);
                    setHoveredIndex(idx);
                  }}
                  onLeave={() => {
                    setHoveredImages(null);
                    setHoveredTitle(null);
                    setHoveredIndex(null);
                  }}
                />
              );
            } else {
              return (
                <PlaceholderCard
                  key={`desktop-placeholder-${page}-${index}`}
                  index={index}
                  hoveredTitle={hoveredTitle}
                  hoveredImages={hoveredImages}
                  hoveredIndex={hoveredIndex}
                  isNeumorphic={isNeumorphic}
                />
              );
            }
          })}
        </div>

        {/* The Sidebar Controls */}
        <div className={`flex flex-col border-4 h-full w-full transition-all duration-200 ease-in-out ${
          isNeumorphic
            ? "border-black bg-white brutalist-shadow-static"
            : "border-white bg-black shadow-[8px_8px_0px_rgba(255,255,255,0.3)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] active:translate-x-2 active:translate-y-2 active:shadow-none rtl:shadow-[-8px_8px_0px_rgba(255,255,255,0.3)] rtl:hover:-translate-x-1 rtl:hover:shadow-[-4px_4px_0px_rgba(255,255,255,0.3)] rtl:active:-translate-x-2"
        }`}>
          <button onClick={prevSlide} className={`flex-1 flex flex-col items-center justify-center gap-2 border-b-4 transition-colors group ${
            isNeumorphic ? "border-black hover:bg-black hover:text-white" : "border-white hover:bg-white hover:text-black"
          }`}>
            <ArrowUp size={32} className="group-hover:-translate-y-2 transition-transform" />
            <span className="font-black uppercase tracking-widest text-xs rotate-180 [writing-mode:vertical-rl] rtl:-rotate-180">{dict?.prev || "Prev"}</span>
          </button>
          <button onClick={nextSlide} className={`flex-1 flex flex-col items-center justify-center gap-2 transition-colors group ${
            isNeumorphic ? "hover:bg-black hover:text-white" : "hover:bg-white hover:text-black"
          }`}>
            <span className="font-black uppercase tracking-widest text-xs [writing-mode:vertical-rl]">{dict?.next || "Next"}</span>
            <ArrowDown size={32} className="group-hover:translate-y-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* --- MOBILE VIEW --- */}
      {showAllMobile ? (
        <div className="relative z-10 flex lg:hidden flex-col gap-6 pb-8 flex-1">
          {projects.map((project: Project, index: number) => (
            <div key={`mobile-list-${index}`} className="w-full">
              <ProjectCard project={project} dict={dict} animate={true} isNeumorphic={isNeumorphic} asHeading={false} />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative z-10 flex flex-col lg:hidden flex-1 w-full">
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
              className={`w-full appearance-none h-3 border-2 outline-none transition-all duration-300
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                ${isNeumorphic 
                  ? "bg-[#e0e5ec] border-black shadow-[inset_2px_2px_4px_rgba(163,177,198,0.5),_inset_-2px_-2px_4px_rgba(255,255,255,0.7)] [&::-webkit-slider-thumb]:bg-[#e0e5ec] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[4px_4px_8px_rgba(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.5)] [&::-webkit-slider-thumb]:border-none" 
                  : "bg-black border-white [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:shadow-[4px_4px_0px_rgba(255,255,255,0.3)]"
                }
              `}
            />
          </div>
        </div>
      )}

      {/* --- MOBILE GITHUB LINK (Bottom CTA) --- */}
      <div className="relative z-10 flex md:hidden mt-4 w-full flex-none">
        <a
          href="https://github.com/samybit"
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full p-4 text-lg font-black uppercase text-center transition-all duration-300 ${
            isNeumorphic
              ? "bg-[#e0e5ec] text-[#4b5563] rounded-2xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)] active:translate-y-[2px]"
              : "bg-white text-black border-4 border-white hover:bg-black hover:text-white"
          }`}
        >
          {dict?.viewGithub || "View Full GitHub →"}
          <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
        </a>
      </div>

    </section >
  );
}