"use client";

import { playClack, playTick } from "@/utils/audio";
import { TerminalSquare, ArrowUpRight, Menu, X, Palette } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Smoke from "@/components/Smoke";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If mobile menu is open, don't hide the navbar
      if (isOpen) {
        setLastScrollY(currentScrollY);
        return;
      }
      
      // Hide if scrolling down and past 80px, show if scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isOpen]);

  useEffect(() => {
    if (pathname !== '/') {
      setActiveHash("");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;

            if (id === 'hero') {
              setActiveHash("");
              window.history.replaceState(null, '', '/');
            }
            else if (id === 'projects' || id === 'contact') {
              setActiveHash(`#${id}`);
              window.history.replaceState(null, '', `/#${id}`);
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
  }, [pathname]);

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

  const toggleMobileMenu = () => {
    playTick();
    setIsOpen(!isOpen);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsOpen(false);

    if (pathname === '/') {
      e.preventDefault();
      window.history.pushState(null, '', '/');
      setActiveHash("");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav ref={navRef} className={`animate-slide-down fixed top-0 left-0 z-50 w-full px-6 md:px-12 py-6 pointer-events-none flex flex-col transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex justify-between items-start w-full">

        {/* --- Left Column: Logo & Theme (Total height exactly 64px / h-16) --- */}
        <div className="pointer-events-auto flex brutalist-shadow-static h-16">
          <Link
            href="/"
            onClick={handleLogoClick}
            className="bg-white border-4 border-black px-4 flex items-center gap-3 h-full"
          >
            <TerminalSquare size={32} className="text-black" />
            <span className="text-2xl font-black uppercase tracking-tighter">SB.</span>
          </Link>

          <button
            onClick={cycleTheme}
            aria-label="Cycle System Theme"
            title="Cycle Theme"
            className="bg-black text-white border-4 border-l-0 border-black px-3.5 flex items-center justify-center hover:bg-white hover:text-black transition-colors h-full"
          >
            <Palette size={18} />
          </button>
        </div>

        {/* --- Desktop Nav Links Block (Locked to exactly 64px / h-16 height) --- */}
        <div className="pointer-events-auto hidden md:flex items-stretch gap-1.5 bg-white border-4 border-black p-1.5 brutalist-shadow-static h-16">

          <Link
            href="/about"
            className={`relative group overflow-hidden isolate text-lg font-bold uppercase px-4 flex items-center border-2 transition-all ${pathname === '/about'
              ? 'bg-black text-white border-black'
              : 'border-transparent hover:border-black hover:bg-black hover:text-white'
              }`}
          >
            <Smoke isActive={pathname === '/about'} />
            <span className="relative z-10">About</span>
          </Link>

          <Link
            href="/#projects"
            onClick={() => setActiveHash('#projects')}
            className={`relative group overflow-hidden isolate text-lg font-bold uppercase px-4 flex items-center border-2 transition-all ${pathname === '/' && activeHash === '#projects'
              ? 'bg-black text-white border-black'
              : 'border-transparent hover:border-black hover:bg-black hover:text-white'
              }`}
          >
            <Smoke isActive={pathname === '/' && activeHash === '#projects'} />
            <span className="relative z-10">Work</span>
          </Link>

          <a
            href="https://github.com/samybit"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group overflow-hidden isolate flex items-center gap-1 text-lg font-bold uppercase px-4 border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all"
          >
            <Smoke />
            <span className="relative z-10 flex items-center gap-1">GitHub <ArrowUpRight size={20} /></span>
          </a>

          <Link
            href="/#contact"
            onClick={() => setActiveHash('#contact')}
            className={`relative group overflow-hidden isolate px-5 flex items-center text-lg font-bold uppercase border-2 transition-all ml-1 ${pathname === '/' && activeHash === '#contact'
              ? 'bg-white text-black border-black'
              : 'bg-black text-white border-black hover:bg-white hover:text-black'
              }`}
          >
            <Smoke inverse={true} isActive={pathname === '/' && activeHash === '#contact'} />
            <span className="relative z-10">Contact</span>
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={toggleMobileMenu}
          className="pointer-events-auto md:hidden bg-white border-4 border-black p-3 brutalist-shadow-static"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={32} className="text-black" /> : <Menu size={32} className="text-black" />}
        </button>
      </div>

      {/* --- Mobile Menu Dropdown --- */}
      {isOpen && (
        <div className="pointer-events-auto md:hidden w-full mt-4 bg-white border-4 border-black p-6 flex flex-col gap-2 brutalist-shadow-static">
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className={`relative group overflow-hidden isolate text-3xl font-black uppercase p-4 border-b-4 border-black transition-colors ${pathname === '/about'
              ? 'bg-black text-white'
              : 'hover:bg-black hover:text-white'
              }`}
          >
            <Smoke isActive={pathname === '/about'} />
            <span className="relative z-10">About</span>
          </Link>

          <Link
            href="/#projects"
            onClick={() => {
              setIsOpen(false);
              setActiveHash('#projects');
            }}
            className={`relative group overflow-hidden isolate text-3xl font-black uppercase p-4 border-b-4 border-black transition-colors ${pathname === '/' && activeHash === '#projects'
              ? 'bg-black text-white'
              : 'hover:bg-black hover:text-white'
              }`}
          >
            <Smoke isActive={pathname === '/' && activeHash === '#projects'} />
            <span className="relative z-10">Work</span>
          </Link>

          <a
            href="https://github.com/samybit"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group overflow-hidden isolate flex justify-between items-center text-3xl font-black uppercase p-4 border-b-4 border-black hover:bg-black hover:text-white transition-colors"
          >
            <Smoke />
            <span className="relative z-10 flex justify-between items-center w-full">GitHub <ArrowUpRight size={32} /></span>
          </a>

          <Link
            href="/#contact"
            onClick={() => {
              setIsOpen(false);
              setActiveHash('#contact');
            }}
            className={`relative group overflow-hidden isolate mt-4 text-center p-5 text-3xl font-black uppercase border-4 border-black transition-colors ${pathname === '/' && activeHash === '#contact'
              ? 'bg-white text-black'
              : 'bg-black text-white hover:bg-white hover:text-black'
              }`}
          >
            <Smoke inverse={true} isActive={pathname === '/' && activeHash === '#contact'} />
            <span className="relative z-10">Contact</span>
          </Link>
        </div>
      )}
    </nav>
  );
}