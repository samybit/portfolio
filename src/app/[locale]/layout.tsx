import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Noto_Kufi_Arabic } from "next/font/google";
import { cookies } from "next/headers";
import "../globals.css";
import Navbar from "@/components/Navbar";
import SystemOverride from "@/components/SystemOverride";
import { ScrollModeProvider } from "@/context/ScrollModeContext";
import { AnimationProvider } from "@/context/AnimationContext";
import CustomContextMenu from "@/components/CustomContextMenu";
import GhostInTheMachine from "@/components/GhostInTheMachine";
import CurveLoader from "@/components/CurveLoader";
import ReaderModeWrapper from "@/components/ReaderModeWrapper";
import { notFound } from "next/navigation";
import { getDictionary, Locale } from "@/dictionaries/getDictionary";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const notoKufiArabic = Noto_Kufi_Arabic({ subsets: ["arabic"] });

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
  const baseUrl = 'https://samyb.vercel.app';

  return {
    metadataBase: new URL(baseUrl),
    verification: {
      google: "hV4rtyXu1OU2PEsZ2C9GnyTFakNpjmGILQvVWWV1Agc",
    },
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
      url: `${baseUrl}/${locale}`,
      siteName: isArabic ? 'سامي | معرض أعمال المطور' : 'Samy | Developer Portfolio',
      locale: isArabic ? 'ar_EG' : 'en_US',
      images: [
        {
          // Switches the image based on the locale
          url: `${baseUrl}/${isArabic ? 'og-image-ar.jpg' : 'og-image.jpg'}`,
          width: 1200,
          height: 630,
          alt: isArabic ? 'معرض أعمال سامي برسوم' : 'Samy Barsoum Portfolio',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isArabic ? 'سامي | مطور Full-Stack' : 'Samy | Full-Stack Developer',
      description: isArabic
        ? 'بناء تطبيقات ويب قوية وفعالة.'
        : 'Building brutal, effective web applications.',
      // Switches the image based on the locale
      images: [`${baseUrl}/${isArabic ? 'og-image-ar.jpg' : 'og-image.jpg'}`],
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

  const cookieStore = await cookies();
  const animationsDisabledCookie = cookieStore.get("disable-animations")?.value;
  const animationsDisabled = animationsDisabledCookie === "true";

  const fontClassName = locale === 'ar' ? notoKufiArabic.className : spaceGrotesk.className;

  // Base html classes
  const htmlClassName = [
    "scroll-smooth",
    "snap-y",
    "snap-mandatory",
    animationsDisabled ? "no-animations" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={htmlClassName} data-scroll-behavior="smooth" style={{ overflow: "hidden" }}>
      <body className={`${fontClassName} text-black antialiased selection:bg-black selection:text-white`}>
        <CurveLoader locale={locale} />
        <SystemOverride />
        <CustomContextMenu dict={dict.menu} />
        <GhostInTheMachine />
        <AnimationProvider initialDisabled={animationsDisabled}>
          <ScrollModeProvider>
            <Navbar dict={dict.nav} currentLocale={locale as Locale} />
            <ReaderModeWrapper dict={dict as Record<string, Record<string, unknown>>} locale={locale}>
              {children}
            </ReaderModeWrapper>
          </ScrollModeProvider>
        </AnimationProvider>
      </body>
    </html>
  );
}