import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SystemOverride from "@/components/SystemOverride";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Samy | Full-Stack Developer",
  description: "Fresh graduate and web developer specializing in the MERN stack. Available for freelance, remote work, or full-time roles.",
  keywords: ["Full-Stack Developer", "MERN", "React", "Next.js", "Freelance Developer", "Web Development"],
  openGraph: {
    title: "Samy | Full-Stack Developer",
    description: "Building brutal, effective web applications.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${spaceGrotesk.className} bg-white text-black antialiased selection:bg-black selection:text-white`}>
        <SystemOverride />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}