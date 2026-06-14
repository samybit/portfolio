import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SystemOverride from "@/components/SystemOverride";
import CustomContextMenu from "@/components/CustomContextMenu";
import GhostInTheMachine from "@/components/GhostInTheMachine";


const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://samyb.vercel.app'),
  title: "Samy | Full-Stack Developer",
  description: "Full-Stack Developer specializing. Available for freelance, remote work, or full-time roles.",
  keywords: ["Full-Stack Developer", "Next.js", "React", "MERN", "TypeScript", "Web Development"],
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'ar': '/ar',
    },
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: "Samy | Full-Stack Developer",
    description: "Building brutal, effective web applications.",
    type: "website",
    url: 'https://samyb.vercel.app',
    siteName: 'Samy | Developer Portfolio',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Samy | Developer Portfolio',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Samy | Full-Stack Developer",
    description: "Building brutal, effective web applications.",
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

import { notFound } from "next/navigation";
import { getDictionary, Locale } from "@/dictionaries/getDictionary";

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