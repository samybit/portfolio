import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SystemOverride from "@/components/SystemOverride";
import CustomContextMenu from "@/components/CustomContextMenu";
import GhostInTheMachine from "@/components/GhostInTheMachine";


const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://samyb.vercel.app'),
  title: "Samy | Full-Stack Developer",
  description: "Fresh graduate and web developer specializing in the MERN stack. Available for freelance, remote work, or full-time roles.",
  keywords: ["Full-Stack Developer", "MERN", "React", "Next.js", "Freelance Developer", "Web Development"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Samy | Full-Stack Developer",
    description: "Building brutal, effective web applications.",
    type: "website",
    url: 'https://samyb.vercel.app',
    siteName: 'Samy | Developer Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Samy | Full-Stack Developer",
    description: "Building brutal, effective web applications.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

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
    import('next/navigation').then(m => m.notFound());
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