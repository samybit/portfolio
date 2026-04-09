"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Terminal, User, Mail, Link as LinkIcon, Copy, ClipboardPaste } from "lucide-react";

// --- CUSTOM GITHUB ICON ---
const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function CustomContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Track exactly what element was right-clicked to enable precise pasting
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();

      const safeX = Math.min(e.clientX, window.innerWidth - 220);
      const safeY = Math.min(e.clientY, window.innerHeight - 300); // Increased buffer for taller menu

      setPosition({ x: safeX, y: safeY });
      setTargetElement(e.target as HTMLElement);
      setIsOpen(true);
    };

    const handleClick = () => {
      if (isOpen) setIsOpen(false);
    };

    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  const handleCopy = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) navigator.clipboard.writeText(selectedText);
    setIsOpen(false);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const target = targetElement as HTMLInputElement | HTMLTextAreaElement;

      // If you right-clicked directly inside an input or textarea
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        target.focus();

        // Temporarily convert email inputs to text inputs so the browser allows pasting
        const isEmail = target.getAttribute('type') === 'email';
        if (isEmail) target.setAttribute('type', 'text');

        // Natively inject the text exactly where the cursor is resting
        target.setRangeText(text, target.selectionStart || 0, target.selectionEnd || 0, 'end');

        // Revert it back to an email input instantly
        if (isEmail) target.setAttribute('type', 'email');
      }
    } catch (e) {
      console.warn("Paste permission denied or not supported.");
    }
    setIsOpen(false);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-[9999] bg-white border-4 border-black brutalist-shadow flex flex-col w-[200px]"
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
    >
      {/* Menu Header */}
      <div className="bg-black text-white px-3 py-2 text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-default">
        <Terminal size={14} /> System_Menu
      </div>

      {/* Windows 11 Style Action Bar */}
      <div className="flex border-b-4 border-black bg-zinc-100">
        <button
          onClick={handleCopy}
          className="flex-1 flex flex-col items-center justify-center py-3 border-r-4 border-black hover:bg-black hover:text-white transition-colors group"
        >
          <Copy size={20} className="mb-1 group-hover:-translate-y-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Copy</span>
        </button>

        <button
          onClick={handlePaste}
          className="flex-1 flex flex-col items-center justify-center py-3 hover:bg-black hover:text-white transition-colors group"
        >
          <ClipboardPaste size={20} className="mb-1 group-hover:-translate-y-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Paste</span>
        </button>
      </div>

      {/* Menu Actions */}
      <button
        onClick={copyUrl}
        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-black uppercase border-b-4 border-black hover:bg-black hover:text-white transition-colors"
      >
        <LinkIcon size={16} /> Copy URL
      </button>

      <Link
        href="/about"
        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-black uppercase border-b-4 border-black hover:bg-black hover:text-white transition-colors"
      >
        <User size={16} /> Specs
      </Link>

      <a
        href="https://github.com/samybit"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-black uppercase border-b-4 border-black hover:bg-black hover:text-white transition-colors"
      >
        {/* Replaced Lucide Github with custom inline SVG */}
        <GithubIcon size={16} /> Source
      </a>

      <Link
        href="/#contact"
        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-colors"
      >
        <Mail size={16} /> Contact
      </Link>
    </div>
  );
}