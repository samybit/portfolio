"use client";

import { ArrowLeft, GraduationCap, Award, LayoutTemplate, Database, Server, Wrench, ExternalLink, Workflow, Terminal } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import AudioPlayer from "@/components/AudioPlayer";

export default function AboutPage() {
  // Enforce the tab title on mount and fix the refresh scroll-creep
  useEffect(() => {
    document.title = "About | Samy Barsoum";

    // Tell the browser to turn off its automatic scroll memory
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  const stack = [
    {
      category: "Frontend & Design",
      icon: <LayoutTemplate size={32} />,
      tech: ["Next.js", "React", "Angular", "TypeScript", "Tailwind CSS", "Figma"]
    },
    {
      category: "Backend & Database",
      icon: <Database size={32} />,
      tech: ["NestJS", "Node.js", "Express.js", "Python", "Flask", "Postgres", "MongoDB"]
    },
    {
      category: "Architecture & DevOps",
      icon: <Server size={32} />,
      tech: ["Docker", "Kubernetes", "Jenkins", "Prometheus", "Grafana", "Linux OS", "Nexus Repo"]
    },
    {
      category: "API & Testing",
      icon: <Wrench size={32} />,
      tech: ["Postman", "Swagger", "Jest", "Cypress", "Selenium", "BeautifulSoup", "REST APIs"]
    },
    {
      category: "Agile & Collab",
      icon: <Workflow size={32} />,
      tech: ["Git", "Jira", "Trello", "Notion", "Slack"]
    },
    // {
    //   category: "Systems & Low-Level",
    //   icon: <Terminal size={32} />,
    //   tech: ["C", "Rust", "WSL Environment", "CLI Tooling"]
    // }
  ];

  return (
    <main className="min-h-screen px-6 md:px-12 lg:px-24 pt-30 md:pt-32 pb-24">

      {/* --- HEADER --- */}
      <div className="animate-slide-up max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-6">
        {/* LEFT SIDE: Title & Back Button */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold uppercase mb-8 hover:bg-black hover:text-white px-3 py-1 border-4 border-transparent hover:border-black transition-all">
            <ArrowLeft size={24} /> Return to Grid
          </Link>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            About <br /> <span className="bg-black text-white px-4 inline-block mt-2 transform -skew-x-2">me</span>
          </h1>
        </div>

        {/* RIGHT SIDE: The Music Player */}
        <div className="w-full md:w-auto shrink-0">
          <AudioPlayer />
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-16">

        {/* --- EDUCATION & CERTS ROW --- */}
        <div className="animate-slide-up-delay-1 grid grid-cols-1 lg:grid-cols-2 gap-12">

          <section className="brutalist-container !bg-black !text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 border-b-4 border-white pb-4 mb-6">
                <GraduationCap size={40} />
                <h2 className="text-4xl font-black uppercase">Education</h2>
              </div>
              <h3 className="text-3xl font-bold uppercase leading-tight mb-2">Ain Shams University</h3>
              <p className="text-xl font-bold text-zinc-400 mb-6 uppercase">Bachelor of Commerce (B.B.A.) // 2019 - 2023</p>
              <p className="text-lg md:text-xl font-medium leading-relaxed">
                Specialized in accounting and project management, which strengthened my problem-solving skills and gave me a solid understanding of real-world product needs.
              </p>
            </div>
          </section>

          <section className="brutalist-container flex flex-col">
            <div className="flex items-center gap-4 border-b-4 border-black pb-4 mb-6">
              <Award size={40} />
              <h2 className="text-4xl font-black uppercase">Clearances</h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* ITI CERTIFICATE */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group block border-l-8 border-black pl-4 py-2 hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black uppercase leading-tight">MERN Stack & AI</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 uppercase leading-none">ITI (MCIT)</p>
                      {/* Brutalist Year Tag */}
                      <span className="bg-black text-white group-hover:bg-white group-hover:text-black text-xs font-black px-2 py-0.5 uppercase tracking-widest transition-colors leading-none">
                        2026
                      </span>
                    </div>
                  </div>
                  <ExternalLink size={24} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 mr-4 shrink-0" />
                </div>
              </a>

              {/* CS50x CERTIFICATE */}
              <a
                href="https://cs50.harvard.edu/certificates/09d4b4ad-f9dd-4cf3-a1dc-7385742119f9"
                target="_blank"
                rel="noopener noreferrer"
                className="group block border-l-8 border-black pl-4 py-2 hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black uppercase leading-tight">CS50x</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 uppercase leading-none">edX (Harvard)</p>
                      <span className="bg-black text-white group-hover:bg-white group-hover:text-black text-xs font-black px-2 py-0.5 uppercase tracking-widest transition-colors leading-none">
                        2025
                      </span>
                    </div>
                  </div>
                  <ExternalLink size={24} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 mr-4 shrink-0" />
                </div>
              </a>

              {/* egFWD CERTIFICATE */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group block border-l-8 border-black pl-4 py-2 hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black uppercase leading-tight">Data Analysis</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 uppercase leading-none">Egypt FWD (MCIT)</p>
                      <span className="bg-black text-white group-hover:bg-white group-hover:text-black text-xs font-black px-2 py-0.5 uppercase tracking-widest transition-colors leading-none">
                        2021
                      </span>
                    </div>
                  </div>
                  <ExternalLink size={24} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 mr-4 shrink-0" />
                </div>
              </a>
            </div>
          </section>

        </div>

        {/* --- TECHNICAL ARSENAL --- */}
        <section className="animate-slide-up-delay-2">
          <div className="inline-block bg-black text-white px-6 py-2 mb-8 transform -skew-x-2">
            <h2 className="text-4xl font-black uppercase tracking-widest">Technical Arsenal</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {stack.map((category, index) => (
              <div
                key={index}
                className="brutalist-container group hover:!bg-black hover:!text-white transition-colors duration-300 flex flex-col"
              >
                <div className="flex flex-col items-start gap-4 border-b-4 border-black group-hover:border-white pb-4 mb-6 transition-colors duration-300">
                  <div className="p-3 border-4 border-black text-black group-hover:border-white group-hover:bg-white group-hover:!text-black transition-colors duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-black uppercase leading-none">{category.category}</h3>
                </div>

                {/* Removed mt-auto here! The list will now sit perfectly beneath the header line */}
                <ul className="flex flex-col gap-3">
                  {category.tech.map((item, i) => (
                    <li key={i} className="text-lg font-bold uppercase flex items-center gap-2">
                      <span className="w-2 h-2 bg-black group-hover:bg-white inline-block transition-colors duration-300 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}