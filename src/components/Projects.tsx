"use client";

import { ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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

interface HoveredImageOverlayProps {
  cardIndex: number;
  hoveredIndex: number;
  imageSrc: string;
  isNeumorphic: boolean;
}

const HoveredImageOverlay = ({
  cardIndex,
  hoveredIndex,
  imageSrc,
  isNeumorphic,
}: HoveredImageOverlayProps) => {
  const colTarget = cardIndex % 2;
  const rowTarget = Math.floor(cardIndex / 2);
  const colSource = hoveredIndex % 2;
  const rowSource = Math.floor(hoveredIndex / 2);

  const deltaCol = colSource - colTarget;
  const deltaRow = rowSource - rowTarget;

  const startX = deltaCol === 0 ? "0%" : deltaCol > 0 ? "105%" : "-105%";
  const startY = deltaRow === 0 ? "0%" : deltaRow > 0 ? "105%" : "-105%";

  return (
    <motion.div
      initial={{
        x: startX,
        y: startY,
        scale: 0.35,
        opacity: 0,
      }}
      animate={{
        x: "0%",
        y: "0%",
        scale: 1,
        opacity: 1,
      }}
      exit={{
        x: startX,
        y: startY,
        scale: 0.35,
        opacity: 0,
      }}
      transition={{
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`absolute inset-0 z-30 overflow-hidden ${
        isNeumorphic ? "bg-white" : "bg-black"
      }`}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt="Hovered Project Preview"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`w-full h-full object-cover border-4 ${
            isNeumorphic ? "border-black" : "border-white"
          }`}
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center border-4 ${
            isNeumorphic ? "border-black bg-zinc-100" : "border-white bg-zinc-900"
          }`}
        >
          <span
            className={`font-black uppercase tracking-widest text-sm text-center px-4 ${
              isNeumorphic ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            Screenshot Missing
          </span>
        </div>
      )}
    </motion.div>
  );
};

interface Project {
  title: string;
  subtitle?: string;
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
      className={`relative overflow-hidden group/card flex flex-col justify-between lg:aspect-[16/9] w-full ${!disableObserver ? 'project-card' : ''} ${isToggled ? 'mobile-force-hover' : ''} ${
        isNeumorphic ? "brutalist-container bg-white border-black p-3" : "brutalist-container-dark p-3"
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
      {/* OTHER CARD HOVERED IMAGE OVERLAY WITH ANIMATED FLY-OUT */}
      <AnimatePresence>
        {hoveredTitle && hoveredTitle !== project.title && hoveredIndex !== null && cardIndex !== undefined && (
          <HoveredImageOverlay
            cardIndex={cardIndex}
            hoveredIndex={hoveredIndex}
            imageSrc={otherImage}
            isNeumorphic={isNeumorphic}
          />
        )}
      </AnimatePresence>

      <div 
        className="relative flex-1 flex flex-col min-h-0 pb-1 max-lg:cursor-pointer justify-between overflow-hidden"
        onClick={() => {
          if (window.innerWidth < 1024 && disableObserver) {
            setIsToggled(!isToggled);
          }
        }}
      >

        {/* Default Content Block */}
        <div className="flex flex-col flex-1 min-h-0 justify-between">
          <div className="flex-1 min-h-0 flex flex-col justify-start">
            {asHeading ? (
              <h3 className="text-lg sm:text-xl xl:text-2xl font-black uppercase mb-0.5 tracking-tight leading-none">
                {project.title}
              </h3>
            ) : (
              <div className="text-lg sm:text-xl xl:text-2xl font-black uppercase mb-0.5 tracking-tight leading-none">
                {project.title}
              </div>
            )}

            {project.subtitle && (
              <div className="mb-0.5">
                <span className={`inline-block text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border tracking-wide ${
                  isNeumorphic
                    ? "bg-[#d1d9e6]/70 text-zinc-700 border-zinc-400/70"
                    : "bg-zinc-900 text-zinc-300 border-zinc-700"
                }`}>
                  {project.subtitle}
                </span>
              </div>
            )}

            <div className="flex-1 min-h-0 overflow-y-auto pr-1 text-xs sm:text-sm md:text-base font-medium leading-snug whitespace-pre-line custom-scrollbar mt-1">
              <p className={isNeumorphic ? "text-zinc-800" : "text-zinc-300"}>
                {project.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {project.tech.map((tech: string, i: number) => (
              <span
                key={i}
                className={`px-2 py-0.5 md:px-2.5 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
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
      <div className={`flex flex-wrap gap-3 border-t-4 pt-2 flex-none relative z-20 min-h-[44px] ${
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

  return (
    <div 
      className={`relative overflow-hidden w-full aspect-[16/9] ${
        isNeumorphic ? "brutalist-container bg-white border-black" : "brutalist-container-dark"
      }`}
    >
      <div className="font-mono text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center h-full opacity-40 select-none">
        [ BLUEPRINT SLOT 0{index + 1} ]
      </div>

      <AnimatePresence>
        {hoveredTitle && hoveredIndex !== null && (
          <HoveredImageOverlay
            cardIndex={index}
            hoveredIndex={hoveredIndex}
            imageSrc={otherImage}
            isNeumorphic={isNeumorphic}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Projects({ dict }: { dict: ProjectsDictionary }) {
  const [page, setPage] = useState(0);
  const isNeumorphic = useNeumorphicTheme();
  const [expandedMobileIndex, setExpandedMobileIndex] = useState<number | null>(null);
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


  // Handle title splitting dynamically for languages (first word on top, rest on bottom)
  const titleWords = (dict?.title || "Selected Works").split(" ");
  const titleFirst = titleWords[0];
  const titleRest = titleWords.slice(1).join(" ");

  return (
    <section id="projects" className={`relative w-full min-h-[100svh] flex flex-col justify-between pt-12 lg:pt-16 pb-8 md:pb-12 px-6 md:px-12 lg:px-24 border-b-8 border-black ${
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

      {/* --- 1200px CONTENT WRAPPER --- */}
      <div className="w-full max-w-[75rem] mx-auto flex flex-col flex-1 min-h-0">

      {/* --- HEADER --- */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-4 lg:mb-6 gap-2 md:gap-4 flex-none">
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-4 sm:gap-6">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              <DecryptText text={titleFirst} />
              <br />
              {titleRest && <DecryptText text={titleRest} />}
            </h2>
            <div className="h-1.5 md:h-2 bg-current w-10 sm:w-20 md:w-28 shrink-0 self-center" />
          </div>

          <p className={`hidden lg:block text-lg font-bold uppercase mt-4 tracking-widest ${
            isNeumorphic ? "text-zinc-500" : "text-zinc-400"
          }`}>
            {dict?.pageFormat ? dict.pageFormat.replace('{current}', `0${page + 1}`).replace('{total}', `0${totalPages}`) : `[ PAGE 0${page + 1} / 0${totalPages} ]`}
          </p>
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
      <div className="relative z-10 hidden lg:grid grid-cols-[1fr_5rem] gap-5 xl:gap-6 flex-1 min-h-0 w-full items-center mb-2 projects-grid-magnet">

        {/* The 2x2 Grid container */}
        <div className="grid grid-cols-2 gap-4 xl:gap-5 w-full">
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
            : "border-white bg-black shadow-[8px_8px_0px_rgba(255,255,255,0.3)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] active:translate-x-2 active:translate-y-2 active:shadow-none"
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

      {/* --- MOBILE VIEW: Vertical stacked list --- */}
      <div className="relative z-10 flex lg:hidden flex-col gap-2 flex-1 pt-2 pb-4 projects-grid-magnet" ref={mobileSwipeRef}>

        {/* Mobile project count indicator */}
        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${
          isNeumorphic ? "text-zinc-400" : "text-zinc-500"
        }`}>
          {projects.length} Projects
        </p>

        {projects.map((project: Project, index: number) => {
          const isExpanded = expandedMobileIndex === index;
          const hasGithub = project.github && project.github !== "" && project.github !== "#";
          const hasDemo = project.demo && project.demo !== "" && project.demo !== "#";
          const thumb = project.images?.[0] || "";
          const allImages = project.images?.filter(Boolean) || [];

          return (
            <div
              key={`mobile-card-${index}`}
              className={`relative w-full overflow-hidden transition-shadow duration-300 ${
                isNeumorphic
                  ? `bg-white border-4 border-black ${isExpanded ? "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]" : ""}`
                  : `bg-black border-4 border-white ${isExpanded ? "shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]" : ""}`
              }`}
            >
              {/* ── Collapsed Row: tap to expand ── */}
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() => setExpandedMobileIndex(isExpanded ? null : index)}
                className={`w-full flex items-stretch gap-0 text-left ${
                  isNeumorphic
                    ? `transition-colors ${isExpanded ? "bg-black text-white" : "bg-white text-black"}`
                    : `transition-colors ${isExpanded ? "bg-white text-black" : "bg-black text-white"}`
                }`}
              >
                {/* Thumbnail */}
                <div className="relative shrink-0 w-[80px] h-[80px]">
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt={project.title}
                      fill
                      sizes="80px"
                      className={`object-cover border-e-4 ${
                        isNeumorphic
                          ? isExpanded ? "border-white" : "border-black"
                          : isExpanded ? "border-black" : "border-white"
                      }`}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center border-e-4 ${
                      isNeumorphic ? "border-black bg-zinc-100" : "border-white bg-zinc-900"
                    }`}>
                      <span className="text-[8px] font-black uppercase tracking-wider text-center leading-tight px-1 opacity-40">
                        No&nbsp;Img
                      </span>
                    </div>
                  )}

                  {/* Index badge */}
                  <span className={`absolute top-0.5 start-0.5 text-[9px] font-black tabular-nums px-1 leading-none py-0.5 ${
                    isExpanded
                      ? isNeumorphic ? "bg-white text-black" : "bg-black text-white"
                      : isNeumorphic ? "bg-black text-white" : "bg-white text-black"
                  }`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Title + Tags */}
                <div className="flex-1 flex flex-col justify-center px-3 py-2.5 min-w-0">
                  <span className="text-sm font-black uppercase tracking-tight leading-tight truncate">
                    {project.title}
                  </span>
                  {project.subtitle && (
                    <span className={`text-[10px] font-bold mt-0.5 tracking-wide truncate ${
                      isExpanded
                        ? isNeumorphic ? "text-zinc-300" : "text-zinc-500"
                        : isNeumorphic ? "text-zinc-500" : "text-zinc-400"
                    }`}>
                      {project.subtitle}
                    </span>
                  )}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {project.tech.slice(0, 3).map((t: string, i: number) => (
                      <span key={i} className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider leading-none ${
                        isExpanded
                          ? isNeumorphic ? "bg-white text-black" : "bg-black text-white border border-white/30"
                          : isNeumorphic ? "bg-[#d1d9e6]/70 text-[#4b5563]" : "bg-white text-black"
                      }`}>{t}</span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className={`text-[9px] font-bold ${
                        isExpanded
                          ? isNeumorphic ? "text-zinc-300" : "text-zinc-400"
                          : isNeumorphic ? "text-zinc-400" : "text-zinc-500"
                      }`}>+{project.tech.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Expand indicator */}
                <div className={`flex items-center px-3 shrink-0 border-s-4 ${
                  isExpanded
                    ? isNeumorphic ? "border-white" : "border-black"
                    : isNeumorphic ? "border-black" : "border-white"
                }`}>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"/>
                    </svg>
                  </motion.div>
                </div>
              </button>

              {/* ── Expanded Detail Panel ── */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="expanded"
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className={`border-t-4 ${isNeumorphic ? "border-black" : "border-white"}`}>
                      {/* Screenshot — constrained height so it doesn't overwhelm */}
                      {thumb && (
                        <div className="relative w-full" style={{ maxHeight: "42vw", minHeight: "120px" }}>
                          <Image
                            src={thumb}
                            alt={project.title}
                            fill
                            sizes="100vw"
                            className="object-cover object-top"
                          />
                          {/* Multi-image dots */}
                          {allImages.length > 1 && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                              {allImages.map((_: string, di: number) => (
                                <span key={di} className={`inline-block w-1.5 h-1.5 rounded-full ${
                                  di === 0
                                    ? isNeumorphic ? "bg-black" : "bg-white"
                                    : "bg-white/40"
                                }`} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Description + All Tags + Buttons */}
                      <div className="px-3 pt-3 pb-3">
                        <p className={`text-xs leading-relaxed ${
                          isNeumorphic ? "text-zinc-700" : "text-zinc-300"
                        }`}>
                          {project.description}
                        </p>

                        {/* All tech tags — full list */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {project.tech.map((t: string, i: number) => (
                            <span key={i} className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider leading-none ${
                              isNeumorphic ? "bg-[#d1d9e6]/70 text-[#4b5563]" : "bg-white text-black"
                            }`}>{t}</span>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className={`flex gap-2 mt-3 pt-3 border-t-4 ${
                          isNeumorphic ? "border-black" : "border-white"
                        }`}>
                          {hasGithub && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`group flex items-center justify-center gap-1.5 text-xs font-black uppercase px-3 py-2.5 flex-1 transition-all duration-200 ${
                                isNeumorphic
                                  ? "border-2 border-black text-black hover:bg-black hover:text-white active:bg-black active:text-white"
                                  : "border-2 border-white text-white hover:bg-white hover:text-black active:bg-white active:text-black"
                              }`}
                            >
                              <GithubIcon size={14} /> {dict?.repo || "Repo"}
                            </a>
                          )}
                          {hasDemo && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`group flex items-center justify-center gap-1.5 text-xs font-black uppercase px-3 py-2.5 flex-1 transition-all duration-200 ${
                                isNeumorphic
                                  ? "bg-black text-white border-2 border-black hover:bg-zinc-800"
                                  : "bg-white text-black border-2 border-white hover:bg-zinc-100"
                              }`}
                            >
                              <svg className="w-3 h-3 shrink-0 overflow-visible" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <circle cx="8" cy="8" r="7" className="animate-ping opacity-60 fill-current" style={{ transformOrigin: "8px 8px" }} />
                                <circle cx="8" cy="8" r="3.5" className="fill-current" />
                              </svg>
                              {dict?.demo || "Live Demo"} <ExternalLink size={12} />
                            </a>
                          )}
                          {!hasGithub && !hasDemo && (
                            <span className="text-xs font-bold uppercase text-zinc-500 px-2">{dict?.offline || "[ Offline ]"}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Mobile GitHub CTA */}
        <a
          href="https://github.com/samybit"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 w-full mt-2 p-4 text-base font-black uppercase text-center transition-all duration-200 ${
            isNeumorphic
              ? "bg-black text-white border-4 border-black active:bg-zinc-800"
              : "bg-white text-black border-4 border-white active:bg-zinc-100"
          }`}
        >
          <GithubIcon size={18} />
          {dict?.viewGithub || "View Full GitHub →"}
          <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
        </a>
      </div>

      </div>{/* end 1200px wrapper */}

    </section>
  );
}