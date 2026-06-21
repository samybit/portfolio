"use client";

import { playClack, playTick, prewarmAudio } from "@/utils/audio";
import { TerminalSquare, ArrowUpRight, Menu, X, Palette, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Smoke from "@/components/Smoke";
import { CustomTooltip } from "@/components/ui/tooltip";

export default function Navbar({ dict, currentLocale }: { dict: Record<string, string>, currentLocale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [activeHash, setActiveHash] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const isHome = pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If mobile menu is open, don't hide the navbar
      if (isOpen) {
        lastScrollY.current = currentScrollY;
        return;
      }
      
      // Hide if scrolling down and past 80px, show if scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsVisible(prev => prev ? false : prev);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(prev => !prev ? true : prev);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  useEffect(() => {
    if (!isHome) {
      requestAnimationFrame(() => setActiveHash(""));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;

            if (id === 'hero') {
              setActiveHash("");
              window.history.replaceState(null, '', `/${currentLocale}`);
            }
            else if (id === 'projects' || id === 'contact') {
              setActiveHash(`#${id}`);
              window.history.replaceState(null, '', `/${currentLocale}#${id}`);
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
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
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

    html.classList.add("theme-transitioning");

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

    setTimeout(() => {
      html.classList.remove("theme-transitioning");
    }, 50);
  };

  const toggleLanguage = () => {
    playTick();
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
      router.replace(`/${currentLocale}`, { scroll: false });
      setActiveHash("");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (isHome) {
      e.preventDefault();
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        router.replace(`/${currentLocale}${hash}`, { scroll: false });
      }
    }
    setActiveHash(hash);
    setIsOpen(false);
  };

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === `/${currentLocale}/about`) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav id="navbar-container" ref={navRef} className={`animate-slide-down fixed top-0 left-0 z-50 w-full px-6 md:px-12 py-6 pointer-events-none flex flex-col transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex justify-between items-start w-full relative z-10">

        {/* --- Left Column: Logo & Tools (Total height exactly 64px / h-16) --- */}
        <div className="pointer-events-auto flex brutalist-shadow-static h-16">
          <Link
            href={`/${currentLocale}`}
            onClick={handleLogoClick}
            className="bg-white border-4 border-black px-4 flex items-center gap-3 h-full"
          >
            <TerminalSquare size={32} className="text-black" />
            <span className="text-2xl font-black uppercase tracking-tighter">SB.</span>
          </Link>

          <CustomTooltip content={dict?.cycleTheme || "Cycle Theme"} side="bottom">
            <button
              onClick={cycleTheme}
              onMouseEnter={prewarmAudio}
              onTouchStart={prewarmAudio}
              aria-label="Cycle System Theme"
              className="group bg-black text-white border-4 border-s-0 border-black px-3.5 flex items-center justify-center hover:bg-white hover:text-black transition-colors h-full"
            >
              <Palette size={18} className="theme-icon-creative" />
            </button>
          </CustomTooltip>
          
          <CustomTooltip content={dict?.toggleLanguage || "Toggle Language"} side="bottom">
            <button
              onClick={toggleLanguage}
              onMouseEnter={prewarmAudio}
              onTouchStart={prewarmAudio}
              aria-label="Toggle Language"
              className="group bg-white text-black border-4 border-s-0 border-black px-3.5 flex items-center justify-center gap-1 hover:bg-black hover:text-white font-bold transition-colors h-full"
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
              : 'border-transparent hover:border-black hover:bg-black hover:text-white'
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
              : 'border-transparent hover:border-black hover:bg-black hover:text-white'
              }`}
          >
            <Smoke isActive={isHome && activeHash === '#projects'} />
            <span className="relative z-10">{dict?.work || "Work"}</span>
          </Link>

          <a
            href="https://github.com/samybit"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group overflow-hidden isolate flex items-center gap-1 text-lg font-bold uppercase px-4 border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all"
          >
            <Smoke />
            <span className="relative z-10 flex items-center gap-1">
              {dict?.github || "GitHub"} <ArrowUpRight size={20} className="ms-1 fly-spin-arrow rtl:-scale-x-100" />
              <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
            </span>
          </a>

          <Link
            href={`/${currentLocale}#contact`}
            onClick={(e) => handleHashClick(e, '#contact')}
            className={`relative group overflow-hidden isolate px-5 flex items-center text-lg font-bold uppercase border-2 transition-all ms-1 ${isHome && activeHash === '#contact'
              ? 'bg-white text-black border-black'
              : 'bg-black text-white border-black hover:bg-white hover:text-black'
              }`}
          >
            <Smoke inverse={true} isActive={isHome && activeHash === '#contact'} />
            <span className="relative z-10">{dict?.contact || "Contact"}</span>
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={toggleMobileMenu}
          onMouseEnter={prewarmAudio}
          onTouchStart={prewarmAudio}
          className="pointer-events-auto md:hidden bg-white border-4 border-black p-3 brutalist-shadow-static"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={32} className="text-black" /> : <Menu size={32} className="text-black" />}
        </button>
      </div>

      {/* --- Mobile Menu Dropdown --- */}
      {isOpen && (
        <div className="pointer-events-auto md:hidden w-full mt-4 bg-white border-4 border-black p-6 flex flex-col gap-2 brutalist-shadow-static animate-expand-tr">
          <Link
            href={`/${currentLocale}/about`}
            onClick={handleAboutClick}
            className={`relative group overflow-hidden isolate text-3xl font-black uppercase p-4 border-b-4 border-black transition-colors ${pathname === `/${currentLocale}/about`
              ? 'bg-black text-white'
              : 'hover:bg-black hover:text-white'
              }`}
          >
            <Smoke isActive={pathname === `/${currentLocale}/about`} />
            <span className="relative z-10">{dict?.about || "About"}</span>
          </Link>

          <Link
            href={`/${currentLocale}#projects`}
            onClick={(e) => handleHashClick(e, '#projects')}
            className={`relative group overflow-hidden isolate text-3xl font-black uppercase p-4 border-b-4 border-black transition-colors ${isHome && activeHash === '#projects'
              ? 'bg-black text-white'
              : 'hover:bg-black hover:text-white'
              }`}
          >
            <Smoke isActive={isHome && activeHash === '#projects'} />
            <span className="relative z-10">{dict?.work || "Work"}</span>
          </Link>

          <a
            href="https://github.com/samybit"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group overflow-hidden isolate flex justify-between items-center text-3xl font-black uppercase p-4 border-b-4 border-black hover:bg-black hover:text-white transition-colors"
          >
            <Smoke />
            <span className="relative z-10 flex justify-between items-center w-full">
              {dict?.github || "GitHub"} <ArrowUpRight size={32} className="fly-spin-arrow rtl:-scale-x-100" />
              <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
            </span>
          </a>

          <Link
            href={`/${currentLocale}#contact`}
            onClick={(e) => handleHashClick(e, '#contact')}
            className={`relative group overflow-hidden isolate mt-4 text-center p-5 text-3xl font-black uppercase border-4 border-black transition-colors ${isHome && activeHash === '#contact'
              ? 'bg-white text-black'
              : 'bg-black text-white hover:bg-white hover:text-black'
              }`}
          >
            <Smoke inverse={true} isActive={isHome && activeHash === '#contact'} />
            <span className="relative z-10">{dict?.contact || "Contact"}</span>
          </Link>
        </div>
      )}
    </nav>
  );
}