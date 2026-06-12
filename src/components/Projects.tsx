"use client";

import { ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { playTick } from "@/utils/audio";
import DecryptText from "@/components/DecryptText";

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

const projects: Project[] = [
  {
    title: "Bento Game Tracker",
    description: "Bento-grid progression engine powered by Next.js 16 and Gemini 2.5 Flash Lite. Features real-time AI achievement assistant.",
    tech: ["Next.js", "Prisma", "PostgreSQL", "Gemini AI"],
    github: "https://github.com/samybit/bento-game-tracker",
    demo: "https://bento-game-tracker.vercel.app",
    image: "/bento.png"
  },
  {
    title: "Movie Intelligence App",
    description: "Cinematic platform featuring Firebase authentication, global state management, and localized filtering system.",
    tech: ["React", "Shadcn UI", "Firebase", "i18n"],
    github: "https://github.com/samybit/iti-movie-app",
    demo: "https://iti-movie-app.pages.dev/",
    image: "/moviedb.png"
  },
  {
    title: "3D Web",
    description: "Showcase of 3D web rendering. It integrates Framer Motion, Three.js, Spline, Globe.gl, Atropos, and Pure CSS.",
    tech: ["react", "nextjs", "webgl"],
    github: "https://github.com/samybit/3d-showcase",
    demo: "https://3d-showcase-pi.vercel.app",
    image: "/3dweb.png"
  },
  {
    title: "Verdant Plants Store",
    description: "Fully functional e-commerce boutique powered by WordPress and WooCommerce. Features catalog management and Kadence UI blocks.",
    tech: ["WordPress", "WooCommerce", "Kadence UI", "LocalWP"],
    github: "",
    demo: "#",
    image: "/plantswp.png"
  },
  {
    title: "Lead Scraper",
    description: "Automated freelance lead generation and scraping pipeline built for efficiency.",
    tech: ["n8n", "Python", "Automation", "gemini-ai"],
    github: "https://github.com/samybit/freelance-lead-scraper",
    demo: "#",
    image: ""
  },
  {
    title: "Vanilla JS E-Commerce",
    description: "Full-scale store engine with role-based access control (Admin/User), product management, and persistent data.",
    tech: ["JavaScript", "HTML", "CSS", "LocalStorage"],
    github: "https://github.com/samybit/vanilla-js-ecommerce",
    demo: "https://samybit.github.io/vanilla-js-ecommerce/",
    image: ""
  },
  {
    title: "BearBuzz",
    description: "Dual-interface (CLI & GUI) Python engine tracking stock volatility, dispatching automated Twilio SMS alerts with live financial headlines.",
    tech: ["Python", "Twilio API", "CI/CD", "Tkinter"],
    github: "https://github.com/samybit/bearbuzz",
    demo: "#",
    image: "/bearbuzz.png"
  },
  // {
  //   title: "Questlog",
  //   description: "Full-stack progression engine tracking video game milestones and visual completion percentages via a dynamic dashboard.",
  //   tech: ["Full-Stack", "Data Vis", "Tracking"],
  //   github: "https://github.com/samybit/game-completion-board",
  //   demo: "",
  //   image: ""
  // },
  {
    title: "CLI Expense Tracker",
    description: "Memory-safe, blazingly fast command-line tool featuring dynamic allocation and file I/O.",
    tech: ["C", "CLI", "Data Structures"],
    github: "https://github.com/samybit/cli-expense-tracker",
    demo: "#",
    image: "/cli.png"
  }
];

interface ProjectCardProps {
  project: Project;
  animate?: boolean;
  disableObserver?: boolean;
  isNeumorphic?: boolean;
  asHeading?: boolean;
}

const ProjectCard = ({ project, animate = false, disableObserver = false, isNeumorphic = false, asHeading = true }: ProjectCardProps) => {
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
      {/* Added min-h-[48px] md:min-h-[52px] to force the exact same physical footprint even if empty */}
      <div className="flex flex-wrap gap-4 border-t-4 border-black pt-3 md:pt-4 flex-none relative z-20 min-h-[48px] md:min-h-[52px]">
        {hasGithub && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-sm md:text-base font-bold uppercase hover:bg-white hover:text-black px-3 py-1.5 transition-all border-2 border-black shrink-0"
          >
            <GithubIcon size={20} /> Repo
          </a>
        )}

        {hasDemo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-sm md:text-base font-bold uppercase hover:bg-white hover:text-black px-3 py-1.5 transition-all border-2 border-black shrink-0"
          >
            <span className="relative flex h-2.5 w-2.5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-black"></span>
            </span>
            Live Demo <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        )}

        {/* Fallback state when both links are missing */}
        {!hasGithub && !hasDemo && (
          <span className="text-sm md:text-base font-bold uppercase text-zinc-500 flex items-center cursor-not-allowed">
            [ Offline / Local Build ]
          </span>
        )}
      </div>
    </div>
  );
};

export default function Projects() {
  const [page, setPage] = useState(0);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [isNeumorphic, setIsNeumorphic] = useState(false);

  useEffect(() => {
    setIsNeumorphic(document.documentElement.classList.contains("theme-neumorphic"));
    const observer = new MutationObserver(() => {
      setIsNeumorphic(document.documentElement.classList.contains("theme-neumorphic"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const nextSlide = () => {
    playTick();
    setPage((p) => (p + 1) % totalPages);
  };

  const prevSlide = () => {
    playTick();
    setPage((p) => (p - 1 + totalPages) % totalPages);
  };

  const currentProjects = projects.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

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

        // DYNAMIC CHECK: lg breakpoint in Tailwind is 1024px.
        // Only apply this auto-hover logic on mobile/tablet screens.
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

    // Find all project cards and begin observing
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => scrollObserver.observe(card));

    // Clean up on unmount or when dependencies change (like pagination)
    return () => scrollObserver.disconnect();
  }, [page, showAllMobile]);

  return (
    <section id="projects" className="snap-start relative w-full min-h-[80vh] flex flex-col pt-24 pb-8 px-6 md:px-12 lg:px-24 border-b-8 border-black overflow-hidden">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 lg:mb-12 gap-6 flex-none">
        <div className="w-full md:w-auto">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            <DecryptText text="Selected" />
            <br />
            <DecryptText text="Works" />
          </h2>

          <p className="hidden lg:block text-lg font-bold uppercase text-zinc-500 mt-4 tracking-widest">
            [ PAGE 0{page + 1} / 0{totalPages} ]
          </p>

          <div className={`flex lg:hidden items-center justify-between mt-6 p-2 transition-all duration-300 ${
            isNeumorphic
              ? "bg-[#e0e5ec] rounded-2xl shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),_inset_-3px_-3px_6px_rgba(255,255,255,0.7)]"
              : "border-2 border-black bg-white"
          }`}>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-500 pl-2">
              {showAllMobile ? "[ Scroll ↓ ]" : "[ Swipe & Tap ]"}
            </span>
            <button
              onClick={() => setShowAllMobile(!showAllMobile)}
              className={`px-3 py-2 text-xs sm:text-sm font-black uppercase transition-all duration-300 ${
                isNeumorphic
                  ? "bg-[#e0e5ec] text-[#4b5563] rounded-xl shadow-[4px_4px_8px_rgba(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.7),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)] active:translate-y-[2px]"
                  : "bg-black text-white border-2 border-transparent hover:border-black"
              }`}
            >
              {showAllMobile ? "Swipe View" : "View All"}
            </button>
          </div>
        </div>

        <a
          href="https://github.com/samybit"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block text-xl font-bold uppercase border-b-4 border-black pb-1 hover:bg-black hover:text-white transition-colors"
        >
          View full GitHub →
        </a>
      </div>

      {/* --- DESKTOP VIEW: Paginated Grid & Controls --- */}
      <div className="hidden lg:grid grid-cols-[1fr_5rem] gap-6 xl:gap-8 flex-1 min-h-0">

        {/* The 2x2 Grid container */}
        <div className="grid grid-cols-2 grid-rows-2 gap-6 xl:gap-8 h-full w-full">
          {currentProjects.map((project, index) => (
            <ProjectCard key={`desktop-${page}-${index}`} project={project} animate={true} isNeumorphic={isNeumorphic} />
          ))}
        </div>

        {/* The Sidebar Controls */}
        <div className={`flex flex-col border-4 border-black bg-white h-full w-full transition-all duration-200 ease-in-out ${
          isNeumorphic
            ? "brutalist-shadow-static"
            : "shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#000] active:translate-x-2 active:translate-y-2 active:shadow-none"
        }`}>
          <button onClick={prevSlide} className="flex-1 flex flex-col items-center justify-center gap-2 border-b-4 border-black hover:bg-black hover:text-white transition-colors group">
            <ArrowUp size={32} className="group-hover:-translate-y-2 transition-transform" />
            <span className="font-black uppercase tracking-widest text-xs rotate-180 [writing-mode:vertical-rl]">Prev</span>
          </button>
          <button onClick={nextSlide} className="flex-1 flex flex-col items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors group">
            <span className="font-black uppercase tracking-widest text-xs [writing-mode:vertical-rl]">Next</span>
            <ArrowDown size={32} className="group-hover:translate-y-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* --- MOBILE VIEW --- */}
      {showAllMobile ? (
        <div aria-hidden="true" className="flex lg:hidden flex-col gap-6 pb-8 flex-1">
          {projects.map((project, index) => (
            <div key={`mobile-list-${index}`} className="w-full">
              <ProjectCard project={project} animate={true} isNeumorphic={isNeumorphic} asHeading={false} />
            </div>
          ))}
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="flex lg:hidden overflow-x-auto gap-4 pt-5 pb-6 snap-x snap-mandatory -mx-6 px-6 flex-1 min-h-[320px] hide-scrollbar"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {projects.map((project, index) => (
            <div key={`mobile-swipe-${index}`} className="w-[85vw] sm:w-[60vw] shrink-0 snap-center h-full">
              <ProjectCard project={project} animate={false} disableObserver={true} isNeumorphic={isNeumorphic} asHeading={false} />
            </div>
          ))}
          <div className="w-[1px] shrink-0"></div>
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
          View Full GitHub →
        </a>
      </div>

    </section >
  );
}