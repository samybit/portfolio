"use client";

import { useEffect } from "react";

export default function TabTitleUpdater({ dict }: { dict: any }) {
  useEffect(() => {
    // Set up the radar (Intersection Observer)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If a section is actively taking up the screen, change the title
          if (entry.isIntersecting) {
            if (entry.target.id === "projects") {
              document.title = dict?.projects || "Work | Samy Barsoum";
            } else if (entry.target.id === "contact") {
              document.title = dict?.contact || "Contact | Samy Barsoum";
            } else if (entry.target.id === "hero") {
              document.title = dict?.hero || "Samy | Full-Stack Developer";
            }
          }
        });
      },
      // threshold: 0.5 means "trigger when 50% of the section is visible"
      { threshold: 0.5 }
    );

    // Grab the sections from the page
    const hero = document.getElementById("hero");
    const projects = document.getElementById("projects");
    const contact = document.getElementById("contact");

    // Start watching them
    if (hero) observer.observe(hero);
    if (projects) observer.observe(projects);
    if (contact) observer.observe(contact);

    // Cleanup the observer if the component unmounts
    return () => observer.disconnect();
  }, [dict]);

  return null; // This component is strictly logical, no UI
}