"use client";

import { playClack, playTick, prewarmAudio } from "@/utils/audio";
import { Origami, ArrowUpRight, ArrowUpLeft, Menu, X, Palette, Globe, Layers, List } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Smoke from "@/components/Smoke";
import { CustomTooltip } from "@/components/ui/tooltip";
import { useScrollMode } from "@/context/ScrollModeContext";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { StaggeredMenu } from "@/components/StaggeredMenu";

export default function Navbar({ dict, currentLocale }: { dict: Record<string, string>, currentLocale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [activeHash, setActiveHash] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { isCurtainMode } = useScrollMode();

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
      if (isCurtainMode) {
        window.dispatchEvent(new CustomEvent('curtainNavigate', { detail: 0 }));
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      router.replace(`/${currentLocale}`, { scroll: false });
      setActiveHash("");
    }
  };

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (isHome) {
      e.preventDefault();
      if (isCurtainMode) {
        let index = 0;
        if (hash === '#projects') index = 1;
        else if (hash === '#contact') index = 3;
        window.dispatchEvent(new CustomEvent('curtainNavigate', { detail: index }));
      } else {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      router.replace(`/${currentLocale}${hash}`, { scroll: false });
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
    <>
    <nav id="navbar-container" ref={navRef} className={`animate-slide-down fixed top-0 left-0 z-50 w-full px-6 md:px-12 lg:px-24 py-6 pointer-events-none flex flex-col transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className={`flex justify-between items-start w-full max-w-[90rem] mx-auto relative z-10 ${isCurtainMode ? 'pr-4 md:pr-6 lg:pr-8' : ''}`}>

        {/* --- Left Column: Logo & Tools (Total height exactly 64px / h-16) --- */}
        <div className="pointer-events-auto flex brutalist-shadow-static h-16">
          <Link
            href={`/${currentLocale}`}
            onClick={handleLogoClick}
            className="group logo-link bg-white border-4 border-black px-4 flex items-center gap-3 h-full"
          >
            <Origami size={32} className="origami-icon text-black" />
            <span className="text-2xl font-black uppercase tracking-tighter">SB.</span>
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
          displaySocials={false}
        />
      </div>
    </>
  );
}