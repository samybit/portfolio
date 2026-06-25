"use client";

import { Send, Check, ArrowUpRight, Loader2, Linkedin } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { sendEmail } from "@/actions/send-email";
import { playPowerUp, prewarmAudio } from "@/utils/audio";
import DecryptText from "@/components/DecryptText";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export default function Contact({ dict }: { dict: Record<string, string> }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; message?: boolean }>({});
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const isNeumorphic = useNeumorphicTheme();
  const [isFlying, setIsFlying] = useState(false);

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
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">

        {/* --- LEFT COLUMN: TEXT & SOCIALS --- */}
        <div className="flex-1 w-full relative z-30">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8 relative z-30">
            <DecryptText text={dict?.lets || "Let's"} />
            <br />
            <DecryptText text={dict?.talk || "Talk"} />
          </h2>
          <p className="text-2xl font-bold max-w-md text-zinc-400 uppercase mb-16 relative z-30">
            {dict?.description || "Drop a message to discuss a project, a full-time role, or just to say hi."}
          </p>

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
            className="relative z-10 bg-white text-black border-4 border-black flex flex-col gap-2 md:gap-3 p-6 lg:p-8 shadow-[8px_8px_0px_#fff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-300"
          >
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
                  className={`mt-2 flex items-center justify-center py-3 px-5 text-xl md:text-2xl font-black uppercase transition-all duration-300 ease-in-out group relative z-20 ${
                    isNeumorphic
                      ? "bg-[#e0e5ec] text-[#4b5563] rounded-2xl border border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                      : `bg-black text-white border-4 border-black ${
                          status === "loading"
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
                      <Send className={`w-5 h-5 md:w-6 md:h-6 shrink-0 ${isFlying ? 'animate-fly-out' : 'rtl:-scale-x-100 rtl:translate-x-full -translate-x-full rtl:group-hover:-translate-x-0 group-hover:translate-x-0 rtl:group-active:-translate-x-0 group-active:translate-x-0 transition-transform duration-300 ease-out'}`} />
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