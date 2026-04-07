"use client";

import { useEffect } from "react";

export default function TabTitleUpdater() {
  useEffect(() => {
    // Set up the radar (Intersection Observer)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If a section is actively taking up the screen, change the title
          if (entry.isIntersecting) {
            if (entry.target.id === "projects") {
              document.title = "Work | Samy Barsoum";
            } else if (entry.target.id === "contact") {
              document.title = "Hire Me | Samy Barsoum";
            } else if (entry.target.id === "hero") {
              document.title = "Samy | Full-Stack Developer";
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
  }, []);

  return null; // This component is strictly logical, no UI
}