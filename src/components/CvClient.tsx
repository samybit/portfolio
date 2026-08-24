"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Download, ExternalLink, FileText, Send, Sparkles } from "lucide-react";
import DecryptText from "@/components/DecryptText";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";
import Footer from "@/components/Footer";

interface CvDictionary {
  title: string;
  subtitle: string;
  returnHome: string;
  downloadPdf: string;
  openPdf: string;
  contactMe: string;
  lastUpdated: string;
  previewTitle: string;
  fallbackMsg: string;
  newTab: string;
}

interface CvClientProps {
  dict: CvDictionary;
  footerDict: any;
  locale: string;
}

export default function CvClient({ dict, footerDict, locale }: CvClientProps) {
  const isNeumorphic = useNeumorphicTheme();
  const isArabic = locale === "ar";
  const pdfUrl = "/Samy_Barsoum_CV.pdf";

  return (
    <main className={`relative min-h-screen flex flex-col justify-between pt-6 sm:pt-10 px-4 sm:px-8 md:px-12 lg:px-20 transition-colors duration-300 ${
      isNeumorphic ? "bg-[#e0e5ec] text-[#1e293b]" : "bg-black text-white"
    }`}>
      {/* Background Blueprint Grid Matrix */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
        <div 
          className={`absolute inset-0 ${isNeumorphic ? "opacity-20" : "opacity-25"}`}
          style={{
            backgroundImage: isNeumorphic
              ? "radial-gradient(rgba(0, 0, 0, 0.4) 1.2px, transparent 1.2px)"
              : "radial-gradient(rgba(255, 255, 255, 0.35) 1.2px, transparent 1.2px)",
            backgroundSize: "32px 32px"
          }}
        />
        <div 
          className={`absolute inset-0 ${isNeumorphic ? "opacity-15" : "opacity-20"}`}
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><path d='M48 42v12M42 48h12' stroke='${isNeumorphic ? '%23000000' : '%23ffffff'}' stroke-width='1.5' stroke-linecap='square'/></svg>")`,
            backgroundSize: "96px 96px"
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex-1 flex flex-col gap-6 sm:gap-8 pb-12">
        {/* Top Nav: Back to portfolio & language switch */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <Link
            href={`/${locale}`}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-black uppercase tracking-wider border-2 transition-all duration-200 ${
              isNeumorphic
                ? "bg-white text-black border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                : "bg-black text-white border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-white hover:text-black hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            }`}
          >
            {isArabic ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            <span>{dict?.returnHome || "Return to Portfolio"}</span>
          </Link>

          <div className={`hidden sm:inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-widest border-2 ${
            isNeumorphic
              ? "bg-white/80 text-zinc-700 border-black/40"
              : "bg-zinc-900/90 text-zinc-300 border-white/40"
          }`}>
            <Sparkles size={13} />
            <span>{dict?.lastUpdated || "Updated 2026"}</span>
          </div>
        </div>

        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 pb-6 transition-colors duration-300 border-current">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2.5 py-0.5 text-xs font-black uppercase tracking-widest ${
                isNeumorphic ? "bg-black text-white" : "bg-white text-black"
              }`}>
                DOCUMENT // PDF
              </span>
              <span className="text-xs font-bold tracking-wider opacity-60">
                1200 x 630 OG READY
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none">
              <DecryptText text={dict?.title || "Curriculum Vitae"} />
            </h1>
            <p className={`text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider mt-2 ${
              isNeumorphic ? "text-zinc-600" : "text-zinc-400"
            }`}>
              {dict?.subtitle || "Software Engineer & Full-Stack Developer"}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 shrink-0">
            <a
              href={pdfUrl}
              download="Samy_Barsoum_CV.pdf"
              className={`inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-black uppercase tracking-wider border-3 transition-all duration-200 ${
                isNeumorphic
                  ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                  : "bg-white text-black border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] hover:bg-zinc-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.4)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              }`}
            >
              <Download size={16} />
              <span>{dict?.downloadPdf || "Download PDF"}</span>
            </a>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-black uppercase tracking-wider border-3 transition-all duration-200 ${
                isNeumorphic
                  ? "bg-white text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                  : "bg-black text-white border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-zinc-900 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              }`}
            >
              <ExternalLink size={16} />
              <span>{dict?.openPdf || "Open Raw PDF"}</span>
              <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
            </a>

            <Link
              href={`/${locale}#contact`}
              className={`inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-black uppercase tracking-wider border-3 transition-all duration-200 ${
                isNeumorphic
                  ? "bg-[#d1d9e6] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-200"
                  : "bg-zinc-900 text-white border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-zinc-800"
              }`}
            >
              <Send size={15} />
              <span>{dict?.contactMe || "Get in Touch"}</span>
            </Link>
          </div>
        </div>

        {/* Embedded Interactive PDF Viewer with Mobile Fallback / Companion Preview */}
        <div className="flex flex-col gap-4">
          {/* Main Viewer Card */}
          <div className={`w-full overflow-hidden border-4 transition-all duration-300 ${
            isNeumorphic
              ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              : "border-white bg-zinc-950 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
          }`}>
            {/* Window titlebar header */}
            <div className={`flex items-center justify-between px-4 py-2.5 border-b-4 select-none ${
              isNeumorphic
                ? "bg-black text-white border-black"
                : "bg-white text-black border-white"
            }`}>
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span className="text-xs font-black uppercase tracking-wider">
                  Samy_Barsoum_CV.pdf
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest opacity-80">
                [ 100% VECTOR PDF ]
              </span>
            </div>

            {/* Desktop / Tablet: Embedded PDF Object / Iframe */}
            <div className="hidden md:block w-full h-[78vh] lg:h-[86vh] bg-zinc-100">
              <object
                data={`${pdfUrl}#view=FitH&toolbar=1`}
                type="application/pdf"
                className="w-full h-full"
                title="Samy Barsoum CV PDF"
              >
                <iframe
                  src={`${pdfUrl}#view=FitH`}
                  className="w-full h-full"
                  title="Samy Barsoum CV Frame"
                />
              </object>
            </div>

            {/* Mobile View: High-Res OG Snapshot Banner + Direct Action Buttons */}
            <div className="block md:hidden p-4">
              <div className="relative w-full aspect-[1200/630] border-2 border-black dark:border-white overflow-hidden bg-white mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <Image
                  src="/og-cv.jpg"
                  alt="Samy Barsoum CV Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover object-top"
                  priority
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <a
                  href={pdfUrl}
                  download="Samy_Barsoum_CV.pdf"
                  className={`w-full flex items-center justify-center gap-2 p-3 text-sm font-black uppercase border-3 transition-all ${
                    isNeumorphic
                      ? "bg-black text-white border-black active:bg-zinc-800"
                      : "bg-white text-black border-white active:bg-zinc-200"
                  }`}
                >
                  <Download size={18} />
                  <span>{dict?.downloadPdf || "Download Full PDF"}</span>
                </a>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 p-3 text-sm font-black uppercase border-3 transition-all ${
                    isNeumorphic
                      ? "bg-white text-black border-black active:bg-zinc-100"
                      : "bg-black text-white border-white active:bg-zinc-900"
                  }`}
                >
                  <ExternalLink size={18} />
                  <span>{dict?.openPdf || "Open in Browser Viewer"}</span>
                  <span className="sr-only">{dict?.newTab || " (opens in a new tab)"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer dict={footerDict} />
    </main>
  );
}
