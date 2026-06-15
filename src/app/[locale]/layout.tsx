import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SystemOverride from "@/components/SystemOverride";
import CustomContextMenu from "@/components/CustomContextMenu";
import GhostInTheMachine from "@/components/GhostInTheMachine";
import { notFound } from "next/navigation";
import { getDictionary, Locale } from "@/dictionaries/getDictionary";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  return {
    title: {
      template: isArabic ? '%s | سامي برسوم' : '%s | Samy Barsoum',
      default: isArabic ? 'سامي | مطور Full-Stack' : 'Samy | Full-Stack Developer',
    },
    description: isArabic
      ? 'مطور Full-Stack متخصص في Next.js و React و MERN Stack. مقيم في مصر. متاح للعمل الحر أو العمل عن بعد أو الوظائف بدوام كامل.'
      : 'Full-Stack Developer specializing in Next.js, React, and the MERN stack. Based in Egypt. Available for freelance, remote work, or full-time roles.',
    keywords: isArabic
      ? ['مطور Full-Stack', 'Next.js', 'React', 'MERN', 'TypeScript', 'تطوير ويب']
      : ['Full-Stack Developer', 'Next.js', 'React', 'MERN', 'TypeScript', 'Web Development'],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'ar': '/ar',
      },
    },
    openGraph: {
      title: isArabic ? 'سامي | مطور Full-Stack' : 'Samy | Full-Stack Developer',
      description: isArabic
        ? 'بناء تطبيقات ويب قوية وفعالة.'
        : 'Building brutal, effective web applications.',
      type: 'website',
      url: `https://samyb.vercel.app/${locale}`,
      siteName: isArabic ? 'سامي | معرض أعمال المطور' : 'Samy | Developer Portfolio',
      locale: isArabic ? 'ar_EG' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: isArabic ? 'سامي | مطور Full-Stack' : 'Samy | Full-Stack Developer',
      description: isArabic
        ? 'بناء تطبيقات ويب قوية وفعالة.'
        : 'Building brutal, effective web applications.',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    manifest: '/manifest.json',
  };
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="scroll-smooth snap-y snap-mandatory" data-scroll-behavior="smooth">
      <body className={`${spaceGrotesk.className} text-black antialiased selection:bg-black selection:text-white`}>
        <SystemOverride />
        <CustomContextMenu dict={dict.menu} />
        <GhostInTheMachine />
        <Navbar dict={dict.nav} currentLocale={locale as Locale} />
        {children}
        <Footer dict={dict.footer} />
      </body>
    </html>
  );
}