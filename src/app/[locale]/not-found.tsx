"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";
import { usePathname } from "next/navigation";

const translations = {
  en: {
    title: "404",
    deadEnd: "Dead End",
    desc: "The requested sector does not exist. You have wandered off the grid.",
    returnHome: "Return Home"
  },
  ar: {
    title: "٤٠٤",
    deadEnd: "نهاية مسدودة",
    desc: "القطاع المطلوب غير موجود. لقد خرجت عن الشبكة.",
    returnHome: "العودة للرئيسية"
  }
};

export default function NotFound() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] === 'ar' ? 'ar' : 'en';
  const t = translations[locale];

  return (
    <section className="h-[100dvh] flex flex-col items-center justify-center px-6 pt-20">
      <div className="brutalist-container w-full max-w-4xl flex flex-col items-center text-center p-8 md:p-12">
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
      </div>
    </section>
  );
}