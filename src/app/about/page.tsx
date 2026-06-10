"use client";

import { ArrowLeft, GraduationCap, Award, LayoutTemplate, Database, Server, Wrench, ExternalLink, Workflow, Terminal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import DecryptText from "@/components/DecryptText";

export default function AboutPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNeumorphic, setIsNeumorphic] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  // Enforce the tab title on mount and fix the refresh scroll-creep
  useEffect(() => {
    document.title = "About | Samy Barsoum";

    // Tell the browser to turn off its automatic scroll memory
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Detect and observe theme class on HTML element
    setIsNeumorphic(document.documentElement.classList.contains("theme-neumorphic"));
    const observer = new MutationObserver(() => {
      setIsNeumorphic(document.documentElement.classList.contains("theme-neumorphic"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
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
            <DecryptText text="About" /> <br /> <span className="bg-black text-white px-4 inline-block mt-2 transform -skew-x-2"><DecryptText text="me" /></span>
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

          <section className={`brutalist-container flex flex-col justify-between transition-all duration-300 ${
            isNeumorphic ? "" : "!bg-black !text-white"
          }`}>
            <div>
              <div className={`flex items-center gap-4 border-b-4 pb-4 mb-6 transition-all duration-300 ${
                isNeumorphic ? "border-[#a3b1c6]" : "border-white"
              }`}>
                <GraduationCap size={40} />
                <h2 className="text-4xl font-black uppercase">Education</h2>
              </div>
              <h3 className="text-3xl font-bold uppercase leading-tight mb-2">Ain Shams University</h3>
              <p className={`text-xl font-bold mb-6 uppercase transition-all duration-300 ${
                isNeumorphic ? "text-zinc-500" : "text-zinc-400"
              }`}>Bachelor of Commerce (B.B.A.) // 2019 - 2023</p>
              <p className="text-lg md:text-xl font-medium leading-relaxed">
                Specialized in accounting and project management, which strengthened my problem-solving skills and gave me a solid understanding of real-world product needs.
              </p>
            </div>
          </section>

          <section className="brutalist-container flex flex-col">
            <div className={`flex items-center gap-4 border-b-4 pb-4 mb-6 transition-all duration-300 ${
              isNeumorphic ? "border-[#a3b1c6]" : "border-black"
            }`}>
              <Award size={40} />
              <h2 className="text-4xl font-black uppercase">Clearances</h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* ITI CERTIFICATE */}
              <a
                onClick={(e) => {
                  e.preventDefault();
                  showToast("MERN Stack certificate is not online yet.");
                }}
                className={`group block border-l-8 pl-4 py-2 transition-all cursor-pointer ${
                  isNeumorphic
                    ? "border-[#a3b1c6] hover:bg-[#d1d9e6] hover:text-[#1e293b]"
                    : "border-black hover:bg-black hover:text-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black uppercase leading-tight">MERN Stack &  Gen AI</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 uppercase leading-none">ITI (MCIT)</p>
                      {/* Brutalist Year Tag */}
                      <span className="text-lg font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors leading-none">
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
                className={`group block border-l-8 pl-4 py-2 transition-all cursor-pointer ${
                  isNeumorphic
                    ? "border-[#a3b1c6] hover:bg-[#d1d9e6] hover:text-[#1e293b]"
                    : "border-black hover:bg-black hover:text-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black uppercase leading-tight">CS50x</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 uppercase leading-none">edX (Harvard)</p>
                      <span className="text-lg font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors leading-none">
                        // 2025
                      </span>
                    </div>
                  </div>
                  <ExternalLink size={24} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 mr-4 shrink-0" />
                </div>
              </a>

              {/* egFWD CERTIFICATE */}
              <a
                href="https://i.ibb.co/ynPJ6szk/FWD-data-Certificate.png"
                target="_blank"
                rel="noopener noreferrer"
                className={`group block border-l-8 pl-4 py-2 transition-all cursor-pointer ${
                  isNeumorphic
                    ? "border-[#a3b1c6] hover:bg-[#d1d9e6] hover:text-[#1e293b]"
                    : "border-black hover:bg-black hover:text-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black uppercase leading-tight">Data Analysis</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 uppercase leading-none">Egypt FWD (MCIT)</p>
                      <span className="text-lg font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors leading-none">
                        // 2021
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
                  <h3 className="text-2xl font-black uppercase leading-none">{category.category}</h3>
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
        <section className={`animate-slide-up-delay-2 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-300 ${
          isNeumorphic
            ? "brutalist-container"
            : "bg-white border-4 border-black"
        }`}>
          <div className="flex flex-col text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight">Legacy Systems</h2>
            <p className="text-lg md:text-xl font-bold text-zinc-500 uppercase mt-1">Explore previous portfolio iterations</p>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-6 shrink-0">
            <a
              href="https://my-portfolio-seven-beta-98.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-4 flex items-center justify-center gap-3 text-xl font-black uppercase transition-all duration-300 group ${
                isNeumorphic
                  ? "bg-[#e0e5ec] text-[#4b5563] rounded-xl shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] hover:bg-[#d1d9e6] hover:text-[#1e293b] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                  : "brutalist-shadow bg-white text-black border-4 border-black hover:bg-black hover:text-white"
              }`}
            >
              Version 1.0 <ExternalLink size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
            <a
              href="https://samybit.github.io/brutalist-portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-4 flex items-center justify-center gap-3 text-xl font-black uppercase transition-all duration-300 group ${
                isNeumorphic
                  ? "bg-[#e0e5ec] text-[#4b5563] rounded-xl shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] hover:bg-[#d1d9e6] hover:text-[#1e293b] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                  : "brutalist-shadow bg-black text-white border-4 border-black hover:bg-white hover:text-black"
              }`}
            >
              Version 2.0 <ExternalLink size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
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
            className="font-black text-xl hover:text-zinc-600 transition-colors ml-6 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

    </main>
  );
}