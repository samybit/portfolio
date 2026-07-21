"use client";

import { playClack, playTick, playLanguageToggle, prewarmAudio } from "@/utils/audio";
import { Origami, ArrowUpRight, ArrowUpLeft, Menu, X, Palette, Globe, Layers, List, Github, Linkedin } from "lucide-react";
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
  const [logoError, setLogoError] = useState(false); // Add this line
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

  // ── Background Idle Prefetch for /about Route & Assets ──
  useEffect(() => {
    if (typeof window === "undefined") return;

    const aboutUrl = `/${currentLocale}/about`;

    const triggerPrefetch = () => {
      // 1. Prefetch Next.js route bundle and RSC payload
      router.prefetch(aboutUrl);

      // 2. Pre-cache all 4 About page background images into browser cache
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
          triggerPrefetch();
        });
      } else {
        triggerPrefetch();
      }
    }, 2200);

    return () => {
      if (timerId) clearTimeout(timerId);
      if (idleId && "cancelIdleCallback" in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
    };
  }, [currentLocale, router]);

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

              {logoError ? (
                <span className="text-2xl font-black uppercase tracking-tighter">SB.</span>
              ) : (
                // <svg width="265" height="149" className="h-8 w-auto fill-current text-black" viewBox="0 0 265 149" xmlns="http://www.w3.org/2000/svg">
                //   <path d="M74.5 0C93.5417 0 110.914 7.14466 124.085 18.8984C123.406 18.8809 122.717 18.8721 122.018 18.8721C116.207 18.8721 110.743 19.9651 105.628 22.1504C100.562 24.3357 96.4649 27.4646 93.3359 31.5371C90.2566 35.5601 88.7168 40.3279 88.7168 45.8408C88.7168 51.3538 89.8834 55.9732 92.2178 59.6982C94.5521 63.4232 97.5817 66.5274 101.307 69.0107C105.081 71.494 109.129 73.6045 113.45 75.3428C117.771 77.0314 121.372 78.6459 124.253 80.1855C127.133 81.6755 129.294 83.2646 130.734 84.9531C132.175 86.6418 132.895 88.5548 132.895 90.6904C132.894 93.5709 131.752 95.9054 129.468 97.6934C127.183 99.4315 123.756 100.301 119.187 100.301C116.455 100.301 113.674 99.9276 110.843 99.1826C108.062 98.4377 105.429 97.5439 102.946 96.501C100.463 95.4083 98.3516 94.3654 96.6133 93.3721C94.9249 92.3789 93.7826 91.6589 93.1865 91.2119L82.0859 109.911C82.7316 110.507 84.6937 111.699 87.9717 113.487C91.2496 115.275 95.5462 116.939 100.86 118.479C106.224 120.018 112.284 120.788 119.038 120.788C123.806 120.788 128.4 120.192 132.82 119C133.432 118.844 134.034 118.675 134.627 118.495C121.071 136.99 99.1884 149 74.5 149C33.3548 149 0 115.645 0 74.5C0 33.3548 33.3548 0 74.5 0ZM124.402 39.0615C127.233 39.0616 129.94 39.5084 132.522 40.4023C135.155 41.2963 137.414 42.3147 139.302 43.457C141.216 44.5858 142.572 45.4476 143.371 46.043C146.799 54.3296 148.774 63.369 148.98 72.8447C148.692 72.5292 148.396 72.2196 148.093 71.916C145.659 69.3831 142.828 67.198 139.6 65.3604C136.371 63.5227 132.919 61.9328 129.244 60.5918C125.221 59.0522 121.894 57.637 119.262 56.3457C116.679 55.0047 114.742 53.6142 113.45 52.1738C112.209 50.6838 111.588 49.0193 111.588 47.1816C111.588 44.4998 112.756 42.4884 115.09 41.1475C117.474 39.7569 120.578 39.0615 124.402 39.0615Z" />
                //   <path d="M155.779 18.8984H192.75C198.898 18.8984 204.583 19.6961 209.807 21.2913C215.084 22.8865 219.328 25.511 222.538 29.1646C225.803 32.7667 227.435 37.6554 227.435 43.8305C227.435 47.8958 226.619 51.5237 224.986 54.7142C223.409 57.9047 221.287 60.5291 218.621 62.5875C216.009 64.5944 213.153 65.9323 210.051 66.6013C212.772 66.9101 215.411 67.6562 217.968 68.8398C220.579 69.9719 222.919 71.5672 224.986 73.6255C227.108 75.6325 228.768 78.154 229.965 81.1901C231.216 84.1747 231.842 87.7254 231.842 91.8422C231.842 97.5542 230.482 102.597 227.761 106.971C225.095 111.294 221.178 114.69 216.009 117.16C210.895 119.579 204.611 120.788 197.157 120.788H155.779V18.8984ZM180.181 102.34H191.281C194.763 102.34 197.592 101.851 199.768 100.873C201.999 99.8441 203.631 98.4032 204.665 96.5507C205.699 94.6467 206.216 92.3825 206.216 89.7581C206.216 85.6413 204.855 82.6309 202.135 80.7269C199.469 78.7715 195.715 77.7937 190.873 77.7937H180.181V102.34ZM180.181 59.7315H190.057C192.94 59.7315 195.334 59.2426 197.238 58.2649C199.197 57.2872 200.666 55.9235 201.645 54.1739C202.679 52.3728 203.196 50.3144 203.196 47.9987C203.196 43.8305 201.945 41.026 199.442 39.5851C196.939 38.0928 193.511 37.3466 189.159 37.3466H180.181V59.7315Z" />
                //   <path d="M252.567 122.788C249.197 122.788 246.282 121.581 243.823 119.167C241.409 116.708 240.202 113.793 240.202 110.423C240.202 106.962 241.409 104.024 243.823 101.611C246.282 99.1513 249.197 97.9217 252.567 97.9217C256.028 97.9217 258.966 99.1513 261.379 101.611C263.793 104.024 265 106.962 265 110.423C265 113.793 263.793 116.708 261.379 119.167C258.966 121.581 256.028 122.788 252.567 122.788Z" />
                // </svg>
                <svg width="265" height="149" className="h-8 w-auto fill-current text-black" viewBox="0 0 239 124" xmlns="http://www.w3.org/2000/svg">
                  <path d="M60.5 0C79.2264 3.06212e-06 95.965 8.50863 107.062 21.8701C104.403 21.5379 101.553 21.3721 98.5127 21.3721C92.7018 21.3721 87.2387 22.4651 82.123 24.6504C77.057 26.8357 72.9591 29.9644 69.8301 34.0371C66.7509 38.06 65.211 42.828 65.2109 48.3408C65.2109 53.8538 66.3786 58.4732 68.7129 62.1982C71.0472 65.9231 74.0768 69.0275 77.8018 71.5107C81.5764 73.994 85.6244 76.1045 89.9453 77.8428C94.2663 79.5314 97.8674 81.1459 100.748 82.6855C103.629 84.1755 105.789 85.7645 107.229 87.4531C108.67 89.1418 109.39 91.0548 109.39 93.1904C109.39 94.908 108.979 96.4287 108.167 97.7578C107.696 98.3596 107.215 98.9529 106.722 99.5361C106.484 99.7621 106.232 99.9826 105.963 100.193C103.678 101.932 100.251 102.801 95.6816 102.801C92.95 102.801 90.1688 102.428 87.3379 101.683C84.5566 100.938 81.9238 100.044 79.4404 99.001C76.9573 97.9084 74.8466 96.8653 73.1084 95.8721C71.4201 94.879 70.2778 94.1589 69.6816 93.7119L58.5811 112.411C59.2269 113.007 61.1891 114.199 64.4668 115.987C66.8364 117.28 69.7383 118.506 73.1719 119.669C69.0853 120.54 64.8464 121 60.5 121C27.0868 121 0 93.9132 0 60.5C6.1849e-06 27.0868 27.0868 0 60.5 0ZM100.896 41.5615C103.727 41.5615 106.435 42.0083 109.018 42.9023C111.65 43.7963 113.91 44.8147 115.797 45.957C117.666 47.0595 119.003 47.9084 119.809 48.502C120.589 52.3801 121 56.3921 121 60.5C121 63.9146 120.716 67.2631 120.173 70.5234C118.892 69.5667 117.533 68.6791 116.095 67.8604C112.866 66.0227 109.415 64.4328 105.739 63.0918C101.716 61.5521 98.3882 60.137 95.7559 58.8457C93.1734 57.5048 91.2366 56.114 89.9453 54.6738C88.7036 53.1838 88.083 51.5193 88.083 49.6816C88.0831 46.9999 89.2499 44.9884 91.584 43.6475C93.9679 42.2568 97.0723 41.5616 100.896 41.5615Z" />
                  <path d="M127.639 21.3721H162.001C167.715 21.3721 173 22.1559 177.854 23.7236C182.759 25.2912 186.704 27.8703 189.688 31.4607C192.722 35.0006 194.239 39.8047 194.239 45.8731C194.239 49.8681 193.48 53.4332 191.963 56.5686C190.497 59.7039 188.524 62.2829 186.046 64.3057C183.619 66.2779 180.964 67.5927 178.082 68.2501C180.61 68.5536 183.063 69.2868 185.44 70.4499C187.867 71.5625 190.042 73.1301 191.963 75.1529C193.935 77.1251 195.478 79.603 196.59 82.5866C197.753 85.5197 198.335 89.009 198.335 93.0546C198.335 98.6678 197.071 103.624 194.542 107.922C192.064 112.17 188.423 115.507 183.619 117.935C178.866 120.312 173.025 121.5 166.097 121.5H127.639V21.3721ZM150.319 103.371H160.635C163.872 103.371 166.501 102.89 168.524 101.93C170.597 100.918 172.115 99.5022 173.075 97.6817C174.036 95.8106 174.517 93.5856 174.517 91.0065C174.517 86.9609 173.252 84.0026 170.724 82.1315C168.246 80.2099 164.757 79.249 160.256 79.249H150.319V103.371ZM150.319 61.4991H159.497C162.178 61.4991 164.403 61.0187 166.173 60.0579C167.993 59.097 169.359 57.7569 170.269 56.0376C171.23 54.2676 171.71 52.2448 171.71 49.9692C171.71 45.8731 170.547 43.117 168.221 41.7011C165.895 40.2346 162.709 39.5013 158.663 39.5013H150.319V61.4991Z" />
                  <path d="M225.177 123.288C221.501 123.288 218.323 121.972 215.641 119.34C213.008 116.658 211.692 113.479 211.692 109.803C211.692 106.029 213.008 102.825 215.641 100.193C218.323 97.511 221.501 96.17 225.177 96.17C228.951 96.17 232.155 97.511 234.787 100.193C237.42 102.825 238.736 106.029 238.736 109.803C238.736 113.479 237.42 116.658 234.787 119.34C232.155 121.972 228.951 123.288 225.177 123.288Z" />
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
              prefetch={true}
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
              <HoverCardContent className="bg-white text-black border-4 border-black brutalist-shadow-static rounded-none w-80 p-4 z-[99999] flex flex-col gap-3 text-start pointer-events-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-black rounded-none overflow-hidden shrink-0 relative bg-zinc-100">
                    <Image
                      src="/github_profile.jpg"
                      alt="Samy Barsoum"
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-sm leading-tight text-black">Samy Barsoum</span>
                    <span className="text-xs text-zinc-500 font-medium">@samybit</span>
                  </div>
                </div>


                <div className="flex flex-col gap-1.5 border-t-2 border-black pt-2.5 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                    {currentLocale === 'ar' ? "ملف غيت هاب الشخصي:" : "GitHub Profile:"}
                  </span>
                  <span className="text-xs font-bold leading-tight text-black">
                    {currentLocale === 'ar' ? "المستودعات والمساهمات" : "Repositories & Contributions"}
                  </span>
                  <div className="relative w-full aspect-video border-2 border-black rounded-none bg-zinc-100 overflow-hidden mt-1">
                    <Image
                      src="/github_preview.png"
                      alt="GitHub Profile Preview"
                      fill
                      sizes="(max-width: 320px) 100vw, 320px"
                      className="object-cover"
                    />
                  </div>
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
                <button
                  onClick={handleCopyEmail}
                  className="group w-full flex items-center justify-center gap-3 py-2.5 border-2 border-black bg-black text-white hover:bg-white hover:text-black font-mono font-black text-xs uppercase tracking-wider transition-colors"
                >
                  <style>{`
                    @keyframes crumble-and-vanish {
                      0% {
                        transform: translateY(4px) scale(1) skewX(0deg) skewY(0deg);
                        transform-origin: 12px 7px;
                        clip-path: polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%);
                        opacity: 0;
                      }
                      30% {
                        /* Shoots up cleanly as an intact paper */
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
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    className="shrink-0 overflow-visible"
                    aria-hidden="true"
                  >
                    {/* 1. Back Flap (Open state, folded behind the letter card) */}
                    <path
                      d="M3 8l9-6 9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`transition-all duration-300 ease-in-out fill-black group-hover:fill-white ${
                        emailCopied ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {/* 2. Back pocket of envelope */}
                    <rect
                      x="3"
                      y="8"
                      width="18"
                      height="12"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="fill-black group-hover:fill-white transition-colors duration-300"
                    />
                    
                    {/* 3. Popout Letter Card (slides up when copied, in front of back pocket and back flap) */}
                    <g
                      className={emailCopied ? "letter-crumble" : ""}
                      style={!emailCopied ? {
                        transform: 'translateY(4px)',
                        opacity: 0,
                        transition: 'transform 0.3s ease, opacity 0.3s ease'
                      } : undefined}
                    >
                      <rect
                        x="6"
                        y="2"
                        width="12"
                        height="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="fill-black group-hover:fill-white transition-colors duration-300"
                      />
                      <path d="M10 7 l2 2 l3 -3" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                      
                      {/* Crease/Wrinkle Lines (appear with delay when crumbling starts) */}
                      <path
                        d="M8 3 l2 2 l-1 2 l3 -1 l-1 2"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        className="transition-opacity duration-300"
                        style={{
                          opacity: emailCopied ? 0.75 : 0,
                          transition: emailCopied ? 'opacity 0.2s ease 0.5s' : 'opacity 0.1s ease'
                        }}
                      />
                      <path
                        d="M16 4 l-3 2 l1 2 l-2 -1 l1 2"
                        stroke="currentColor"
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
                      stroke="currentColor"
                      strokeWidth="2"
                      className="fill-black group-hover:fill-white transition-colors duration-300"
                    />
                    <path d="M3 20l9-6 9 6" stroke="currentColor" strokeWidth="2" />

                    {/* 5. Front Flap (Closed state, folded in front of everything) */}
                    <path
                      d="M3 8l9 6 9-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`transition-all duration-300 ease-in-out fill-black group-hover:fill-white ${
                        emailCopied ? "opacity-0" : "opacity-100"
                      }`}
                    />
                  </svg>
                  <span className="relative grid grid-cols-1 grid-rows-1">
                    <span
                      className={`col-start-1 row-start-1 transition-opacity duration-300 ${
                        emailCopied ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                    >
                      {currentLocale === 'ar' ? "تم النسخ" : "Copied!"}
                    </span>
                    <span
                      className={`col-start-1 row-start-1 transition-opacity duration-300 ${
                        emailCopied ? "opacity-0 pointer-events-none" : "opacity-100"
                      }`}
                    >
                      {currentLocale === 'ar' ? "نسخ البريد" : "Copy Email"}
                    </span>
                  </span>
                </button>
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
              label: <Github size={18} />,
              link: "https://github.com/samybit"
            },
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
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 scale-[1.1]">
                  <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" />
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
            }
          ]}
        />
      </div>
    </>
  );
}