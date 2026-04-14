"use client";

import { ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";

// Custom inline SVG for Github
const GithubIcon = ({ size = 24 }: { size?: number }) => (
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

const projects = [
  {
    title: "Vanilla JS E-Commerce",
    description: "Full-scale store engine with role-based access control (Admin/User), product management, and persistent data.",
    tech: ["JavaScript", "HTML", "CSS", "LocalStorage"],
    github: "https://github.com/samybit/vanilla-js-ecommerce",
    demo: "https://samybit.github.io/vanilla-js-ecommerce/"
  },
  {
    title: "Movie Intelligence App",
    description: "Cinematic platform featuring Firebase authentication, global state management, and localized filtering system.",
    tech: ["React", "Shadcn UI", "Firebase", "i18n"],
    github: "https://github.com/samybit/iti-movie-app",
    demo: "https://iti-movie-app.pages.dev/"
  },
  {
    title: "BearBuzz",
    description: "Dual-interface (CLI & GUI) Python engine tracking stock volatility, dispatching automated Twilio SMS alerts with live financial headlines.",
    tech: ["Python", "Twilio API", "CI/CD", "Tkinter"],
    github: "https://github.com/samybit/bearbuzz",
    demo: "#"
  },
  {
    title: "Questlog",
    description: "Full-stack progression engine tracking video game milestones and visual completion percentages via a dynamic dashboard.",
    tech: ["Full-Stack", "Data Vis", "Tracking"],
    github: "https://github.com/samybit/game-completion-board",
    demo: "#"
  },
  {
    title: "Lead Scraper",
    description: "Automated freelance lead generation and scraping pipeline built for efficiency.",
    tech: ["n8n", "Python", "Automation", "gemini-ai"],
    github: "https://github.com/samybit/freelance-lead-scraper",
    demo: "#"
  },
  {
    title: "CLI Expense Tracker",
    description: "Memory-safe, blazingly fast command-line tool featuring dynamic allocation and file I/O.",
    tech: ["C", "CLI", "Data Structures"],
    github: "https://github.com/samybit",
    demo: "#"
  }
];

// Extracted reusable Card Component to keep the DOM clean
const ProjectCard = ({ project, animate = false }: { project: any, animate?: boolean }) => (
  <div className={`brutalist-container flex flex-col justify-between min-h-[380px] h-full ${animate ? 'animate-slide-up' : ''}`}>
    <div>
      {/* SHIFT 1: Fluid Typography. text-2xl on mobile, text-4xl on desktop. Tighter line-height (leading-none) prevents massive vertical gaps when it does wrap. */}
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase mb-3 md:mb-4 tracking-tight leading-none md:leading-tight">
        {project.title}
      </h3>

      {/* SHIFT 2: Paragraph scaling. text-base on mobile, text-xl on desktop. */}
      <p className="text-base sm:text-lg md:text-xl font-medium mb-6 md:mb-8 text-zinc-800 leading-snug">
        {project.description}
      </p>

      {/* SHIFT 3: Tighter tech badges. Smaller gap (gap-2) and text (text-xs) on mobile so more fit per line. */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
        {project.tech.map((tech: string, i: number) => (
          <span key={i} className="px-2 py-1 md:px-3 bg-black text-white text-xs md:text-sm font-bold uppercase tracking-wider">
            {tech}
          </span>
        ))}
      </div>
    </div>

    {/* SHIFT 4: Added flex-wrap here. If the screen is too narrow for Repo and Demo to sit side-by-side, they will cleanly stack instead of breaking the box. */}
    <div className="flex flex-wrap gap-4 md:gap-6 border-t-4 border-black pt-4 md:pt-6 mt-auto">
      <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base md:text-lg font-bold uppercase hover:underline">
        <GithubIcon size={24} /> Repo
      </a>
      {project.demo !== "#" && (
        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-base md:text-lg font-bold uppercase hover:bg-white hover:text-black px-2 transition-colors border-2 border-transparent hover:border-black shrink-0">
          <span className="relative flex h-3 w-3 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
          </span>
          Live Demo <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      )}
    </div>
  </div>
);

export default function Projects() {
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const nextSlide = () => setPage((p) => (p + 1) % totalPages);
  const prevSlide = () => setPage((p) => (p - 1 + totalPages) % totalPages);

  const currentProjects = projects.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <section id="projects" className="py-24 px-6 md:px-12 lg:px-24 border-b-8 border-black overflow-hidden">

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            Selected <br /> Works
          </h2>
          <p className="hidden lg:block text-xl font-bold uppercase text-zinc-500 mt-4 tracking-widest">
            [ PAGE 0{page + 1} / 0{totalPages} ]
          </p>
          <p className="block lg:hidden text-xl font-bold uppercase text-zinc-500 mt-4 tracking-widest animate-pulse">
            [ Swipe to explore → ]
          </p>
        </div>
        <a
          href="https://github.com/samybit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-bold uppercase border-b-4 border-black pb-1 hover:bg-black hover:text-white transition-colors"
        >
          View full GitHub →
        </a>
      </div>

      {/* --- DESKTOP VIEW: Paginated Grid & Controls --- */}
      <div className="hidden lg:flex gap-12">
        <div className="flex-1 grid grid-cols-2 gap-12 min-h-[820px] content-start">
          {currentProjects.map((project, index) => (
            <ProjectCard key={`desktop-${page}-${index}`} project={project} animate={true} />
          ))}
        </div>

        <div className="flex flex-col w-24 shrink-0 border-4 border-black brutalist-shadow bg-white">
          <button onClick={prevSlide} className="flex-1 flex flex-col items-center justify-center gap-2 border-b-4 border-black hover:bg-black hover:text-white transition-colors group">
            <ArrowUp size={40} className="group-hover:-translate-y-2 transition-transform" />
            <span className="font-black uppercase tracking-widest text-xs rotate-180" style={{ writingMode: 'vertical-rl' }}>Prev</span>
          </button>
          <button onClick={nextSlide} className="flex-1 flex flex-col items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors group">
            <span className="font-black uppercase tracking-widest text-xs" style={{ writingMode: 'vertical-rl' }}>Next</span>
            <ArrowDown size={40} className="group-hover:translate-y-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* --- MOBILE VIEW: Native CSS Swiping --- */}
      {/* -mx-6 px-6 breaks the slider out of the section padding so cards can touch the screen edge */}
      <div
        className="flex lg:hidden overflow-x-auto gap-4 pb-8 snap-x snap-mandatory -mx-6 px-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        <style dangerouslySetInnerHTML={{ __html: `div::-webkit-scrollbar { display: none; }` }} />

        {/* Changed from 80vw to 85vw on small screens, scaling to 60vw on larger phones */}
        {projects.map((project, index) => (
          <div key={`mobile-${index}`} className="w-[85vw] sm:w-[60vw] shrink-0 snap-center">
            <ProjectCard project={project} animate={false} />
          </div>
        ))}

        {/* This tiny spacer ensures the final card can snap perfectly to the end without being cut off by the padding */}
        <div className="w-[1px] shrink-0"></div>
      </div>

    </section >
  );
}