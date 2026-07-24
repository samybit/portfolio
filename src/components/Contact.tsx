"use client";

import { Check, ArrowUpRight, Loader2, Linkedin } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { sendEmail } from "@/actions/send-email";
import { playPowerUp, prewarmAudio } from "@/utils/audio";
import DecryptText from "@/components/DecryptText";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

function StealthGliderIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="22 2 2 10 9.5 13 13 14.5 22 2" fill="currentColor" fillOpacity="0.2" />
      <polyline points="22 2 9.5 13 8 21 13 14.5" />
      <line x1="22" y1="2" x2="13" y2="14.5" />
    </svg>
  );
}

function BongoCat({ pawState }: { pawState: 'idle' | 'left' | 'right' }) {
  const isNeumorphic = useNeumorphicTheme();

  // Silhouette Backdrop:
  // Neumorphic Mode -> group-white.svg (white silhouette)
  // Brutalist / Dark Mode -> group.svg (black silhouette)
  const silhouette = isNeumorphic
    ? "/bongo/parts/group-white.svg"
    : "/bongo/parts/group.svg";

  // Line Art Variant:
  // Neumorphic Mode -> black line art (-black.png)
  // Brutalist / Dark Mode -> white line art (-white.png)
  const variant = isNeumorphic ? "black" : "white";

  const catHead = `/bongo/parts/cat-${variant}.png`;
  const mouth = `/bongo/parts/mouth-open-${variant}.png`;

  // Paw Sprite Mapping:
  // Left paw: paw-left-down is HIGHER (UP paw), paw-left-up is LOWER (DOWN paw)
  // Right paw: paw-right-up is HIGHER (UP paw), paw-right-down is LOWER (DOWN paw)
  const pawLeft = pawState === 'left'
    ? `/bongo/parts/paw-left-up-${variant}.png`     // Struck DOWN on keypress
    : `/bongo/parts/paw-left-down-${variant}.png`;  // Raised UP by default

  const pawRight = pawState === 'right'
    ? `/bongo/parts/paw-right-down-${variant}.png` // Struck DOWN on keypress
    : `/bongo/parts/paw-right-up-${variant}.png`;   // Raised UP by default

  return (
    <div
      className="absolute -top-[48px] sm:-top-[58px] right-2 sm:right-6 z-30 pointer-events-none select-none w-[130px] sm:w-[160px] aspect-[447/262] rotate-[-4.5deg] origin-bottom-right"
      aria-hidden="true"
    >
      <div className="relative w-full h-full">
        {/* Silhouette Backdrop Asset */}
        <img
          src={silhouette}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Line Art Base Head Layer */}
        <img
          src={catHead}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Line Art Mouth Layer (Always Mouth Open :D) */}
        <img
          src={mouth}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Line Art Left Paw Layer */}
        <img
          src={pawLeft}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Line Art Right Paw Layer */}
        <img
          src={pawRight}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      </div>
    </div>
  );
}

export default function Contact({ dict }: { dict: Record<string, string> }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; message?: boolean }>({});
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const isNeumorphic = useNeumorphicTheme();
  const [isFlying, setIsFlying] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [pawState, setPawState] = useState<'idle' | 'left' | 'right'>('idle');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastKeyRef = useRef<string | null>(null);
  const lastPawRef = useRef<'left' | 'right'>('left');

  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    // Ignore control / modifier keys
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) return;

    let nextPaw: 'left' | 'right';
    if (e.key === lastKeyRef.current) {
      // Same key repeated: use the SAME hand!
      nextPaw = lastPawRef.current;
    } else {
      // Different key: alternate hands!
      nextPaw = lastPawRef.current === 'left' ? 'right' : 'left';
    }

    lastKeyRef.current = e.key;
    lastPawRef.current = nextPaw;

    // Briefly reset to idle then trigger nextPaw so repeated keypress visibly re-taps
    setPawState('idle');
    requestAnimationFrame(() => {
      setPawState(nextPaw);
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setPawState('idle');
      lastKeyRef.current = null;
    }, 280);
  };

  const handleCopyEmail = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    navigator.clipboard.writeText("samyb.samir@gmail.com");
    prewarmAudio();
    playPowerUp();
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const emailErrorText = dict?.errEmail || "VALID EMAIL IS REQUIRED.";
  const messageErrorText = dict?.errMessage || "MESSAGE IS REQUIRED.";
  const useSmallErrorFont = emailErrorText.length > 25 || messageErrorText.length > 25;

  const isSubmitting = useRef(false);

  const isNameFilled = values.name.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  const isMessageValid = values.message.trim().length >= 13;

  const showEmailError = !!errors.email;
  const showMessageError = !!errors.message;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));

    if (touched[name as keyof typeof touched]) {
      let isValid = false;
      if (name === "email") isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (name === "message") isValid = value.trim().length >= 13;

      setErrors(prev => ({
        ...prev,
        [name]: isValid ? undefined : (name === "email" ? (dict?.errEmail || "VALID EMAIL IS REQUIRED.") : (dict?.errMessage || "MESSAGE IS REQUIRED."))
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name !== "email" && name !== "message") return;

    setTouched(prev => ({ ...prev, [name]: true }));

    let isValid = false;
    if (name === "email") isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (name === "message") isValid = value.trim().length >= 13;

    setErrors(prev => ({
      ...prev,
      [name]: isValid ? undefined : (name === "email" ? (dict?.errEmail || "VALID EMAIL IS REQUIRED.") : (dict?.errMessage || "MESSAGE IS REQUIRED."))
    }));
  };

  // Replaced clientAction with a synchronous DOM event handler
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // 1. Instantly stop the browser

    if (isSubmitting.current) return; // 2. Check the gate
    isSubmitting.current = true;      // 3. LOCK THE GATE IMMEDIATELY

    const formData = new FormData(e.currentTarget);
    const newErrors: { email?: string; message?: string } = {};

    if (!isEmailValid) newErrors.email = dict?.errEmail || "VALID EMAIL IS REQUIRED.";
    if (!isMessageValid) newErrors.message = dict?.errMessage || "MESSAGE IS REQUIRED.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ email: true, message: true });
      isSubmitting.current = false; // Unlock the gate so they can fix their errors
      return;
    }

    setErrors({});

    // Start the flying animation
    setIsFlying(true);

    // Wait for the animation to finish (matching the 0.6s in CSS)
    await new Promise(resolve => setTimeout(resolve, 600));

    setStatus("loading");

    const result = await sendEmail(formData);

    if (result?.error) {
      setStatus("error");
      isSubmitting.current = false; // Unlock the gate so they can try sending again
      setIsFlying(false); // Reset flying state
    } else {
      setStatus("success");
      setIsFlying(false); // Reset flying state
    }
  }

  const inputBaseStyle = "p-3 md:p-4 border-4 text-lg md:text-xl resize-none focus:outline-none transition-colors duration-150 relative z-20";

  const getInputStyle = (isValid: boolean, isError: boolean) => {
    if (isError) return `${inputBaseStyle} border-red-600 bg-red-50 text-black`;
    if (isValid) return `${inputBaseStyle} border-green-600 bg-white text-black focus:ring-4 focus:ring-green-600/20`;
    return `${inputBaseStyle} border-black bg-white text-black focus:ring-4 focus:ring-black/20`;
  };

  return (
    <section id="contact" className="snap-start min-h-[80vh] flex flex-col justify-center pt-24 pb-16 px-6 md:px-12 lg:px-24 bg-black text-white overflow-hidden">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-stretch">

        {/* --- LEFT COLUMN: TEXT & SOCIALS --- */}
        <div className="flex-1 w-full relative z-30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 sm:gap-6 mb-8 relative z-30">
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                <DecryptText text={dict?.lets || "Let's"} />
                <br />
                <DecryptText text={dict?.talk || "Talk"} />
              </h2>
              <div className="h-1.5 md:h-2 bg-current w-12 sm:w-20 md:w-28 shrink-0 self-center" />
            </div>
            <p className="text-2xl font-bold max-w-md text-zinc-400 uppercase mb-8 lg:mb-12 relative z-30">
              {dict?.description || "Drop a message to discuss a project, a full-time role, or just to say hi."}
            </p>
          </div>

          {/* Direct Email Copy Card (Mobile Only) */}
          <div className="lg:hidden bg-white text-black border-4 border-black p-4 mb-10 w-full max-w-md shadow-[6px_6px_0px_rgba(255,255,255,0.2)] flex flex-col gap-3 relative z-30 select-none">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 select-none">
                {dict?.emailAddress || "Direct Email:"}
              </span>
              <span className="text-xs font-mono font-black break-all select-all border border-zinc-200 p-2 bg-zinc-50">
                samyb.samir [at] gmail [dot] com
              </span>
            </div>
            <div className="group/copycard w-full flex items-center justify-between gap-3 pt-1">
              {/* Left Side: Standalone Envelope Icon & Animation */}
              <div
                onClick={handleCopyEmail}
                className="cursor-pointer shrink-0 flex items-center justify-center p-2 active:scale-95 transition-transform touch-manipulation group/env"
                title="Copy Email"
              >
                <style>{`
                  @keyframes contact-crumble-and-vanish {
                    0% {
                      transform: translateY(4px) scale(1) skewX(0deg) skewY(0deg);
                      transform-origin: 12px 7px;
                      clip-path: polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%);
                      opacity: 0;
                    }
                    18% {
                      transform: translateY(-2px) scale(1) skewX(0deg) skewY(0deg);
                      transform-origin: 12px 7px;
                      clip-path: polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%);
                      opacity: 1;
                    }
                    36% {
                      transform: translateY(-16px) scale(1) skewX(0deg) skewY(0deg);
                      transform-origin: 12px 7px;
                      clip-path: polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%);
                      opacity: 1;
                    }
                    50% {
                      transform: translateY(-16px) scale(1) skewX(0deg) skewY(0deg);
                      transform-origin: 12px 7px;
                      clip-path: polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%);
                      opacity: 1;
                    }
                    62% {
                      transform: translateY(-16px) scaleX(0.7) scaleY(0.85) skewX(15deg) skewY(-5deg);
                      transform-origin: 12px 7px;
                      clip-path: polygon(5% 8%, 52% 3%, 92% 6%, 96% 48%, 94% 92%, 48% 95%, 6% 91%, 3% 52%);
                      opacity: 1;
                    }
                    74% {
                      transform: translateY(-16px) scaleX(0.4) scaleY(0.55) skewX(-20deg) skewY(15deg);
                      transform-origin: 12px 7px;
                      clip-path: polygon(15% 20%, 48% 10%, 82% 16%, 88% 52%, 80% 82%, 52% 88%, 18% 80%, 12% 46%);
                      opacity: 0.9;
                    }
                    86% {
                      transform: translateY(-16px) scaleX(0.2) scaleY(0.2) skewX(25deg) skewY(-20deg);
                      transform-origin: 12px 7px;
                      clip-path: polygon(30% 32%, 50% 25%, 72% 28%, 76% 52%, 68% 70%, 48% 75%, 28% 68%, 24% 48%);
                      opacity: 0.5;
                    }
                    95%, 100% {
                      transform: translateY(-16px) scale(0);
                      transform-origin: 12px 7px;
                      clip-path: polygon(45% 46%, 50% 42%, 55% 46%, 56% 50%, 54% 54%, 50% 56%, 46% 54%, 45% 50%);
                      opacity: 0;
                    }
                  }
                  .contact-letter-crumble {
                    animation: contact-crumble-and-vanish 1.7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
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
                  <path
                    d="M3 8l9-6 9 6"
                    stroke="black"
                    strokeWidth="2"
                    fill="white"
                    className={`transition-all duration-300 ease-in-out ${
                      emailCopied ? "opacity-100" : "opacity-0 group-hover/copycard:opacity-100"
                    }`}
                  />
                  <rect
                    x="3"
                    y="8"
                    width="18"
                    height="12"
                    stroke="black"
                    strokeWidth="2"
                    fill="white"
                  />
                  <g
                    className={emailCopied ? "contact-letter-crumble" : ""}
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
                  <path
                    d="M3 8l9 6 9-6 v12 H3 z"
                    stroke="black"
                    strokeWidth="2"
                    fill="white"
                  />
                  <path d="M3 20l9-6 9 6" stroke="black" strokeWidth="2" />
                  <path
                    d="M3 8l9 6 9-6"
                    stroke="black"
                    strokeWidth="2"
                    fill="white"
                    className={`transition-all duration-300 ease-in-out ${
                      emailCopied ? "opacity-0" : "opacity-100 group-hover/copycard:opacity-0"
                    }`}
                  />
                </svg>
              </div>

              {/* Right Side: Copy Button */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex-1 py-3 px-3 border-2 border-black bg-black text-white hover:bg-white hover:text-black active:bg-white active:text-black font-mono font-black text-xs uppercase tracking-wider transition-colors text-center touch-manipulation select-none active:scale-95"
              >
                <span className="relative grid grid-cols-1 grid-rows-1 justify-items-center">
                  <span
                    className={`col-start-1 row-start-1 transition-opacity duration-300 ${
                      emailCopied ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {dict?.copied || "Copied!"}
                  </span>
                  <span
                    className={`col-start-1 row-start-1 transition-opacity duration-300 ${
                      emailCopied ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                  >
                    {dict?.copyEmail || "Copy Email"}
                  </span>
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 relative z-30">
            <h3 className="text-xl font-black uppercase tracking-widest text-zinc-400 mb-2 border-b-4 border-white pb-2 inline-block self-start">
              {dict?.networks || "Verified Networks"}
            </h3>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <InteractiveHoverButton
                href="https://linkedin.com/in/samybit/"
                target="_blank"
                rel="noopener noreferrer"
                icon={<Linkedin className="w-full h-full" fill="currentColor" />}
                aria-label={`LinkedIn${dict?.newTab || " (opens in a new tab)"}`}
              >
                LinkedIn
              </InteractiveHoverButton>
              <InteractiveHoverButton
                href="https://www.behance.net/samy-barsoum"
                target="_blank"
                rel="noopener noreferrer"
                icon={
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full scale-[1.15]">
                    <path d="M4.654 3c.461 0 .887.035 1.278.14.39.07.711.216.996.391s.497.426.641.747c.14.32.216.711.216 1.137 0 .496-.106.922-.356 1.242-.215.32-.566.606-.997.817.606.176 1.067.496 1.348.922s.461.957.461 1.563c0 .496-.105.922-.285 1.278a2.3 2.3 0 0 1-.782.887c-.32.215-.711.39-1.137.496a5.3 5.3 0 0 1-1.278.176L0 12.803V3zm-.285 3.978c.39 0 .71-.105.957-.285.246-.18.355-.497.355-.887 0-.216-.035-.426-.105-.567a1 1 0 0 0-.32-.355 1.8 1.8 0 0 0-.461-.176c-.176-.035-.356-.035-.567-.035H2.17v2.31c0-.005 2.2-.005 2.2-.005zm.105 4.193c.215 0 .426-.035.606-.07.176-.035.356-.106.496-.216s.25-.215.356-.39c.07-.176.14-.391.14-.641 0-.496-.14-.852-.426-1.102-.285-.215-.676-.32-1.137-.32H2.17v2.734h2.305zm6.858-.035q.428.427 1.278.426c.39 0 .746-.106 1.032-.286q.426-.32.53-.64h1.74c-.286.851-.712 1.457-1.278 1.848-.566.355-1.243.566-2.06.566a4.1 4.1 0 0 1-1.527-.285 2.8 2.8 0 0 1-1.137-.782 2.85 2.85 0 0 1-.712-1.172c-.175-.461-.25-.957-.25-1.528 0-.531.07-1.032.25-1.493.18-.46.426-.852.747-1.207.32-.32.711-.606 1.137-.782a4 4 0 0 1 1.493-.285c.606 0 1.137.105 1.598.355.46.25.817.532 1.102.958.285.39.496.851.641 1.348.07.496.105.996.07 1.563h-5.15c0 .58.21 1.11.496 1.396m2.24-3.732c-.25-.25-.642-.391-1.103-.391-.32 0-.566.07-.781.176s-.356.25-.496.39a.96.96 0 0 0-.25.497c-.036.175-.07.32-.07.46h3.196c-.07-.526-.25-.882-.497-1.132zm-3.127-3.728h3.978v.957h-3.978z" />
                  </svg>
                }
                aria-label={`Behance${dict?.newTab || " (opens in a new tab)"}`}
              >
                Behance
              </InteractiveHoverButton>
              <InteractiveHoverButton
                href="https://www.upwork.com/freelancers/~015e572ae8edee2be8"
                target="_blank"
                rel="noopener noreferrer"
                icon={
                  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round" overflow="visible" className="w-full h-full scale-[1.15]">
                    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
                  </svg>
                }
                aria-label={`Upwork${dict?.newTab || " (opens in a new tab)"}`}
              >
                Upwork
              </InteractiveHoverButton>
              <InteractiveHoverButton
                href="https://contra.com/samy_barsoum_akavah3d"
                target="_blank"
                rel="noopener noreferrer"
                icon={
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full scale-[1.3]">
                    <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" />
                  </svg>
                }
                aria-label={`Contra${dict?.newTab || " (opens in a new tab)"}`}
              >
                Contra
              </InteractiveHoverButton>
              <InteractiveHoverButton
                href="https://mostaql.com/u/Samy_01"
                target="_blank"
                rel="noopener noreferrer"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="7" className="w-full h-full scale-90">
                    <circle cx="12" cy="12" r="7" />
                  </svg>
                }
                aria-label={`mostaql${dict?.newTab || " (opens in a new tab)"}`}
              >
                mostaql
              </InteractiveHoverButton>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: STATIC FORM ENGINE --- */}
        <div className="flex-1 w-full relative max-w-xl mx-auto lg:mx-0">
          <form
            onSubmit={handleSubmit}
            noValidate
            onKeyDown={handleFormKeyDown}
            className="relative z-10 bg-white text-black border-4 border-black flex flex-col gap-2 md:gap-3 p-6 lg:p-8 shadow-[8px_8px_0px_rgba(255,255,255,0.3)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-300"
          >
            <BongoCat pawState={pawState} />
            {status === "success" ? (
              <div className="p-8 border-4 border-black bg-green-400 text-black text-2xl font-black uppercase text-center flex flex-col items-center gap-4 relative z-20">
                <Check size={48} className="text-black" />
                {dict?.success || "Message Received. I'll be in touch."}
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1.5 relative z-20 pb-5 md:pb-6">
                  <label htmlFor="name" className="text-lg md:text-xl font-black uppercase tracking-wide flex items-center select-none">
                    {dict?.nameLabel || "Name"}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    className={getInputStyle(isNameFilled, false)}
                    placeholder=""
                    aria-invalid="false"
                    autoComplete="name"
                  />
                </div>

                <div className="flex flex-col gap-1.5 relative z-20 pb-5 md:pb-6">
                  <label htmlFor="email" className="text-lg md:text-xl font-black uppercase tracking-wide flex items-center select-none">
                    {dict?.emailLabel || "Email"}<span className="text-red-600 ms-1 font-black">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${getInputStyle(isEmailValid, showEmailError)} text-left`}
                    placeholder={dict?.emailPlaceholder || "...@example.com"}
                    aria-invalid={showEmailError ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    autoComplete="email"
                    dir="ltr"
                  />
                  <span
                    id="email-error"
                    className={`absolute bottom-0 left-0 rtl:left-auto rtl:right-0 text-red-600 ${useSmallErrorFont ? "text-[clamp(9.2px,2.4vw,13px)]" : "text-[clamp(10px,3.2vw,14px)]"} md:text-base font-black uppercase tracking-wide whitespace-nowrap border-s-4 border-red-600 ps-2 transition-all duration-300 ease-out ${errors.email ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                  >
                    {errors.email}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 relative z-20 pb-5 md:pb-6">
                  <label htmlFor="message" className="text-lg md:text-xl font-black uppercase tracking-wide flex items-center select-none">
                    {dict?.messageLabel || "Message"}<span className="text-red-600 ms-1 font-black">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={values.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputStyle(isMessageValid, showMessageError)}
                    placeholder={dict?.messagePlaceholder || "Describe your project, an open role, or how we can collaborate..."}
                    aria-invalid={showMessageError ? "true" : "false"}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  <span
                    id="message-error"
                    className={`absolute bottom-0 left-0 rtl:left-auto rtl:right-0 text-red-600 ${useSmallErrorFont ? "text-[clamp(9.2px,2.4vw,13px)]" : "text-[clamp(10px,3.2vw,14px)]"} md:text-base font-black uppercase tracking-wide whitespace-nowrap border-s-4 border-red-600 ps-2 transition-all duration-300 ease-out ${errors.message ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                  >
                    {errors.message}
                  </span>
                </div>

                <button
                  type="submit"
                  onMouseEnter={prewarmAudio}
                  onTouchStart={prewarmAudio}
                  onClick={() => {
                    // Added gate to prevent audio from spamming on multiple clicks
                    if (status !== "loading" && !isSubmitting.current) playPowerUp();
                  }}
                  disabled={status === "loading"}
                  className={`mt-2 flex items-center justify-center py-3 px-5 text-xl md:text-2xl font-black uppercase transition-all duration-300 ease-in-out group relative z-20 ${isNeumorphic
                      ? "bg-[#e0e5ec] text-[#4b5563] rounded-2xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                      : `bg-black text-white border-4 border-black ${status === "loading"
                        ? "opacity-80 cursor-wait translate-x-1 translate-y-1 shadow-[4px_4px_0px_#000]"
                        : "shadow-[8px_8px_0px_#000] hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
                      }`
                    }`}
                >
                  <span className="transition-transform duration-300">
                    {status === "loading" ? (dict?.btnSending || "Sending...") : (dict?.btnSend || "Send Message")}
                  </span>

                  <div className={`flex items-center transition-all duration-300 ease-out ${status === "loading" || isFlying
                    ? "w-6 md:w-8 ms-3 opacity-100 overflow-visible"
                    : "w-0 opacity-0 overflow-hidden group-hover:w-6 group-active:w-6 md:group-hover:w-8 group-hover:ms-2 group-active:ms-2 md:group-hover:ms-3 group-hover:opacity-100 group-active:opacity-100"
                    }`}>
                    {status === "loading" ? (
                      <Loader2 className="w-5 h-5 md:w-6 md:h-6 shrink-0 animate-spin" />
                    ) : (
                      <StealthGliderIcon className={`w-5 h-5 md:w-6 md:h-6 shrink-0 ${isFlying ? 'animate-fly-out' : 'rtl:-scale-x-100 rtl:translate-x-full -translate-x-full rtl:group-hover:-translate-x-0 group-hover:translate-x-0 rtl:group-active:-translate-x-0 group-active:translate-x-0 transition-transform duration-300 ease-out'}`} />
                    )}
                  </div>
                </button>

                {status === "error" && (
                  <p className="text-red-600 font-black uppercase text-center mt-2 border-4 border-red-600 p-2 bg-red-100 relative z-20">
                    {dict?.errSend || "FAILED TO SEND. PLEASE TRY AGAIN."}
                  </p>
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}