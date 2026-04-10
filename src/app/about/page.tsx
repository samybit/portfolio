"use client";

import { ArrowLeft, GraduationCap, Award, LayoutTemplate, Database, Server, Wrench } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function AboutPage() {
  // Enforce the tab title on mount
  useEffect(() => {
    document.title = "About | Samy Barsoum";
  }, []);

  const stack = [
    {
      category: "Frontend & UI",
      icon: <LayoutTemplate size={32} />,
      tech: ["React.js", "Next.js", "Angular", "Tailwind CSS", "JavaScript (ES6+)", "Bootstrap 5", "Figma"]
    },
    {
      category: "Backend & DB",
      icon: <Database size={32} />,
      tech: ["Node.js", "NestJS", "Express.js", "Python", "Flask", "MongoDB", "WTForms"]
    },
    {
      category: "DevOps & Tools",
      icon: <Server size={32} />,
      tech: ["Docker", "Kubernetes", "Git / GitHub", "Linux OS", "Nexus Repo Manager"]
    },
    {
      category: "Automation",
      icon: <Wrench size={32} />,
      tech: ["Selenium", "BeautifulSoup", "Tkinter (GUI)", "REST APIs"]
    }
  ];

  return (
    <main className="min-h-screen px-6 md:px-12 lg:px-24 pt-30 md:pt-34 pb-24">

      {/* --- HEADER --- */}
      <div className="animate-slide-up max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold uppercase mb-8 hover:bg-black hover:text-white px-3 py-1 border-4 border-transparent hover:border-black transition-all">
            <ArrowLeft size={24} /> Return to Grid
          </Link>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            System <br /> <span className="bg-black text-white px-4 inline-block mt-2 transform -skew-x-2">Specs</span>
          </h1>
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
                Studying business gave me a solid grounding in logic and problem-solving,<br /> which helps me understand what a product needs to do before writing a single line of code.
              </p>
            </div>
          </section>

          <section className="brutalist-container flex flex-col">
            <div className="flex items-center gap-4 border-b-4 border-black pb-4 mb-6">
              <Award size={40} />
              <h2 className="text-4xl font-black uppercase">Clearances</h2>
            </div>

            <div className="flex flex-col gap-6">
              <div className="border-l-8 border-black pl-4">
                <h3 className="text-2xl font-black uppercase">MERN Stack & AI</h3>
                <p className="text-lg font-bold text-zinc-500 uppercase">ITI</p>
              </div>
              <div className="border-l-8 border-black pl-4">
                <h3 className="text-2xl font-black uppercase">CS50x</h3>
                <p className="text-lg font-bold text-zinc-500 uppercase">Harvard University / edX</p>
              </div>
              <div className="border-l-8 border-black pl-4">
                <h3 className="text-2xl font-black uppercase">Database Fundamentals</h3>
                <p className="text-lg font-bold text-zinc-500 uppercase">egFWD</p>
              </div>
            </div>
          </section>

        </div>

        {/* --- TECHNICAL ARSENAL --- */}
        <section className="animate-slide-up-delay-2">
          <div className="inline-block bg-black text-white px-6 py-2 mb-8 transform -skew-x-2">
            <h2 className="text-4xl font-black uppercase tracking-widest">Technical Arsenal</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {stack.map((category, index) => (
              <div
                key={index}
                className="brutalist-container group hover:!bg-black hover:!text-white transition-colors duration-300"
              >
                <div className="flex flex-col items-start gap-4 border-b-4 border-black group-hover:border-white pb-4 mb-6 transition-colors duration-300">
                  <div className="p-3 border-4 border-black text-black group-hover:border-white group-hover:bg-white group-hover:!text-black transition-colors duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-black uppercase leading-none">{category.category}</h3>
                </div>

                <ul className="flex flex-col gap-3">
                  {category.tech.map((item, i) => (
                    <li key={i} className="text-lg font-bold uppercase flex items-center gap-2">
                      <span className="w-2 h-2 bg-black group-hover:bg-white inline-block transition-colors duration-300"></span>
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