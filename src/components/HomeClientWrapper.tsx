"use client";

import React from "react";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function HomeClientWrapper({ dict }: { dict: any }) {
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
