import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden flex flex-col">
      <Hero />
      <Projects />
      <CTA />
    </main>
  );
}