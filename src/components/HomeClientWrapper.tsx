"use client";

import React from "react";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/** Mirrors the Project shape defined in Projects.tsx */
interface Project {
  id?: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  images: string[];
}

/** Mirrors ProjectsDictionary defined in Projects.tsx */
interface ProjectsDictionary {
  title: string;
  swipeHint: string;
  viewAll: string;
  hide: string;
  repo: string;
  demo: string;
  offline: string;
  viewGithub: string;
  prev: string;
  next: string;
  pageFormat: string;
  newTab: string;
  list: Project[];
}

/** Full dictionary shape passed down from the locale layout */
interface HomeDict {
  hero: Record<string, string>;
  projects: ProjectsDictionary;
  cta: Record<string, string>;
  contact: Record<string, string>;
  footer: Record<string, string>;
}

export default function HomeClientWrapper({ dict }: { dict: HomeDict }) {
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
