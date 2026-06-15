"use client";

import { Send, Check, ArrowUpRight, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { sendEmail } from "@/actions/send-email";
import { playPowerUp, prewarmAudio } from "@/utils/audio";
import DecryptText from "@/components/DecryptText";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";

export default function Contact({ dict }: { dict: Record<string, string> }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const isNeumorphic = useNeumorphicTheme();
  const [isFlying, setIsFlying] = useState(false);

  const isSubmitting = useRef(false);

  const isNameFilled = values.name.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  const isEmailFilled = values.email.trim().length > 0;
  const isMessageValid = values.message.trim().length >= 13;

  // Show live red error if the user has typed something in email but it's not valid yet, OR if the form was submitted with errors
  const showEmailError = !!errors.email || (isEmailFilled && !isEmailValid);
  const showMessageError = !!errors.message;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      let isValid = false;
      if (name === "email") isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (name === "message") isValid = value.trim().length >= 13;

      if (isValid) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
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
    if (isValid) return `${inputBaseStyle} border-black bg-black text-white focus:ring-4 focus:ring-black/20`;
    return `${inputBaseStyle} border-black bg-white text-black focus:ring-4 focus:ring-black/20`;
  };

  return (
    <section id="contact" className="snap-start min-h-[100dvh] flex flex-col justify-center pt-24 pb-16 px-6 md:px-12 lg:px-24 bg-black text-white overflow-hidden">
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
              <a href="https://linkedin.com/in/samybit/" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 border-4 border-white px-6 py-4 text-xl font-black uppercase hover:bg-white hover:text-black transition-colors">
                <span>LinkedIn</span>
                <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
              </a>
              <a href="https://www.upwork.com/freelancers/~015e572ae8edee2be8" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 border-4 border-white px-6 py-4 text-xl font-black uppercase hover:bg-white hover:text-black transition-colors">
                <span>Upwork</span>
                <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
              </a>
              <a href="https://contra.com/samy_barsoum_akavah3d" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 border-4 border-white px-6 py-4 text-xl font-black uppercase hover:bg-white hover:text-black transition-colors">
                <span>Contra</span>
                <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
              </a>
              <a href="https://mostaql.com/u/Samy_01" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 border-4 border-white px-6 py-4 text-xl font-black uppercase hover:bg-white hover:text-black transition-colors">
                <span>mostaql</span>
                <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: STATIC FORM ENGINE --- */}
        <div className="flex-1 w-full relative max-w-xl mx-auto lg:mx-0">

          <form
            onSubmit={handleSubmit}
            noValidate
            className="relative z-10 bg-white text-black border-4 border-black flex flex-col gap-2 md:gap-3 p-6 lg:p-8 shadow-[8px_8px_0px_#fff]"
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
                    className={`${getInputStyle(isEmailValid, showEmailError)} text-left`}
                    placeholder={dict?.emailPlaceholder || "...@example.com"}
                    aria-invalid={showEmailError ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    autoComplete="email"
                    dir="ltr"
                  />
                  <span
                    id="email-error"
                    className={`absolute bottom-0 left-0 rtl:left-auto rtl:right-0 text-red-600 text-sm md:text-base font-black uppercase tracking-wide border-s-4 border-red-600 ps-2 transition-all duration-300 ease-out ${errors.email ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
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
                    className={getInputStyle(isMessageValid, showMessageError)}
                    placeholder={dict?.messagePlaceholder || "Describe your project, an open role, or how we can collaborate..."}
                    aria-invalid={showMessageError ? "true" : "false"}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  <span
                    id="message-error"
                    className={`absolute bottom-0 left-0 rtl:left-auto rtl:right-0 text-red-600 text-sm md:text-base font-black uppercase tracking-wide border-s-4 border-red-600 ps-2 transition-all duration-300 ease-out ${errors.message ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
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
                            ? "opacity-80 cursor-wait translate-x-1 translate-y-1 shadow-[4px_4px_0px_#000] rtl:translate-x-[-4px] rtl:shadow-[-4px_4px_0px_#000]"
                            : "shadow-[8px_8px_0px_#000] hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2 rtl:shadow-[-8px_8px_0px_#000] rtl:hover:-translate-x-1 rtl:hover:shadow-[-4px_4px_0px_#000] rtl:active:-translate-x-2"
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