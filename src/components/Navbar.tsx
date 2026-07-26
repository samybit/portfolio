"use client";

import { playClack, playTick, playLanguageToggle, prewarmAudio } from "@/utils/audio";
import { Origami, ArrowUpRight, ArrowUpLeft, Menu, X, Palette, Globe, Linkedin } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Smoke from "@/components/Smoke";
import { CustomTooltip } from "@/components/ui/tooltip";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { StaggeredMenu } from "@/components/StaggeredMenu";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/animate-ui/components/radix/hover-card";
import { cycleAboutImage } from "@/utils/aboutImage";

export default function Navbar({ dict, currentLocale }: { dict: Record<string, string>, currentLocale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText("samyb.samir@gmail.com");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };
  const [activeHash, setActiveHash] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isVisibleRef = useRef(true);
  const activeHashRef = useRef("");
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // ── Background Idle Image Pre-caching for /about Assets ──
  useEffect(() => {
    if (typeof window === "undefined") return;

    const triggerPrecacheImages = () => {
      // Pre-cache all 4 About page background images into browser cache
      for (let i = 1; i <= 4; i++) {
        const img = new window.Image();
        img.src = `/about-${i}.jpg`;
      }
    };

    let idleId: number | null = null;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    // Wait 2200ms after mount (ensuring initial hero animations & preloader finish)
    timerId = setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idleId = (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(() => {
          triggerPrecacheImages();
        });
      } else {
        triggerPrecacheImages();
      }
    }, 2200);

    return () => {
      if (timerId) clearTimeout(timerId);
      if (idleId && "cancelIdleCallback" in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
    };
  }, []);

  const isHome = pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;

  useEffect(() => {
    const updateScroll = () => {
      const currentScrollY = window.scrollY;

      // If mobile menu is open, keep navbar visible
      if (isOpen) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
        ticking.current = false;
        return;
      }

      // Always show navbar at top of page (<= 80px)
      if (currentScrollY <= 80) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
      }
      // Hide if scrolling down past 80px
      else if (currentScrollY > lastScrollY.current) {
        if (isVisibleRef.current) {
          isVisibleRef.current = false;
          setIsVisible(false);
        }
      }
      // Show if scrolling up
      else if (currentScrollY < lastScrollY.current) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  useEffect(() => {
    if (!isHome) {
      if (activeHashRef.current !== "") {
        activeHashRef.current = "";
        requestAnimationFrame(() => setActiveHash(""));
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;

            if (id === 'hero') {
              if (activeHashRef.current !== "") {
                activeHashRef.current = "";
                setActiveHash("");
              }
              window.history.replaceState(null, '', `/${currentLocale}`);
            }
            else if (id === 'projects' || id === 'contact') {
              const newHash = `#${id}`;
              if (activeHashRef.current !== newHash) {
                activeHashRef.current = newHash;
                setActiveHash(newHash);
              }
              window.history.replaceState(null, '', `/${currentLocale}${newHash}`);
            }
          }
        });
      },
      { rootMargin: "-20% 0px -40% 0px" }
    );

    const hero = document.getElementById("hero");
    const projects = document.getElementById("projects");
    const contact = document.getElementById("contact");

    if (hero) observer.observe(hero);
    if (projects) observer.observe(projects);
    if (contact) observer.observe(contact);

    return () => observer.disconnect();
  }, [pathname, isHome, currentLocale]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Ignore if clicking inside nav
      if (navRef.current && navRef.current.contains(event.target as Node)) {
        return;
      }

      // Ignore if clicking inside StaggeredMenu panel
      const panel = document.getElementById('staggered-menu-panel');
      if (panel && panel.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const cycleTheme = () => {
    playClack();
    const html = document.documentElement;

    if (html.classList.contains("invert-theme")) {
      html.classList.remove("invert-theme");
      html.classList.add("theme-color");
    } else if (html.classList.contains("theme-color")) {
      html.classList.remove("theme-color");
      html.classList.add("theme-neumorphic");
    } else if (html.classList.contains("theme-neumorphic")) {
      html.classList.remove("theme-neumorphic");
    } else {
      html.classList.add("invert-theme");
    }
  };

  const toggleLanguage = () => {
    playLanguageToggle();
    const newLocale = currentLocale === 'en' ? 'ar' : 'en';
    // Replace the current locale in the pathname
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    // If we're at root, the replace might fail if the path is exactly '/'
    router.push(pathname === '/' ? `/${newLocale}` : newPath);
  };

  const toggleMobileMenu = () => {
    playTick();
    setIsOpen(!isOpen);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsOpen(false);

    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      router.replace(`/${currentLocale}`, { scroll: false });
      setActiveHash("");
    }
  };

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (isHome) {
      e.preventDefault();
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      router.replace(`/${currentLocale}${hash}`, { scroll: false });
    }
    setActiveHash(hash);
    setIsOpen(false);
  };

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    cycleAboutImage();
    if (pathname === `/${currentLocale}/about`) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav id="navbar-container" ref={navRef} className={`animate-slide-down fixed top-0 left-0 z-50 w-full px-6 md:px-12 lg:px-24 py-6 pointer-events-none flex flex-col transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex justify-between items-start w-full max-w-[90rem] mx-auto relative z-10">

          {/* --- Left Column: Logo & Tools (Total height exactly 64px / h-16) --- */}
          <div className="pointer-events-auto flex brutalist-shadow-static h-16">
            <Link
              href={`/${currentLocale}`}
              onClick={handleLogoClick}
              className="group logo-link bg-white border-4 border-black px-4 flex items-center gap-3 h-full"
            >
              <Origami size={32} className="origami-icon text-black" />
              <svg width="265" height="149" className="h-8 w-auto fill-current text-black" viewBox="0 0 239 124" xmlns="http://www.w3.org/2000/svg">
                <path d="M60.5 0C79.2264 3.06212e-06 95.965 8.50863 107.062 21.8701C104.403 21.5379 101.553 21.3721 98.5127 21.3721C92.7018 21.3721 87.2387 22.4651 82.123 24.6504C77.057 26.8357 72.9591 29.9644 69.8301 34.0371C66.7509 38.06 65.211 42.828 65.2109 48.3408C65.2109 53.8538 66.3786 58.4732 68.7129 62.1982C71.0472 65.9231 74.0768 69.0275 77.8018 71.5107C81.5764 73.994 85.6244 76.1045 89.9453 77.8428C94.2663 79.5314 97.8674 81.1459 100.748 82.6855C103.629 84.1755 105.789 85.7645 107.229 87.4531C108.67 89.1418 109.39 91.0548 109.39 93.1904C109.39 94.908 108.979 96.4287 108.167 97.7578C107.696 98.3596 107.215 98.9529 106.722 99.5361C106.484 99.7621 106.232 99.9826 105.963 100.193C103.678 101.932 100.251 102.801 95.6816 102.801C92.95 102.801 90.1688 102.428 87.3379 101.683C84.5566 100.938 81.9238 100.044 79.4404 99.001C76.9573 97.9084 74.8466 96.8653 73.1084 95.8721C71.4201 94.879 70.2778 94.1589 69.6816 93.7119L58.5811 112.411C59.2269 113.007 61.1891 114.199 64.4668 115.987C66.8364 117.28 69.7383 118.506 73.1719 119.669C69.0853 120.54 64.8464 121 60.5 121C27.0868 121 0 93.9132 0 60.5C6.1849e-06 27.0868 27.0868 0 60.5 0ZM100.896 41.5615C103.727 41.5615 106.435 42.0083 109.018 42.9023C111.65 43.7963 113.91 44.8147 115.797 45.957C117.666 47.0595 119.003 47.9084 119.809 48.502C120.589 52.3801 121 56.3921 121 60.5C121 63.9146 120.716 67.2631 120.173 70.5234C118.892 69.5667 117.533 68.6791 116.095 67.8604C112.866 66.0227 109.415 64.4328 105.739 63.0918C101.716 61.5521 98.3882 60.137 95.7559 58.8457C93.1734 57.5048 91.2366 56.114 89.9453 54.6738C88.7036 53.1838 88.083 51.5193 88.083 49.6816C88.0831 46.9999 89.2499 44.9884 91.584 43.6475C93.9679 42.2568 97.0723 41.5616 100.896 41.5615Z" />
                <path d="M127.639 21.3721H162.001C167.715 21.3721 173 22.1559 177.854 23.7236C182.759 25.2912 186.704 27.8703 189.688 31.4607C192.722 35.0006 194.239 39.8047 194.239 45.8731C194.239 49.8681 193.48 53.4332 191.963 56.5686C190.497 59.7039 188.524 62.2829 186.046 64.3057C183.619 66.2779 180.964 67.5927 178.082 68.2501C180.61 68.5536 183.063 69.2868 185.44 70.4499C187.867 71.5625 190.042 73.1301 191.963 75.1529C193.935 77.1251 195.478 79.603 196.59 82.5866C197.753 85.5197 198.335 89.009 198.335 93.0546C198.335 98.6678 197.071 103.624 194.542 107.922C192.064 112.17 188.423 115.507 183.619 117.935C178.866 120.312 173.025 121.5 166.097 121.5H127.639V21.3721ZM150.319 103.371H160.635C163.872 103.371 166.501 102.89 168.524 101.93C170.597 100.918 172.115 99.5022 173.075 97.6817C174.036 95.8106 174.517 93.5856 174.517 91.0065C174.517 86.9609 173.252 84.0026 170.724 82.1315C168.246 80.2099 164.757 79.249 160.256 79.249H150.319V103.371ZM150.319 61.4991H159.497C162.178 61.4991 164.403 61.0187 166.173 60.0579C167.993 59.097 169.359 57.7569 170.269 56.0376C171.23 54.2676 171.71 52.2448 171.71 49.9692C171.71 45.8731 170.547 43.117 168.221 41.7011C165.895 40.2346 162.709 39.5013 158.663 39.5013H150.319V61.4991Z" />
                <path d="M225.177 123.288C221.501 123.288 218.323 121.972 215.641 119.34C213.008 116.658 211.692 113.479 211.692 109.803C211.692 106.029 213.008 102.825 215.641 100.193C218.323 97.511 221.501 96.17 225.177 96.17C228.951 96.17 232.155 97.511 234.787 100.193C237.42 102.825 238.736 106.029 238.736 109.803C238.736 113.479 237.42 116.658 234.787 119.34C232.155 121.972 228.951 123.288 225.177 123.288Z" />
              </svg>

            </Link>

            <CustomTooltip content={dict?.cycleTheme || "Cycle Theme"} side="bottom">
              <AnimatedThemeToggler
                variant="square"
                onToggle={cycleTheme}
                onMouseEnter={prewarmAudio}
                onTouchStart={prewarmAudio}
                aria-label="Cycle System Theme"
                className="group bg-black text-white border-4 border-s-0 border-black px-3.5 flex items-center justify-center hover:bg-white hover:text-black active:bg-white active:text-black transition-colors h-full"
              >
                <Palette size={18} className="theme-icon-creative" />
              </AnimatedThemeToggler>
            </CustomTooltip>

            <CustomTooltip content={dict?.toggleLanguage || "Toggle Language"} side="bottom">
              <button
                onClick={toggleLanguage}
                onMouseEnter={prewarmAudio}
                onTouchStart={prewarmAudio}
                aria-label="Toggle Language"
                className="group bg-white text-black border-4 border-s-0 border-black px-3.5 flex items-center justify-center gap-1 hover:bg-black hover:text-white active:bg-black active:text-white font-bold transition-colors h-full"
              >
                <Globe size={18} />
                <div className="h-[1.2em] overflow-hidden leading-[1.2em] flex flex-col justify-start text-center min-w-[2ch]">
                  <div className="flex flex-col slot-machine-text">
                    <span>{dict?.toggleLang || (currentLocale === 'en' ? 'AR' : 'EN')}</span>
                    <span>{currentLocale === 'en' ? 'EN' : 'AR'}</span>
                    <span>{dict?.toggleLang || (currentLocale === 'en' ? 'AR' : 'EN')}</span>
                  </div>
                </div>
              </button>
            </CustomTooltip>
          </div>

          {/* --- Desktop Nav Links Block (Locked to exactly 64px / h-16 height) --- */}
          <div className="pointer-events-auto hidden md:flex items-stretch gap-1.5 bg-white border-4 border-black p-1.5 brutalist-shadow-static h-16">

            <Link
              href={`/${currentLocale}/about`}
              onClick={handleAboutClick}
              className={`relative group overflow-hidden isolate text-lg font-bold uppercase px-4 flex items-center border-2 transition-all ${pathname === `/${currentLocale}/about`
                ? 'bg-black text-white border-black'
                : 'border-transparent hover:border-black hover:bg-black hover:text-white active:border-black active:bg-black active:text-white'
                }`}
            >
              <Smoke isActive={pathname === `/${currentLocale}/about`} />
              <span className="relative z-10">{dict?.about || "About"}</span>
            </Link>

            <Link
              href={`/${currentLocale}#projects`}
              onClick={(e) => handleHashClick(e, '#projects')}
              className={`relative group overflow-hidden isolate text-lg font-bold uppercase px-4 flex items-center border-2 transition-all ${isHome && activeHash === '#projects'
                ? 'bg-black text-white border-black'
                : 'border-transparent hover:border-black hover:bg-black hover:text-white active:border-black active:bg-black active:text-white'
                }`}
            >
              <Smoke isActive={isHome && activeHash === '#projects'} />
              <span className="relative z-10">{dict?.work || "Work"}</span>
            </Link>

            <HoverCard>
              <HoverCardTrigger asChild>
                <a
                  href="https://github.com/samybit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group overflow-hidden isolate flex items-center gap-1 text-lg font-bold uppercase px-4 border-2 border-transparent hover:border-black hover:bg-black hover:text-white active:border-black active:bg-black active:text-white transition-all"
                >
                  <Smoke />
                  <span className="relative z-10 flex items-center gap-1">
                    {dict?.github || "GitHub"}
                    {currentLocale === 'ar' ? (
                      <ArrowUpLeft size={20} className="ms-1 fly-spin-arrow-rtl" />
                    ) : (
                      <ArrowUpRight size={20} className="ms-1 fly-spin-arrow" />
                    )}
                    <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
                  </span>
                </a>
              </HoverCardTrigger>
              <HoverCardContent className="bg-white text-black border-4 border-black brutalist-shadow-static rounded-none w-80 p-2 z-[99999] pointer-events-auto">
                <div className="relative w-full aspect-video border-2 border-black rounded-none bg-zinc-100 overflow-hidden">
                  <Image
                    src="/github_preview.png"
                    alt="GitHub Profile Preview"
                    fill
                    sizes="(max-width: 320px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Link
                  href={`/${currentLocale}#contact`}
                  onClick={(e) => handleHashClick(e, '#contact')}
                  className={`relative group overflow-hidden isolate px-5 flex items-center text-lg font-bold uppercase border-2 transition-all ms-1 ${isHome && activeHash === '#contact'
                    ? 'bg-white text-black border-black'
                    : 'bg-black text-white border-black hover:bg-white hover:text-black active:bg-white active:text-black'
                    }`}
                >
                  <Smoke inverse={true} isActive={isHome && activeHash === '#contact'} />
                  <span className="relative z-10">{dict?.contact || "Contact"}</span>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="bg-white text-black border-4 border-black brutalist-shadow-static rounded-none w-72 p-4 z-[99999] flex flex-col gap-3 text-start pointer-events-auto">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                    {currentLocale === 'ar' ? "البريد الإلكتروني:" : "Email Address:"}
                  </span>
                  <span className="text-xs font-mono font-black break-all select-all border border-zinc-200 p-2 bg-zinc-50">
                    samyb.samir [at] gmail [dot] com
                  </span>
                </div>
                <div className="group/copycard w-full flex items-center justify-between gap-3 pt-1">
                  {/* Left Side: Standalone Envelope Icon & Animation */}
                  <div
                    onClick={handleCopyEmail}
                    className="cursor-pointer shrink-0 flex items-center justify-center p-1 group/env"
                    title={currentLocale === 'ar' ? "نسخ البريد" : "Copy Email"}
                  >
                    <style>{`
                      @keyframes crumble-and-vanish {
                        0% {
                          transform: translateY(4px) scale(1) skewX(0deg) skewY(0deg);
                          transform-origin: 12px 7px;
                          clip-path: polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%);
                          opacity: 0;
                        }
                        18% {
                          /* Emerges out of open envelope */
                          transform: translateY(-2px) scale(1) skewX(0deg) skewY(0deg);
                          transform-origin: 12px 7px;
                          clip-path: polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%);
                          opacity: 1;
                        }
                        36% {
                          /* Shoots up cleanly into open space above */
                          transform: translateY(-16px) scale(1) skewX(0deg) skewY(0deg);
                          transform-origin: 12px 7px;
                          clip-path: polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%);
                          opacity: 1;
                        }
                        50% {
                          /* Hold flat and intact at peak */
                          transform: translateY(-16px) scale(1) skewX(0deg) skewY(0deg);
                          transform-origin: 12px 7px;
                          clip-path: polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%);
                          opacity: 1;
                        }
                        62% {
                          /* Squeezes rapidly in-place while edges cave in jaggedly */
                          transform: translateY(-16px) scaleX(0.7) scaleY(0.85) skewX(15deg) skewY(-5deg);
                          transform-origin: 12px 7px;
                          clip-path: polygon(5% 8%, 52% 3%, 92% 6%, 96% 48%, 94% 92%, 48% 95%, 6% 91%, 3% 52%);
                          opacity: 1;
                        }
                        74% {
                          /* Crumples smaller into irregular paper lump */
                          transform: translateY(-16px) scaleX(0.4) scaleY(0.55) skewX(-20deg) skewY(15deg);
                          transform-origin: 12px 7px;
                          clip-path: polygon(15% 20%, 48% 10%, 82% 16%, 88% 52%, 80% 82%, 52% 88%, 18% 80%, 12% 46%);
                          opacity: 0.9;
                        }
                        86% {
                          /* Squeezed to a tiny paper ball in-place */
                          transform: translateY(-16px) scaleX(0.2) scaleY(0.2) skewX(25deg) skewY(-20deg);
                          transform-origin: 12px 7px;
                          clip-path: polygon(30% 32%, 50% 25%, 72% 28%, 76% 52%, 68% 70%, 48% 75%, 28% 68%, 24% 48%);
                          opacity: 0.5;
                        }
                        95%, 100% {
                          /* Vanishes completely */
                          transform: translateY(-16px) scale(0);
                          transform-origin: 12px 7px;
                          clip-path: polygon(45% 46%, 50% 42%, 55% 46%, 56% 50%, 54% 54%, 50% 56%, 46% 54%, 45% 50%);
                          opacity: 0;
                        }
                      }
                      .letter-crumble {
                        animation: crumble-and-vanish 1.7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                      }
                    `}</style>
                    <svg
                      viewBox="0 0 24 24"
                      width="32"
                      height="32"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      className="shrink-0 overflow-visible"
                      aria-hidden="true"
                    >
                      {/* 1. Back Flap (Open state, folds open when hovered or copied) */}
                      <path
                        d="M3 8l9-6 9 6"
                        stroke="black"
                        strokeWidth="2"
                        fill="white"
                        className={`transition-all duration-300 ease-in-out ${emailCopied ? "opacity-100" : "opacity-0 group-hover/copycard:opacity-100"
                          }`}
                      />

                      {/* 2. Back pocket of envelope */}
                      <rect
                        x="3"
                        y="8"
                        width="18"
                        height="12"
                        stroke="black"
                        strokeWidth="2"
                        fill="white"
                      />

                      {/* 3. Popout Letter Card (emerges, shoots up & crumples ONLY on copy press) */}
                      <g
                        className={emailCopied ? "letter-crumble" : ""}
                        style={!emailCopied ? {
                          transform: 'translateY(4px)',
                          opacity: 0,
                        } : undefined}
                      >
                        <rect
                          x="6"
                          y="2"
                          width="12"
                          height="10"
                          stroke="black"
                          strokeWidth="2"
                          fill="white"
                        />
                        <path d="M10 7 l2 2 l3 -3" stroke="black" strokeWidth="2" strokeLinecap="square" />

                        {/* Crease/Wrinkle Lines (visible during crumble phase) */}
                        <path
                          d="M8 3 l2 2 l-1 2 l3 -1 l-1 2"
                          stroke="black"
                          strokeWidth="1.2"
                          className="transition-opacity duration-300"
                          style={{
                            opacity: emailCopied ? 0.75 : 0,
                            transition: emailCopied ? 'opacity 0.2s ease 0.5s' : 'opacity 0.1s ease'
                          }}
                        />
                        <path
                          d="M16 4 l-3 2 l1 2 l-2 -1 l1 2"
                          stroke="black"
                          strokeWidth="1.2"
                          className="transition-opacity duration-300"
                          style={{
                            opacity: emailCopied ? 0.75 : 0,
                            transition: emailCopied ? 'opacity 0.2s ease 0.5s' : 'opacity 0.1s ease'
                          }}
                        />
                      </g>

                      {/* 4. Front panel overlay to cover the letter card in down state */}
                      <path
                        d="M3 8l9 6 9-6 v12 H3 z"
                        stroke="black"
                        strokeWidth="2"
                        fill="white"
                      />
                      <path d="M3 20l9-6 9 6" stroke="black" strokeWidth="2" />

                      {/* 5. Front Flap (Closed state, folds down when hovered or copied) */}
                      <path
                        d="M3 8l9 6 9-6"
                        stroke="black"
                        strokeWidth="2"
                        fill="white"
                        className={`transition-all duration-300 ease-in-out ${emailCopied ? "opacity-0" : "opacity-100 group-hover/copycard:opacity-0"
                          }`}
                      />
                    </svg>
                  </div>

                  {/* Right Side: Copy Email Action Button */}
                  <button
                    onClick={handleCopyEmail}
                    className="flex-1 py-2.5 px-3 border-2 border-black bg-black text-white hover:bg-white hover:text-black font-mono font-black text-xs uppercase tracking-wider transition-colors text-center"
                  >
                    <span className="relative grid grid-cols-1 grid-rows-1 justify-items-center">
                      <span
                        className={`col-start-1 row-start-1 transition-opacity duration-300 ${emailCopied ? "opacity-100" : "opacity-0 pointer-events-none"
                          }`}
                      >
                        {currentLocale === 'ar' ? "تم النسخ" : "Copied!"}
                      </span>
                      <span
                        className={`col-start-1 row-start-1 transition-opacity duration-300 ${emailCopied ? "opacity-0 pointer-events-none" : "opacity-100"
                          }`}
                      >
                        {currentLocale === 'ar' ? "نسخ البريد" : "Copy Email"}
                      </span>
                    </span>
                  </button>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={toggleMobileMenu}
            onMouseEnter={prewarmAudio}
            onTouchStart={prewarmAudio}
            className="relative z-[60] pointer-events-auto md:hidden bg-white border-4 border-black p-3 brutalist-shadow-static active:translate-x-1 active:translate-y-1 active:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={32} className="text-black" /> : <Menu size={32} className="text-black" />}
          </button>
        </div>
      </nav>

      {/* --- Mobile Menu Dropdown (StaggeredMenu) --- */}
      <div className="md:hidden">
        <StaggeredMenu
          hideHeader={true}
          externalOpen={isOpen}
          onMenuClose={() => setIsOpen(false)}
          isFixed={true}
          position="right"
          colors={['#000000', '#ffffff']}
          items={[
            {
              label: dict?.about || "About",
              link: `/${currentLocale}/about`,
              onClick: handleAboutClick
            },
            {
              label: dict?.work || "Work",
              link: `/${currentLocale}#projects`,
              onClick: (e) => handleHashClick(e, '#projects')
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  {dict?.github || "GitHub"}
                  {currentLocale === 'ar' ? (
                    <ArrowUpLeft size="1.25em" className="fly-spin-arrow-rtl" />
                  ) : (
                    <ArrowUpRight size="1.25em" className="fly-spin-arrow" />
                  )}
                </span>
              ),
              link: "https://github.com/samybit",
              onClick: undefined,
              external: true
            },
            {
              label: dict?.contact || "Contact",
              link: `/${currentLocale}#contact`,
              onClick: (e) => handleHashClick(e, '#contact')
            },
          ]}
          displaySocials={true}
          socialTitle={dict?.networks || "Verified Networks"}
          socialItems={[
            {
              label: <Linkedin size={18} fill="currentColor" />,
              link: "https://linkedin.com/in/samybit/"
            },
            {
              label: (
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                  <path d="M4.654 3c.461 0 .887.035 1.278.14.39.07.711.216.996.391s.497.426.641.747c.14.32.216.711.216 1.137 0 .496-.106.922-.356 1.242-.215.32-.566.606-.997.817.606.176 1.067.496 1.348.922s.461.957.461 1.563c0 .496-.105.922-.285 1.278a2.3 2.3 0 0 1-.782.887c-.32.215-.711.39-1.137.496a5.3 5.3 0 0 1-1.278.176L0 12.803V3zm-.285 3.978c.39 0 .71-.105.957-.285.246-.18.355-.497.355-.887 0-.216-.035-.426-.105-.567a1 1 0 0 0-.32-.355 1.8 1.8 0 0 0-.461-.176c-.176-.035-.356-.035-.567-.035H2.17v2.31c0-.005 2.2-.005 2.2-.005zm.105 4.193c.215 0 .426-.035.606-.07.176-.035.356-.106.496-.216s.25-.215.356-.39c.07-.176.14-.391.14-.641 0-.496-.14-.852-.426-1.102-.285-.215-.676-.32-1.137-.32H2.17v2.734h2.305zm6.858-.035q.428.427 1.278.426c.39 0 .746-.106 1.032-.286q.426-.32.53-.64h1.74c-.286.851-.712 1.457-1.278 1.848-.566.355-1.243.566-2.06.566a4.1 4.1 0 0 1-1.527-.285 2.8 2.8 0 0 1-1.137-.782 2.85 2.85 0 0 1-.712-1.172c-.175-.461-.25-.957-.25-1.528 0-.531.07-1.032.25-1.493.18-.46.426-.852.747-1.207.32-.32.711-.606 1.137-.782a4 4 0 0 1 1.493-.285c.606 0 1.137.105 1.598.355.46.25.817.532 1.102.958.285.39.496.851.641 1.348.07.496.105.996.07 1.563h-5.15c0 .58.21 1.11.496 1.396m2.24-3.732c-.25-.25-.642-.391-1.103-.391-.32 0-.566.07-.781.176s-.356.25-.496.39a.96.96 0 0 0-.25.497c-.036.175-.07.32-.07.46h3.196c-.07-.526-.25-.882-.497-1.132zm-3.127-3.728h3.978v.957h-3.978z" />
                </svg>
              ),
              link: "https://behance.net/samy-barsoum"
            },
            {
              label: (
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round" overflow="visible" className="w-5 h-5">
                  <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
                </svg>
              ),
              link: "https://www.upwork.com/freelancers/~015e572ae8edee2be8"
            },
            {
              label: (
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-5 h-5 scale-[0.85]">
                  <path d="M53.6232 47.1015H98.913C99.6377 47.1015 100 47.1014 100 46.3768V44.9275C100 44.5652 100 44.2029 99.2754 44.2029C77.8986 38.4058 61.2319 22.1014 55.7971 0.724637L54.3478 0H53.2609C52.8986 0 52.5362 0.36232 52.5362 1.08696V46.3768C52.5362 46.7391 52.5362 47.1015 53.2609 47.1015H53.6232ZM53.6232 100H55.0725L55.7971 99.2754C61.5942 77.8986 77.8986 61.2319 99.2754 55.7971L100 54.7101V53.6232C100 53.2609 99.6377 52.5362 98.913 52.5362H53.6232L52.8986 53.6232V98.913C52.8986 99.6377 52.8986 100 53.6232 100ZM45.2899 100H46.3768C46.7391 100 47.1015 99.6377 47.1015 98.913V53.6232C47.1015 53.2609 47.1015 52.5362 46.3768 52.5362H1.08696C0.362319 52.5362 0 53.2609 0 53.6232V55.0725C0 55.4348 0 55.7971 0.724638 55.7971C22.1015 61.2319 38.7681 77.8986 44.2029 99.2754L45.2899 100ZM1.08696 47.1015H46.3768C46.7391 47.1015 47.1015 47.1014 47.1015 46.3768V1.08696C47.1015 0.36232 47.1015 0 46.3768 0H44.9275C44.5652 0 44.2029 -7.01866e-07 44.2029 0.724637C38.4058 21.7391 21.7391 38.7681 0.724638 44.2029L0 45.2899V46.3768C0 46.7391 0.362319 47.1015 1.08696 47.1015Z" />
                </svg>
              ),
              link: "https://contra.com/samy_barsoum_akavah3d"
            },
            {
              label: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="6" className="w-5 h-5 scale-90">
                  <circle cx="12" cy="12" r="7" />
                </svg>
              ),
              link: "https://mostaql.com/u/Samy_01"
            },
            {
              label: (
                <svg viewBox="0 0 67.94 100" fill="currentColor" className="w-5 h-5 scale-[0.85]">
                  <path d="M16 46.2269C17.6962 43.3192 19.7615 40.6423 22.1712 38.2327C25.0885 35.3154 28.3942 32.9038 32.0308 31.0404V16.0308H43.6712V0H16V46.2269ZM32.0308 37.1769C22.6077 43.05 16.2712 53.4077 16.0096 65.2673C16.0058 65.3942 16.0038 65.5212 16.0019 65.6481C16 65.775 16 65.9019 16 66.0288H32.0308C32.0308 58.3538 36.8788 51.7865 43.6712 49.2308V32.6462C39.4692 33.4365 35.5365 35.0058 32.0308 37.1942V37.1769ZM16.0404 83.9692H43.6712V100H16.0404V83.9692ZM49.9692 32.0615C49.65 32.0615 49.3327 32.0654 49.0154 32.0769V48.1173C49.3308 48.1 49.6481 48.0923 49.9692 48.0923C59.8596 48.0923 67.9077 56.1404 67.9077 66.0308C67.9077 75.9212 59.8596 83.9692 49.9692 83.9692H49.0154V100H49.9692C68.7 100 83.9385 84.7615 83.9385 66.0308C83.9385 47.3 68.7 32.0615 49.9692 32.0615ZM49.0154 0H79.1673V16.0308H49.0154V0Z" />
                </svg>
              ),
              link: "https://khamsat.com/user/samy-b"
            }
          ]}
        />
      </div>
    </>
  );
}