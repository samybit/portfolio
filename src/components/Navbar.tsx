"use client";

import Image from "next/image";
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
  const [logoError, setLogoError] = useState(false); // Add this line
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

              {logoError ? (
                <span className="text-2xl font-black uppercase tracking-tighter">SB.</span>
              ) : (
                <svg width="265" height="149" className="h-8 w-auto fill-current text-black" viewBox="0 0 265 149" xmlns="http://www.w3.org/2000/svg">
                  <path d="M74.5 0C93.5417 0 110.914 7.14466 124.085 18.8984C123.406 18.8809 122.717 18.8721 122.018 18.8721C116.207 18.8721 110.743 19.9651 105.628 22.1504C100.562 24.3357 96.4649 27.4646 93.3359 31.5371C90.2566 35.5601 88.7168 40.3279 88.7168 45.8408C88.7168 51.3538 89.8834 55.9732 92.2178 59.6982C94.5521 63.4232 97.5817 66.5274 101.307 69.0107C105.081 71.494 109.129 73.6045 113.45 75.3428C117.771 77.0314 121.372 78.6459 124.253 80.1855C127.133 81.6755 129.294 83.2646 130.734 84.9531C132.175 86.6418 132.895 88.5548 132.895 90.6904C132.894 93.5709 131.752 95.9054 129.468 97.6934C127.183 99.4315 123.756 100.301 119.187 100.301C116.455 100.301 113.674 99.9276 110.843 99.1826C108.062 98.4377 105.429 97.5439 102.946 96.501C100.463 95.4083 98.3516 94.3654 96.6133 93.3721C94.9249 92.3789 93.7826 91.6589 93.1865 91.2119L82.0859 109.911C82.7316 110.507 84.6937 111.699 87.9717 113.487C91.2496 115.275 95.5462 116.939 100.86 118.479C106.224 120.018 112.284 120.788 119.038 120.788C123.806 120.788 128.4 120.192 132.82 119C133.432 118.844 134.034 118.675 134.627 118.495C121.071 136.99 99.1884 149 74.5 149C33.3548 149 0 115.645 0 74.5C0 33.3548 33.3548 0 74.5 0ZM124.402 39.0615C127.233 39.0616 129.94 39.5084 132.522 40.4023C135.155 41.2963 137.414 42.3147 139.302 43.457C141.216 44.5858 142.572 45.4476 143.371 46.043C146.799 54.3296 148.774 63.369 148.98 72.8447C148.692 72.5292 148.396 72.2196 148.093 71.916C145.659 69.3831 142.828 67.198 139.6 65.3604C136.371 63.5227 132.919 61.9328 129.244 60.5918C125.221 59.0522 121.894 57.637 119.262 56.3457C116.679 55.0047 114.742 53.6142 113.45 52.1738C112.209 50.6838 111.588 49.0193 111.588 47.1816C111.588 44.4998 112.756 42.4884 115.09 41.1475C117.474 39.7569 120.578 39.0615 124.402 39.0615Z" />
                  <path d="M155.779 18.8984H192.75C198.898 18.8984 204.583 19.6961 209.807 21.2913C215.084 22.8865 219.328 25.511 222.538 29.1646C225.803 32.7667 227.435 37.6554 227.435 43.8305C227.435 47.8958 226.619 51.5237 224.986 54.7142C223.409 57.9047 221.287 60.5291 218.621 62.5875C216.009 64.5944 213.153 65.9323 210.051 66.6013C212.772 66.9101 215.411 67.6562 217.968 68.8398C220.579 69.9719 222.919 71.5672 224.986 73.6255C227.108 75.6325 228.768 78.154 229.965 81.1901C231.216 84.1747 231.842 87.7254 231.842 91.8422C231.842 97.5542 230.482 102.597 227.761 106.971C225.095 111.294 221.178 114.69 216.009 117.16C210.895 119.579 204.611 120.788 197.157 120.788H155.779V18.8984ZM180.181 102.34H191.281C194.763 102.34 197.592 101.851 199.768 100.873C201.999 99.8441 203.631 98.4032 204.665 96.5507C205.699 94.6467 206.216 92.3825 206.216 89.7581C206.216 85.6413 204.855 82.6309 202.135 80.7269C199.469 78.7715 195.715 77.7937 190.873 77.7937H180.181V102.34ZM180.181 59.7315H190.057C192.94 59.7315 195.334 59.2426 197.238 58.2649C199.197 57.2872 200.666 55.9235 201.645 54.1739C202.679 52.3728 203.196 50.3144 203.196 47.9987C203.196 43.8305 201.945 41.026 199.442 39.5851C196.939 38.0928 193.511 37.3466 189.159 37.3466H180.181V59.7315Z" />
                  <path d="M252.567 122.788C249.197 122.788 246.282 121.581 243.823 119.167C241.409 116.708 240.202 113.793 240.202 110.423C240.202 106.962 241.409 104.024 243.823 101.611C246.282 99.1513 249.197 97.9217 252.567 97.9217C256.028 97.9217 258.966 99.1513 261.379 101.611C263.793 104.024 265 106.962 265 110.423C265 113.793 263.793 116.708 261.379 119.167C258.966 121.581 256.028 122.788 252.567 122.788Z" />
                </svg>
              )}

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