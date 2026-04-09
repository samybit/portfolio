"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

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
    title: "3D Solar System",
    description: "Interactive planetary simulator combining the MERN stack with Three.js rendering.",
    tech: ["React", "Three.js", "Node.js", "MongoDB"],
    github: "https://github.com/samybit",
    demo: "#"
  },
  {
    title: "Corporate Dashboard",
    description: "High-performance admin dashboard featuring rich data visualization and strict typing.",
    tech: ["React", "Material-UI", "TypeScript"],
    github: "https://github.com/samybit",
    demo: "#"
  },
  {
    title: "Lead Scraper",
    description: "Automated freelance lead generation and scraping pipeline built for efficiency.",
    tech: ["n8n", "Python", "Automation"],
    github: "https://github.com/samybit",
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
  return (
    <section id="projects" className="py-24 px-6 md:px-12 lg:px-24 border-b-8 border-black">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
          Selected <br /> Works
        </h2>
        <a
          href="https://github.com/samybit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-bold uppercase border-b-4 border-black pb-1 hover:bg-black hover:text-white transition-colors"
        >
          View full GitHub →
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="will-change-opacity brutalist-container flex flex-col justify-between min-h-[350px]"
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
                  className="flex items-center gap-2 text-lg font-bold uppercase hover:underline"
                >
                  <ExternalLink size={24} /> Live Demo
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}