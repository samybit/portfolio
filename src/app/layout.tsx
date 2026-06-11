import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
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
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Samy | Full-Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Samy | Full-Stack Developer",
    description: "Building brutal, effective web applications.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth snap-y snap-mandatory" data-scroll-behavior="smooth">
      <body className={`${spaceGrotesk.className} text-black antialiased selection:bg-black selection:text-white`}>
        <SystemOverride />
        <CustomContextMenu />
        <GhostInTheMachine />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}