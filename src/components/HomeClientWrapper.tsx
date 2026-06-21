"use client";

import React from "react";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CurtainScroller from "@/components/CurtainScroller";
import { useScrollMode } from "@/context/ScrollModeContext";

export default function HomeClientWrapper({ dict }: { dict: any }) {
  const { isCurtainMode } = useScrollMode();

  if (isCurtainMode) {
    return (
      <main className="h-[100svh] w-full overflow-hidden flex flex-col bg-black">
        <CurtainScroller>
          <Hero dict={dict.hero} />
          <Projects dict={dict.projects} />
          <CTA dict={dict.cta} />
          <div className="flex flex-col min-h-[100svh]">
            <Contact dict={dict.contact} />
            <Footer dict={dict.footer} />
          </div>
        </CurtainScroller>
      </main>
    );
  }

  // Standard Scroll Mode
  return (
    <main className="min-h-screen overflow-x-hidden flex flex-col">
      <Hero dict={dict.hero} />
      <Projects dict={dict.projects} />
      <CTA dict={dict.cta} />
      <Contact dict={dict.contact} />
      <Footer dict={dict.footer} />
    </main>
  );
}
