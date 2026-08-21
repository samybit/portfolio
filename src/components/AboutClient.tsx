"use client";

import { ArrowLeft, ArrowRight, LayoutTemplate, Database, Server, Wrench, ExternalLink, Workflow, Compass, PenTool, Cpu, Cloud, FlaskConical, GitBranch, Brain, Bot } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import AudioPlayer from "@/components/AudioPlayer";
import DecryptText from "@/components/DecryptText";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";
import Footer from "@/components/Footer";
import CarouselSection from "@/components/ui/CarouselSection";
import { AnimatedTimeline } from "@/components/animata/progress/animatedtimeline";
import { MorphingText } from "@/components/ui/morphing-text";
import RippleButton from "@/components/lightswind/ripple-button";
import { getAboutImageIndex } from "@/utils/aboutImage";

function EducationIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    >
      <rect width="256" height="256" fill="none" stroke="none" />
      <line x1="32" y1="64" x2="32" y2="144" />
      <path d="M56,216c15.7-24.08,41.11-40,72-40s56.3,15.92,72,40" />
      <polygon points="224 64 128 96 32 64 128 32 224 64" />
      <path d="M169.34,82.22a56,56,0,1,1-82.68,0" />
    </svg>
  );
}

function ClearancesIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    >
      <rect width="256" height="256" fill="none" stroke="none" />
      <line x1="72" y1="136" x2="120" y2="136" />
      <line x1="72" y1="104" x2="120" y2="104" />
      <circle cx="196" cy="124" r="44" />
      <path d="M168,192H40a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8V90.06" />
      <polyline points="168 157.94 168 224 196 208 224 224 224 157.94" />
    </svg>
  );
}

function CategoryIconMorph({
  icon: DefaultIcon,
  hoverIcon: HoverIcon,
  isHovered,
  isNeumorphic
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  hoverIcon: React.ComponentType<{ size?: number; className?: string }>;
  isHovered: boolean;
  isNeumorphic: boolean;
}) {
  return (
    <div
      className={`relative w-9 h-9 flex items-center justify-center p-1.5 border-2 transition-all duration-300 ${
        isNeumorphic
          ? "border-transparent text-black rounded-lg shadow-[inset_2px_2px_5px_rgba(163,177,198,0.5),_inset_-2px_-2px_5px_rgba(255,255,255,0.7)]"
          : "border-white text-white bg-white/10"
      }`}
    >
      {/* Default Icon */}
      <div
        className={`transition-all duration-300 transform ${
          isHovered
            ? "opacity-0 scale-50 rotate-90 pointer-events-none absolute"
            : "opacity-100 scale-100 rotate-0"
        }`}
      >
        <DefaultIcon size={22} />
      </div>

      {/* Hover Morph Icon */}
      <div
        className={`transition-all duration-300 transform ${
          isHovered
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-50 -rotate-90 pointer-events-none absolute"
        }`}
      >
        <HoverIcon size={22} />
      </div>
    </div>
  );
}

interface SkillItemMeta {
  name: string;
  role: string;
  color: string;
  iconUrl: string;
  url: string;
}

function SkillKeycap({ item, isNeumorphic }: { item: SkillItemMeta; isNeumorphic: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group/keycap relative w-full h-9.5 rounded-none cursor-pointer transition-all duration-200 select-none overflow-hidden block ${
        isNeumorphic
          ? isHovered
            ? "bg-[#d1d9e6] text-[#1e293b]"
            : "bg-[#e0e5ec] text-black"
          : isHovered
            ? "border-2 border-white bg-white text-black"
            : "border-2 border-white/80 bg-zinc-950 text-white"
      }`}
      title={`${item.name} // ${item.role}`}
      aria-label={`${item.name} documentation (opens in a new tab)`}
    >
      <div className="w-full h-full flex items-center justify-between px-2 sm:px-2.5 relative">
        {/* Left: Brand Color Dot Indicator */}
        <span
          className="w-2 h-2 rounded-full shrink-0 shadow-sm"
          style={{ backgroundColor: item.color }}
        />

        {/* Center Content: Name vs Role Swap */}
        <div className="flex-1 min-w-0 mx-1.5 relative h-full flex items-center justify-center overflow-hidden">
          <span
            className={`font-mono font-black uppercase transition-all duration-200 transform whitespace-nowrap ${
              item.name.length > 15
                ? "text-[10.5px] sm:text-[11.5px] tracking-tighter"
                : item.name.length > 12
                ? "text-[11px] sm:text-[12px] tracking-tight"
                : "text-xs sm:text-[12.5px] tracking-tight"
            } ${
              isHovered
                ? "opacity-0 -translate-y-4 pointer-events-none"
                : "opacity-100 translate-y-0"
            }`}
          >
            {item.name}
          </span>

          <span
            className={`absolute font-mono font-bold text-[9px] sm:text-[9.5px] uppercase tracking-tight transition-all duration-200 transform whitespace-nowrap px-0.5 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            {item.role}
          </span>
        </div>

        {/* Right: Authentic Brand Vector Logo */}
        {!imgError ? (
          <Image
            src={item.iconUrl}
            alt={item.name}
            width={16}
            height={16}
            onError={() => setImgError(true)}
            className="w-4 h-4 shrink-0 object-contain"
            style={{
              filter: isHovered && !isNeumorphic ? "invert(1) brightness(0)" : "none"
            }}
          />
        ) : (
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: item.color }}
          />
        )}
      </div>
    </a>
  );
}

export default function AboutClient({ dict, footerDict, locale }: { dict: Record<string, string>, footerDict: Record<string, string>, tabTitles?: Record<string, string>, locale: string }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSummaryCardHovered, setIsSummaryCardHovered] = useState(false);
  const [isSkillsCardHovered, setIsSkillsCardHovered] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const isNeumorphic = useNeumorphicTheme();
  const [imageIndex, setImageIndex] = useState(() => getAboutImageIndex());

  useEffect(() => {
    const handleCycle = () => {
      setImageIndex(getAboutImageIndex());
    };

    window.addEventListener("cycle-about-image", handleCycle);
    return () => {
      window.removeEventListener("cycle-about-image", handleCycle);
    };
  }, []);

  // --- FRAMER MOTION CLIP-PATH SETUP ---
  const { scrollY } = useScroll();

  // Dynamic values to adjust scroll speed on mobile vs desktop
  const clipStartScroll = useMotionValue(0);
  const clipEndScroll = useMotionValue(315);
  const parallaxEndScroll = useMotionValue(600);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Mobile: Delay the start of the reveal until the user scrolls down,
        // so it happens on the last part of the area
        clipStartScroll.set(700); 
        clipEndScroll.set(1200);
        parallaxEndScroll.set(1200);
      } else {
        // Desktop: Start immediately, fast effect
        clipStartScroll.set(0);
        clipEndScroll.set(315);
        parallaxEndScroll.set(600);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clipStartScroll, clipEndScroll, parallaxEndScroll]);

  // Helper to calculate progress between start and end
  const getProgress = (y: number, start: number, end: number) => {
    const range = end - start;
    if (range <= 0) return 0;
    return Math.min(Math.max((y - start) / range, 0), 1);
  };

  // 1. Animates the parallax clipping mask for the image (from bottom up).
  const imageBottomInset = useTransform(scrollY, (y) => {
    return getProgress(y, clipStartScroll.get(), clipEndScroll.get()) * 115;
  });
  const clipPathImage = useTransform(imageBottomInset, (val) => `inset(0% 0% ${val}% 0%)`);

  // 2. Animates the exact inverse clipping mask for the backdrop-filter!
  const filterTopInset = useTransform(scrollY, (y) => {
    const progress = getProgress(y, clipStartScroll.get(), clipEndScroll.get());
    return 100 - (progress * 115);
  });
  const clipPathFilter = useTransform(filterTopInset, (val) => `inset(${val}% 0% 0% 0%)`);

  // 3. Parallax effect specifically for the background image inside the mask.
  const imageY = useTransform(scrollY, (y) => {
    // Parallax can start from 0 for a continuous smooth background scroll
    const progress = getProgress(y, 0, parallaxEndScroll.get());
    return progress * -40;
  });

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  // Fix the refresh scroll-creep
  useEffect(() => {
    // Tell the browser to turn off its automatic scroll memory
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
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
      icon: LayoutTemplate,
      hoverIcon: PenTool,
      items: [
        { name: "Next.js", role: "SSR & App Router", color: "#ffffff", iconUrl: "/skills/nextjs.svg", url: "https://nextjs.org/docs" },
        { name: "React", role: "UI Components", color: "#61dafb", iconUrl: "/skills/react.svg", url: "https://react.dev" },
        { name: "Angular", role: "Enterprise SPA", color: "#dd0031", iconUrl: "/skills/angular.svg", url: "https://angular.dev" },
        { name: "TypeScript", role: "Typed JavaScript", color: "#3178c6", iconUrl: "/skills/typescript.svg", url: "https://www.typescriptlang.org/docs/" },
        { name: "Tailwind CSS", role: "Utility Design Tokens", color: "#38bdf8", iconUrl: "/skills/tailwindcss.svg", url: "https://tailwindcss.com/docs" },
      ]
    },
    {
      category: "Backend & Database",
      icon: Database,
      hoverIcon: Cpu,
      items: [
        { name: "Java", role: "Enterprise OOP", color: "#f8981d", iconUrl: "/skills/java.svg", url: "https://docs.oracle.com/en/java/" },
        { name: "Spring", role: "Backend Framework", color: "#6db33f", iconUrl: "/skills/spring.svg", url: "https://spring.io/docs" },
        { name: "NestJS", role: "Modular Backend API", color: "#e0234e", iconUrl: "/skills/nestjs.svg", url: "https://docs.nestjs.com/" },
        { name: "Express.js", role: "REST Middleware", color: "#a0a0a0", iconUrl: "/skills/express.svg", url: "https://expressjs.com/" },
        { name: "Python", role: "Core Data & Scripting", color: "#3776ab", iconUrl: "/skills/python.svg", url: "https://docs.python.org/3/" },
        { name: "Flask", role: "Micro Services", color: "#ffffff", iconUrl: "/skills/flask.svg", url: "https://flask.palletsprojects.com/" },
        { name: "Postgres", role: "ACID Relational SQL", color: "#336791", iconUrl: "/skills/postgresql.svg", url: "https://www.postgresql.org/docs/" },
        { name: "MongoDB", role: "NoSQL Document DB", color: "#47a248", iconUrl: "/skills/mongodb.svg", url: "https://www.mongodb.com/docs/" },
      ]
    },
    {
      category: "Architecture & DevOps",
      icon: Server,
      hoverIcon: Cloud,
      items: [
        { name: "Docker", role: "Containerization", color: "#2496ed", iconUrl: "/skills/docker.svg", url: "https://docs.docker.com/" },
        { name: "Kubernetes", role: "Cluster Orchestration", color: "#326ce5", iconUrl: "/skills/kubernetes.svg", url: "https://kubernetes.io/docs/" },
        { name: "Jenkins", role: "CI/CD Automation", color: "#d24939", iconUrl: "/skills/jenkins.svg", url: "https://www.jenkins.io/doc/" },
        { name: "Linux OS", role: "Server Kernel", color: "#fcc624", iconUrl: "/skills/linux.svg", url: "https://docs.kernel.org/" },
        { name: "Nexus Repo", role: "Artifact Registry", color: "#1c77c3", iconUrl: "/skills/nexus.svg", url: "https://help.sonatype.com/en/nexus-repository.html" },
      ]
    },
    {
      category: "API & Testing",
      icon: Wrench,
      hoverIcon: FlaskConical,
      items: [
        { name: "Postman", role: "API Testing Suite", color: "#ff6c37", iconUrl: "/skills/postman.svg", url: "https://learning.postman.com/docs/" },
        { name: "Jest", role: "Unit Testing", color: "#9A425B", iconUrl: "/skills/jest.svg", url: "https://jestjs.io/docs/getting-started" },
        { name: "Selenium", role: "E2E Automation", color: "#43b02a", iconUrl: "/skills/selenium.svg", url: "https://www.selenium.dev/documentation/" },
        { name: "BeautifulSoup", role: "Web Scraping Engine", color: "#ffd43b", iconUrl: "/skills/beautifulsoup.svg", url: "https://www.crummy.com/software/BeautifulSoup/bs4/doc/" },
        { name: "REST APIs", role: "HTTP API Standard", color: "#009688", iconUrl: "/skills/fastapi.svg", url: "https://restfulapi.net/" },
        { name: "GraphQL", role: "Data Query Language", color: "#e535ab", iconUrl: "/skills/graphql.svg", url: "https://graphql.org/learn/" },
      ]
    },
    {
      category: "Agile & Collab",
      icon: Workflow,
      hoverIcon: GitBranch,
      items: [
        { name: "Git", role: "Version Control", color: "#f05032", iconUrl: "/skills/git.svg", url: "https://git-scm.com/doc" },
        { name: "Jira", role: "Agile Tracking", color: "#0052cc", iconUrl: "/skills/jira.svg", url: "https://support.atlassian.com/jira-software-cloud/" },
        { name: "Trello", role: "Kanban Board", color: "#0079bf", iconUrl: "/skills/trello.svg", url: "https://support.atlassian.com/trello/" },
        { name: "Notion", role: "Docs & Knowledge", color: "#ffffff", iconUrl: "/skills/notion.svg", url: "https://www.notion.so/help" },
        { name: "Slack", role: "Team Comms", color: "#e01e5a", iconUrl: "/skills/slack.svg", url: "https://api.slack.com/" },
      ]
    },
    {
      category: "AI & Engineering",
      icon: Brain,
      hoverIcon: Bot,
      items: [
        { name: "RAG Pipelines", role: "Vector Retrieval & Context", color: "#10a37f", iconUrl: "/skills/rag.svg", url: "https://python.langchain.com/docs/concepts/rag/" },
        { name: "LLM Fine-Tuning", role: "Model Optimization & LoRA", color: "#8b5cf6", iconUrl: "/skills/llm.svg", url: "https://huggingface.co/docs/transformers/training" },
        { name: "Prompt Engineering", role: "System Prompts & In-Context", color: "#f59e0b", iconUrl: "/skills/prompting.svg", url: "https://www.promptingguide.ai/" },
      ]
    },
  ];

  const timelineStyles = {
    lineColor: isNeumorphic ? "#a3b1c6" : "#d1d5db",
    activeLineColor: isNeumorphic ? "#1e293b" : "#000000",
    dotColor: isNeumorphic ? "#a3b1c6" : "#d1d5db",
    activeDotColor: isNeumorphic ? "#1e293b" : "#000000",
    dotSize: "1rem",
    titleColor: "inherit",
    activeTitleColor: "inherit",
    descriptionColor: "inherit",
    dateColor: "inherit",
  };



  const topContent = (
    <>
      {/* --- HEADER --- */}
      <div className="animate-slide-up max-w-7xl mx-auto mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-12 md:gap-6">
        {/* LEFT SIDE: Title & Back Button */}
        <div>
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-xl font-bold uppercase mb-6 bg-white text-black hover:bg-black hover:text-white px-3 py-1 border-4 border-transparent hover:border-black transition-all">
            {locale === 'ar' ? <ArrowRight size={24} /> : <ArrowLeft size={24} />} {dict?.returnGrid || "Return to Grid"}
          </Link>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none flex flex-wrap items-baseline gap-4 text-white">
            <DecryptText text={dict?.about || "About"} />
            <span className="relative inline-block align-baseline transform -skew-x-2">
              {/* Bottom Layer: Solid white text, unclipped, overflows naturally as white text against dark page bg */}
              <span className="absolute inset-0 text-white px-4 z-0 pointer-events-none flex items-center" aria-hidden="true">
                <DecryptText text={dict?.me || "me"} />
              </span>

              {/* Top Layer: White bg, black text, clipped to padding box */}
              <span className="absolute inset-0 bg-white text-black px-4 z-10 overflow-hidden flex items-center">
                <DecryptText text={dict?.me || "me"} />
              </span>

              {/* Structural Layer: Invisible, sets wrapper dimensions */}
              <span className="relative invisible px-4 z-[-1] pointer-events-none flex items-center" aria-hidden="true">
                <DecryptText text={dict?.me || "me"} />
              </span>
            </span>
          </h1>
        </div>

        {/* RIGHT SIDE: The Music Player */}
        <div className="w-full md:w-auto shrink-0 relative z-10">
          <AudioPlayer dict={dict} />
        </div>
      </div>

      {/* Sized naturally to the content to end right below the cards */}
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10 relative z-10">

        {/* --- EDUCATION & CERTS ROW --- */}
        <div className="animate-slide-up-delay-1 grid grid-cols-1 lg:grid-cols-2 gap-12">

          <section className={`brutalist-container flex flex-col justify-between static-card-container ${
            isNeumorphic
              ? ""
              : "!bg-black !text-white brutalist-container-dark"
          }`}>
            <div>
              <div className={`flex items-center gap-4 border-b-4 pb-4 mb-6 transition-all duration-300 ${
                isNeumorphic ? "border-[#a3b1c6]" : "border-white"
              }`}>
                <EducationIcon size={40} />
                <h2 className="text-4xl font-black uppercase">{dict?.education || "Education"}</h2>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <Image
                  src="/about/ainshams.png"
                  alt={dict?.eduSchool || "Ain Shams University"}
                  width={36}
                  height={36}
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0"
                  priority
                />
                <h3 className="text-3xl font-bold uppercase leading-tight">{dict?.eduSchool || "Ain Shams University"}</h3>
              </div>
              <p className={`text-xl font-bold mb-6 uppercase transition-all duration-300 ${
                isNeumorphic ? "text-zinc-500" : "text-zinc-400"
              }`}>{dict?.eduDegree || "Bachelor of Commerce (B.B.A.) // 2019 - 2023"}</p>
              <p className="text-lg md:text-xl font-medium leading-relaxed">
                {dict?.eduDesc || "Specialized in accounting and project management, which strengthened my problem-solving skills and gave me a solid understanding of real-world product needs."}
              </p>
            </div>
          </section>

          <section className={`brutalist-container flex flex-col text-black overflow-hidden ${
            isNeumorphic ? "" : "brutalist-shadow-dark"
          }`}>
            <div className={`flex items-center gap-4 border-b-4 pb-3 mb-4 transition-all duration-300 ${
              isNeumorphic ? "border-[#a3b1c6]" : "border-black"
            }`}>
              <ClearancesIcon size={40} />
              <h2 className="text-4xl font-black uppercase">{dict?.clearances || "Clearances"}</h2>
            </div>

            <AnimatedTimeline
              events={[{ id: "1", title: "" }, { id: "2", title: "" }, { id: "3", title: "" }]}
              styles={timelineStyles}
              className="py-0 my-0"
              reverseDirection={true}
              customEventRender={(event) => {
                if (event.id === "1") {
                  return (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        showToast(dict?.notOnline || "MERN Stack certificate is not online yet.");
                      }}
                      className={`group block border-s-8 ps-4 pe-3 py-1.5 transition-all cursor-pointer w-full text-left rtl:text-right ${
                        isNeumorphic
                          ? "border-[#a3b1c6] hover:bg-[#d1d9e6] hover:text-[#1e293b] active:bg-[#d1d9e6] active:text-[#1e293b]"
                          : "border-black hover:bg-black hover:text-white active:bg-black active:text-white"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full min-w-0">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-2xl font-black uppercase leading-tight">{dict?.mernStack || "MERN Stack & Gen AI"}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 group-active:text-zinc-300 uppercase leading-none whitespace-nowrap">ITI (MCIT)</p>
                            <span className="text-lg font-bold text-zinc-600 group-hover:text-zinc-400 group-active:text-zinc-400 transition-colors leading-none whitespace-nowrap">
                              {"// 2026"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                }
                if (event.id === "2") {
                  return (
                    <a
                      href="https://cs50.harvard.edu/certificates/09d4b4ad-f9dd-4cf3-a1dc-7385742119f9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group block border-s-8 ps-4 pe-3 py-1.5 transition-all cursor-pointer w-full text-left rtl:text-right ${
                        isNeumorphic
                          ? "border-[#a3b1c6] hover:bg-[#d1d9e6] hover:text-[#1e293b] active:bg-[#d1d9e6] active:text-[#1e293b]"
                          : "border-black hover:bg-black hover:text-white active:bg-black active:text-white"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full min-w-0">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-2xl font-black uppercase leading-tight">{dict?.cs50 || "CS50x"}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 group-active:text-zinc-300 uppercase leading-none whitespace-nowrap">edX (Harvard)</p>
                            <span className="text-lg font-bold text-zinc-600 group-hover:text-zinc-400 group-active:text-zinc-400 transition-colors leading-none whitespace-nowrap">
                              {"// 2025"}
                            </span>
                          </div>
                        </div>
                        <ExternalLink size={24} className="opacity-0 group-hover:opacity-100 group-active:opacity-100 rtl:translate-x-4 ltr:-translate-x-4 group-hover:translate-x-0 group-active:translate-x-0 transition-all duration-300 ms-3 me-1 shrink-0" />
                        <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
                      </div>
                    </a>
                  );
                }
                if (event.id === "3") {
                  return (
                    <a
                      href="https://i.ibb.co/ynPJ6szk/FWD-data-Certificate.png"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group block border-s-8 ps-4 pe-3 py-1.5 transition-all cursor-pointer w-full text-left rtl:text-right ${
                        isNeumorphic
                          ? "border-[#a3b1c6] hover:bg-[#d1d9e6] hover:text-[#1e293b] active:bg-[#d1d9e6] active:text-[#1e293b]"
                          : "border-black hover:bg-black hover:text-white active:bg-black active:text-white"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full min-w-0">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-2xl font-black uppercase leading-tight">{dict?.dataAnalysis || "Data Analysis"}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 group-active:text-zinc-300 uppercase leading-none whitespace-nowrap">Egypt FWD (MCIT)</p>
                            <span className="text-lg font-bold text-zinc-600 group-hover:text-zinc-400 group-active:text-zinc-400 transition-colors leading-none whitespace-nowrap">
                              {"// 2021"}
                            </span>
                          </div>
                        </div>
                        <ExternalLink size={24} className="opacity-0 group-hover:opacity-100 group-active:opacity-100 rtl:translate-x-4 ltr:-translate-x-4 group-hover:translate-x-0 group-active:translate-x-0 transition-all duration-300 ms-3 me-1 shrink-0" />
                        <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
                      </div>
                    </a>
                  );
                }
                return null;
              }}
            />
          </section>

        </div>
      </div>
    </>
  );

  const section1 = (
      <div className={`relative w-full ${isNeumorphic ? 'bg-[#e0e5ec]' : 'bg-white'}`}>

        {/* Inline SVG filter defs for the glass overlay */}
        <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
          <defs>
            <filter id="about-glass-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.12 0.12" numOctaves="1" result="warp" />
              <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="15" in="SourceGraphic" in2="warp" />
            </filter>
          </defs>
        </svg>

        {/* Layer 1: Parallax image with clip-path */}
        <motion.div
          style={{ clipPath: clipPathImage }}
          className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
        >
          <motion.img
            style={{ y: imageY }}
            src={`/about-${imageIndex}.jpg`}
            alt=""
            className="absolute -top-[5%] h-[110%] left-0 w-full object-cover object-center"
          />
          <div className="absolute -top-[5%] h-[110%] left-0 bg-black/30 w-full"></div>
        </motion.div>

        {/* Layer 2: Content */}
        <div className="relative z-10 px-6 md:px-12 lg:px-24 pt-36 md:pt-30 pb-6">
          {topContent}
        </div>

        {/* Layer 3: Inverted color filter overlay + Full-height glass distortion.
             It uses clipPathFilter to grow from the bottom as you scroll. */}
        <motion.div
          style={{ 
            clipPath: clipPathFilter,
            backdropFilter: 'invert(1) hue-rotate(180deg)'
          }}
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none about-glass-overlay"
          aria-hidden="true"
        />
      </div>
  );


  const section2 = (
      <div className="relative w-full">
        {/* --- STAGE 1: SIMPLE PROGRESSIVE DRAWING (SINGLE WAVE) --- */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 1440 800" fill="none" aria-hidden="true">
          <path 
            d="M -100,400 Q 360,200 720,400 T 1540,400" 
            stroke={isNeumorphic ? "rgba(0, 0, 0, 0.18)" : "rgba(255, 255, 255, 0.22)"} 
            strokeWidth="3" 
            strokeLinecap="round"
          />
        </svg>
        <div className="w-full relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <section className="animate-slide-up-delay-2">
            <div className="inline-block bg-black text-white px-6 py-2 mb-8 transform -skew-x-2">
              <MorphingText 
                texts={[dict?.whoIAm || "Who I Am", dict?.summary || "Summary"]}
                className="text-4xl font-black uppercase tracking-widest text-white m-0 p-0"
                forceHover={isSummaryCardHovered}
              />
            </div>

            <div 
              onMouseEnter={() => setIsSummaryCardHovered(true)}
              onMouseLeave={() => setIsSummaryCardHovered(false)}
              className={`p-8 md:p-10 transition-all duration-300 hover:!transform-none ${
                isNeumorphic 
                  ? "brutalist-container bg-white text-black static-card-container" 
                  : "brutalist-container-dark !shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]"
              }`}>
              <div className="flex flex-col gap-6 text-lg md:text-xl font-medium leading-relaxed">
                <p>
                  {(() => {
                    const text = dict?.bioP1 || "My journey began with Python automation and scripting, building tools to scrape data and automate tasks. I then expanded into full-stack development, mastering the MERN stack to engineer dynamic applications.";
                    const first = text.charAt(0);
                    const rest = text.slice(1);
                    return (
                      <>
                        <span
                          className="drop-cap-first select-none"
                          aria-hidden="true"
                          style={{ color: isNeumorphic ? "#111" : "#fff" }}
                        >
                          {first}
                        </span>
                        <span className="sr-only">{first}</span>
                        {rest}
                      </>
                    );
                  })()}
                </p>
                <p style={{ clear: "both" }}>
                  {dict?.bioP2 || "Today, I focus on building complete, containerized applications using Docker, ensuring that what runs on my machine runs everywhere."}
                </p>
                <p>
                  {dict?.bioP3 || "When I'm not coding, you can find me exploring retro tech, playing classic games, or experimenting with 3D web graphics."}
                </p>
              </div>

            </div>
          </section>
        </div>
      </div>
  );

  const section3 = (
      <div className="relative w-full py-6 md:py-8">
        {/* --- STAGE 2: STRUCTURED PROGRESSIVE DRAWING (DOUBLE WAVES) --- */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 1440 800" fill="none" aria-hidden="true">
          <path 
            d="M -100,300 C 300,100 600,600 1000,200 T 1540,500" 
            stroke={isNeumorphic ? "rgba(0, 0, 0, 0.16)" : "rgba(255, 255, 255, 0.20)"} 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          <path 
            d="M -100,500 C 400,700 700,200 1100,600 T 1540,300" 
            stroke={isNeumorphic ? "rgba(0, 0, 0, 0.10)" : "rgba(255, 255, 255, 0.12)"} 
            strokeWidth="2" 
            strokeDasharray="8,8"
            strokeLinecap="round"
          />
        </svg>
        <div className="w-full relative z-10 max-w-[85rem] mx-auto px-4 sm:px-6 md:px-8 py-4">
          <section className="animate-slide-up-delay-2">
            <div className="inline-block bg-black text-white px-5 py-1.5 mb-6 transform -skew-x-2">
              <MorphingText 
                texts={[dict?.techArsenal || "Technical Arsenal", dict?.skills || "Skills"]}
                className="text-3xl md:text-4xl font-black uppercase tracking-widest text-white m-0 p-0"
                forceHover={isSkillsCardHovered}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" dir="ltr">
              {stack.map((category, index) => (
                <div
                  key={index}
                  onMouseEnter={() => {
                    setIsSkillsCardHovered(true);
                    setHoveredCardIndex(index);
                  }}
                  onMouseLeave={() => {
                    setIsSkillsCardHovered(false);
                    setHoveredCardIndex(null);
                  }}
                  className={`group transition-all duration-300 flex flex-col justify-between p-3.5 sm:p-4 ${
                    isNeumorphic
                      ? "brutalist-container hover:!bg-[#d1d9e6] hover:!text-[#1e293b] hover:!translate-x-1 hover:!translate-y-1 hover:!shadow-none"
                      : "brutalist-container-dark hover:!translate-x-1 hover:!translate-y-1 hover:!shadow-none"
                  }`}
                >
                  <div>
                    <div className={`flex items-center gap-3 border-b-2 pb-2.5 mb-3 transition-all duration-300 ${
                      isNeumorphic ? "border-[#a3b1c6]" : "border-white/30"
                    }`}>
                      <CategoryIconMorph
                        icon={category.icon}
                        hoverIcon={category.hoverIcon}
                        isHovered={hoveredCardIndex === index}
                        isNeumorphic={isNeumorphic}
                      />
                      <h3 className="text-sm sm:text-base font-black uppercase tracking-tight leading-tight">
                        {category.category}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {category.items.map((item, i) => {
                        const isAllFullWidth = category.category === "AI & Engineering";
                        const isLastOddItem = category.items.length % 2 !== 0 && i === category.items.length - 1;
                        return (
                          <div key={i} className={isAllFullWidth || isLastOddItem ? "sm:col-span-2" : ""}>
                            <SkillKeycap item={item} isNeumorphic={isNeumorphic} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
  );

  const section4 = (
      <div className="relative w-full flex flex-col justify-between transition-colors duration-300">
        {/* --- STAGE 3: DETAILED GEOMETRIC CLIMAX DRAWING (MULTIPLE INTERSECTING WAVES) --- */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 1440 800" fill="none" aria-hidden="true">
          {/* Wave 1 */}
          <path 
            d="M -100,200 C 300,600 500,-100 900,500 T 1540,100" 
            stroke={isNeumorphic ? "rgba(0, 0, 0, 0.20)" : "rgba(255, 255, 255, 0.24)"} 
            strokeWidth="4" 
            strokeLinecap="round"
          />
          {/* Wave 2 */}
          <path 
            d="M -100,600 C 200,100 700,800 1000,300 T 1540,700" 
            stroke={isNeumorphic ? "rgba(0, 0, 0, 0.14)" : "rgba(255, 255, 255, 0.16)"} 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          {/* Wave 3 - Dashed structure */}
          <path 
            d="M -100,400 C 400,300 600,600 1100,200 T 1540,400" 
            stroke={isNeumorphic ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.10)"} 
            strokeWidth="2" 
            strokeDasharray="6,6"
            strokeLinecap="round"
          />
          {/* Wave 4 - High-frequency sine wave overlay */}
          <path 
            d="M -100,450 Q 100,350 300,450 T 700,450 T 1100,450 T 1540,450" 
            stroke={isNeumorphic ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.08)"} 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
        </svg>
        <div className="w-full relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex-grow flex flex-col justify-center py-12">
          <div className="animate-slide-up-delay-2 w-full">
            <section className={`p-8 md:p-10 transition-all duration-300 ${
              isNeumorphic
                ? "brutalist-container hover:!translate-x-1 hover:!translate-y-1 hover:!shadow-none"
                : "brutalist-container-dark hover:!translate-x-1 hover:!translate-y-1 hover:!shadow-none"
            }`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col text-center md:text-left rtl:md:text-right">
                <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight">{dict?.legacySys || "Legacy Systems"}</h2>
                 <p className={`text-lg md:text-xl font-bold uppercase mt-1 ${isNeumorphic ? "text-zinc-500" : "text-zinc-400"}`}>{dict?.legacyDesc || "Explore previous portfolio iterations"}</p>
              </div>
              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-6 shrink-0">
                <RippleButton
                  href="https://my-portfolio-seven-beta-98.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-xl font-black uppercase whitespace-nowrap transition-all duration-300 group ${
                    isNeumorphic
                      ? "bg-[#e0e5ec] text-[#4b5563] rounded-xl shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                      : "bg-transparent text-white border-4 border-white shadow-[8px_8px_0px_rgba(255,255,255,0.3)] hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
                  }`}
                >
                  {dict?.v1 || "Version 1.0"}
                  <Compass className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[360deg] shrink-0" />
                  <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
                </RippleButton>
                <RippleButton
                  href="https://samybit.github.io/brutalist-portfolio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-xl font-black uppercase whitespace-nowrap transition-all duration-300 group ${
                    isNeumorphic
                      ? "bg-[#e0e5ec] text-[#4b5563] rounded-xl shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                      : "bg-transparent text-white border-4 border-white shadow-[8px_8px_0px_rgba(255,255,255,0.3)] hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
                  }`}
                >
                  {dict?.v2 || "Version 2.0"}
                  <Compass className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[360deg] shrink-0" />
                  <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
                </RippleButton>
              </div>
            </div>
            </section>
          </div>
        </div>
      </div>
  );

  const toastOverlay = toastMessage ? (
    <div
      id="toast-notification"
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 p-4 border-4 border-black bg-white text-black font-black uppercase text-sm flex items-center justify-between animate-slide-up min-w-[280px] sm:min-w-[350px] overflow-hidden ${
        isNeumorphic ? "shadow-[8px_8px_0px_0px_#000000]" : "shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]"
      }`}
    >
      <span className="relative z-10">{toastMessage}</span>
      <button
        onClick={() => setToastMessage(null)}
        className="font-black text-xl hover:text-zinc-600 transition-colors ms-6 cursor-pointer relative z-10"
      >
        ×
      </button>
      <motion.div 
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
        className={`absolute bottom-0 ${locale === 'ar' ? 'right-0' : 'left-0'} h-[6px] bg-black`}
      />
    </div>
  ) : null;

  return (
    <main className={`min-h-screen flex flex-col overflow-x-hidden transition-colors duration-300 ${
      isNeumorphic ? "bg-[#e0e5ec]" : "bg-black text-white"
    }`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex-grow flex flex-col">
        {section1}
        <div className="w-full flex flex-col gap-16 mt-8 mb-24 relative z-10">
          {section2}
          {section3}
          {section4}
        </div>
      </div>
      <CarouselSection footer={<Footer dict={footerDict} overlay={true} />} />
      {toastOverlay}
    </main>
  );
}