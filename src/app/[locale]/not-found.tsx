"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldAlert, Gamepad2, Move3d } from "lucide-react";
import { usePathname } from "next/navigation";
import NotFoundGame from "@/components/NotFoundGame";
import WindowframeGame from "@/components/WindowframeGame";

const translations = {
  en: {
    title: "404",
    deadEnd: "Dead End",
    desc: "The requested sector does not exist. You have wandered off the grid.",
    returnHome: "Return Home",
    playGame: "Play a Game",
    playSurvival: "Play Survival",
    playFrameshift: "Play Frameshift",
    survival: "Survival",
    frameshift: "Frameshift",
    backText: "Back to Games Menu"
  },
  ar: {
    title: "٤٠٤",
    deadEnd: "نهاية مسدودة",
    desc: "القطاع المطلوب غير موجود. لقد خرجت عن الشبكة.",
    returnHome: "العودة للرئيسية",
    playGame: "إلعب لعبة",
    playSurvival: "إلعب البقاء",
    playFrameshift: "إلعب إزاحة الإطار",
    survival: "البقاء",
    frameshift: "الإزاحة",
    backText: "العودة لقائمة الألعاب"
  }
};

export default function NotFound() {
  const [gameMode, setGameMode] = useState<'none' | 'choices' | 'survival' | 'windowframe'>('none');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] === 'ar' ? 'ar' : 'en';
  const t = translations[locale];

  return (
    <section className="h-[100dvh] flex flex-col items-center justify-center px-6 pt-20">
      <div className="brutalist-container w-full max-w-4xl flex flex-col items-center text-center p-8 md:p-12 min-h-[450px] justify-center transition-all duration-500 relative">
        
        {(gameMode === 'none' || gameMode === 'choices') && (
          <div className="flex flex-col items-center animate-fade-in w-full">
            <ShieldAlert className="w-16 h-16 md:w-20 md:h-20 mb-4 text-black" />

            <h1 className="text-8xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-4">
              {t.title}
            </h1>

            <div className="bg-black text-white px-6 py-2 mb-6 transform -skew-x-6">
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-widest">
                {t.deadEnd}
              </h2>
            </div>

            <p className="text-lg md:text-2xl font-bold uppercase text-zinc-600 mb-8 max-w-2xl leading-snug">
              {t.desc}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/${locale}`}
                className="group relative inline-flex items-center justify-center bg-black text-white px-6 py-4 md:px-8 md:py-5 text-xl md:text-2xl font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black transition-colors"
              >
                {locale === 'ar' ? (
                  <ArrowRight className="ml-3 w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
                ) : (
                  <ArrowLeft className="mr-3 w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-2 transition-transform" />
                )}
                <span>{t.returnHome}</span>
              </Link>
              
              {gameMode === 'none' && (
                <button
                  onClick={() => setGameMode('choices')}
                  className="group relative inline-flex items-center justify-center bg-white text-black px-6 py-4 md:px-8 md:py-5 text-xl md:text-2xl font-black uppercase tracking-widest border-4 border-black hover:bg-black hover:text-white transition-colors cursor-pointer min-w-[280px]"
                >
                  <Gamepad2 className="mr-3 w-6 h-6 md:w-8 md:h-8 group-hover:-translate-y-1 transition-transform" />
                  <span>{t.playGame}</span>
                </button>
              )}

              {gameMode === 'choices' && (
                <div className="flex items-stretch border-4 border-black bg-black min-w-[280px]">
                  <button
                    onClick={() => setGameMode('survival')}
                    className="flex-1 group relative inline-flex items-center justify-center bg-white text-black px-4 py-4 md:px-6 md:py-5 text-base md:text-lg font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors cursor-pointer border-r-2 border-black"
                  >
                    <Gamepad2 className="mr-2 w-5 h-5 md:w-6 md:h-6 group-hover:-translate-y-1 transition-transform" />
                    <span>{t.survival}</span>
                  </button>

                  <button
                    onClick={() => setGameMode('windowframe')}
                    className="flex-1 group relative inline-flex items-center justify-center bg-white text-blue-600 px-4 py-4 md:px-6 md:py-5 text-base md:text-lg font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors cursor-pointer border-l-2 border-black"
                  >
                    <Move3d className="mr-2 w-5 h-5 md:w-6 md:h-6 group-hover:-translate-y-1 transition-transform" />
                    <span>{t.frameshift}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {(gameMode === 'survival' || gameMode === 'windowframe') && (
          <div className="w-full flex flex-col items-center animate-fade-in">
             <button 
                onClick={() => setGameMode('choices')} 
                className="mb-6 text-sm md:text-base font-black uppercase tracking-widest border-b-2 border-black hover:text-red-600 hover:border-red-600 transition-colors cursor-pointer"
             >
               {t.backText}
             </button>
             {gameMode === 'survival' && <NotFoundGame locale={locale} />}
             {gameMode === 'windowframe' && <WindowframeGame locale={locale} />}
          </div>
        )}
      </div>
    </section>
  );
}