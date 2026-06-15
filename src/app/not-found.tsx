import "./globals.css";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '404 - Not Found',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootNotFound() {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`${spaceGrotesk.className} text-black antialiased selection:bg-black selection:text-white bg-white`}>
        <section className="h-[100dvh] flex flex-col items-center justify-center px-6">
          <div className="brutalist-container w-full max-w-4xl flex flex-col items-center text-center p-8 md:p-12">
            <ShieldAlert className="w-16 h-16 md:w-20 md:h-20 mb-4 text-black" />

            <h1 className="text-8xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-4">
              404
            </h1>

            <div className="bg-black text-white px-6 py-2 mb-6 transform -skew-x-6">
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-widest">
                Dead End
              </h2>
            </div>

            <p className="text-lg md:text-2xl font-bold uppercase text-zinc-600 mb-8 max-w-2xl leading-snug">
              The requested sector does not exist. You have wandered off the grid.
            </p>

            <Link
              href="/en"
              className="group relative inline-flex items-center justify-center bg-black text-white px-6 py-4 md:px-8 md:py-5 text-xl md:text-2xl font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black transition-colors"
            >
              <ArrowLeft className="mr-3 w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-2 transition-transform" />
              <span>Return Home</span>
            </Link>
          </div>
        </section>
      </body>
    </html>
  );
}