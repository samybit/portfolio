"use client";

import { ExternalLink, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

// Custom inline SVG to perfectly match Lucide's 24x24 style
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

export default function Projects() {
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  // Loops back to the start/end seamlessly
  const nextSlide = () => setPage((p) => (p + 1) % totalPages);
  const prevSlide = () => setPage((p) => (p - 1 + totalPages) % totalPages);

  // Get the 4 projects for the current page
  const currentProjects = projects.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <section id="projects" className="py-24 px-6 md:px-12 lg:px-24 border-b-8 border-black">

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            Selected <br /> Works
          </h2>
          <p className="text-xl font-bold uppercase text-zinc-500 mt-4 tracking-widest">
            [ PAGE 0{page + 1} / 0{totalPages} ]
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

      {/* --- MAIN CONTENT & CONTROLS --- */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

        {/* The Project Grid (Locked Height) */}
        {/* min-h-[820px] on desktop guarantees the container height never shrinks on Page 2 */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:min-h-[820px] content-start">
          {currentProjects.map((project, index) => (
            <div
              key={`${page}-${index}`} // Forces React to re-trigger the slide-up animation on page change
              className="animate-slide-up brutalist-container flex flex-col justify-between min-h-[380px]"
            >
              <div>
                <h3 className="text-4xl font-black uppercase mb-4 tracking-tight">{project.title}</h3>
                <p className="text-xl font-medium mb-8 text-zinc-800">{project.description}</p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-black text-white text-sm font-bold uppercase tracking-wider">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-6 border-t-4 border-black pt-6 mt-auto">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-lg font-bold uppercase hover:underline"
                >
                  <GithubIcon size={24} /> Repo
                </a>
                {project.demo !== "#" && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-lg font-bold uppercase hover:bg-white hover:text-black px-2 transition-colors border-2 border-transparent hover:border-black"
                  >
                    <span className="relative flex h-3 w-3 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
                    </span>
                    Live Demo <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* --- DESKTOP NAVIGATION (Vertical Right Side) --- */}
        <div className="hidden lg:flex flex-col w-24 shrink-0 border-4 border-black brutalist-shadow bg-white">
          <button
            onClick={prevSlide}
            aria-label="Previous Projects"
            className="flex-1 flex flex-col items-center justify-center gap-2 border-b-4 border-black hover:bg-black hover:text-white transition-colors group"
          >
            <ArrowUp size={40} className="group-hover:-translate-y-2 transition-transform" />
            <span className="font-black uppercase tracking-widest text-xs rotate-180" style={{ writingMode: 'vertical-rl' }}>Prev</span>
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Projects"
            className="flex-1 flex flex-col items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors group"
          >
            <span className="font-black uppercase tracking-widest text-xs" style={{ writingMode: 'vertical-rl' }}>Next</span>
            <ArrowDown size={40} className="group-hover:translate-y-2 transition-transform" />
          </button>
        </div>

        {/* --- MOBILE NAVIGATION (Horizontal Bottom) --- */}
        <div className="flex lg:hidden w-full h-24 border-4 border-black brutalist-shadow bg-white mt-4">
          <button
            onClick={prevSlide}
            className="flex-1 flex items-center justify-center gap-2 border-r-4 border-black hover:bg-black hover:text-white transition-colors group"
          >
            <ArrowLeft size={32} className="group-hover:-translate-x-2 transition-transform" />
            <span className="font-black uppercase tracking-widest">Prev</span>
          </button>

          <button
            onClick={nextSlide}
            className="flex-1 flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors group"
          >
            <span className="font-black uppercase tracking-widest">Next</span>
            <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}