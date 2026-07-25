"use client";

// A clean, text-only rendering of the entire site content.
// No animations, no canvas, no interactive forms — just readable content.

const stack = [
  { category: "Frontend & Design", tech: ["Next.js", "React", "Angular", "TypeScript", "Tailwind CSS"] },
  { category: "Backend & Database", tech: ["NestJS", "Node.js", "Express.js", "Python", "Flask", "Postgres", "MongoDB"] },
  { category: "Architecture & DevOps", tech: ["Docker", "Kubernetes", "Jenkins", "Linux OS", "Nexus Repo"] },
  { category: "API & Testing", tech: ["Postman", "Swagger", "Jest", "Selenium", "BeautifulSoup", "REST APIs", "GraphQL"] },
  { category: "Agile & Collab", tech: ["Git", "Jira", "Trello", "Notion", "Slack"] },
];

interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
}

interface ReaderModeViewProps {
  dict: Record<string, Record<string, unknown>>;
  locale: string;
  onExit: () => void;
}

export default function ReaderModeView({ dict, locale, onExit }: ReaderModeViewProps) {
  const hero = dict.hero as Record<string, string> || {};
  const about = dict.about as Record<string, string> || {};
  const projects = dict.projects as Record<string, unknown> || {};
  const projectList = (projects.list as Project[]) || [];
  const cta = dict.cta as Record<string, string> || {};
  const isRtl = locale === "ar";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "auto",
        backgroundColor: "#fafaf9",
        color: "#111",
        fontFamily: "inherit",
      }}
    >
      {/* Exit button — floats top right */}
      <button
        onClick={onExit}
        style={{
          position: "sticky",
          top: "1.5rem",
          float: isRtl ? "left" : "right",
          marginRight: isRtl ? "0" : "2rem",
          marginLeft: isRtl ? "2rem" : "0",
          marginBottom: "-3rem",
          zIndex: 10,
          padding: "0.4rem 1.1rem",
          border: "1.5px solid #111",
          borderRadius: "4px",
          background: "#fff",
          color: "#111",
          fontWeight: 700,
          fontSize: "0.85rem",
          cursor: "pointer",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
        aria-label="Exit text-only mode"
      >
        ✕ Exit
      </button>

      {/* Centered content column */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>

        {/* ── IDENTITY ── */}
        <header style={{ marginBottom: "3rem", borderBottom: "2px solid #111", paddingBottom: "2rem" }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#666", marginBottom: "0.5rem" }}>
            {hero.availability || "Available: Full-Time / Freelance"}
          </p>
          <h1 style={{ fontSize: "3rem", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 0.5rem" }}>
            Samy Barsoum
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#444", lineHeight: 1.6, marginTop: "1rem" }}>
            Full-Stack Developer · Based in Egypt · Building end-to-end digital products.
          </p>
          <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "#555" }}>
            <a href="mailto:samy.barsoum@example.com" style={{ color: "inherit", textDecoration: "underline" }}>
              samyb.samir [at] gmail [dot] com
            </a>
            {" · "}
            <a href="https://github.com/samybit" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
              github.com/samybit
            </a>
            {" · "}
            <a href="https://www.linkedin.com/in/samy-barsoum" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
              linkedin.com/in/samy-barsoum
            </a>
          </p>
        </header>

        {/* ── ABOUT ── */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={headingStyle}>About</h2>
          <p style={bodyStyle}>{about.bioP1 || "My journey began with Python automation and scripting, building tools to scrape data and automate tasks. I then expanded into full-stack development, mastering the MERN stack to engineer dynamic applications."}</p>
          <p style={{ ...bodyStyle, marginTop: "0.75rem" }}>{about.bioP2 || "Today, I focus on building complete, containerized applications using Docker, ensuring that what runs on my machine runs everywhere."}</p>
          <p style={{ ...bodyStyle, marginTop: "0.75rem" }}>{about.bioP3 || "When I'm not coding, you can find me exploring retro tech, playing classic games, or experimenting with 3D web graphics."}</p>
        </section>

        {/* ── EDUCATION ── */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={headingStyle}>Education</h2>
          <p style={{ ...bodyStyle, fontWeight: 700 }}>{about.eduSchool || "Ain Shams University"}</p>
          <p style={bodyStyle}>{about.eduDegree || "Bachelor of Commerce (B.B.A.) // 2019 - 2023"}</p>
          <p style={{ ...bodyStyle, color: "#555", marginTop: "0.4rem" }}>{about.eduDesc || "Specialized in accounting and project management."}</p>
        </section>

        {/* ── CERTIFICATIONS ── */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={headingStyle}>Certifications</h2>
          <ul style={listStyle}>
            <li>{about.mernStack || "Web Dev & Gen AI"}</li>
            <li>{about.cs50 || "CS50x (Harvard)"}</li>
            <li>{about.dataAnalysis || "Data Analysis"}</li>
          </ul>
        </section>

        {/* ── TECHNICAL SKILLS ── */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={headingStyle}>Technical Skills</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "1rem" }}>
            {stack.map((cat) => (
              <div key={cat.category}>
                <p style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#666", marginBottom: "0.35rem" }}>
                  {cat.category}
                </p>
                <p style={{ fontSize: "0.9rem", color: "#333", lineHeight: 1.6 }}>
                  {cat.tech.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={headingStyle}>Selected Projects</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", marginTop: "1rem" }}>
            {projectList.map((project) => (
              <div key={project.id} style={{ borderLeft: "3px solid #111", paddingLeft: "1rem" }}>
                <p style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "0.25rem" }}>
                  {project.title}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "0.75rem", fontSize: "0.75rem", color: "#555", fontWeight: 600, textDecoration: "underline" }}>
                      ↗ GitHub
                    </a>
                  )}
                  {project.demo && project.demo !== "#" && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "#555", fontWeight: 600, textDecoration: "underline" }}>
                      ↗ Demo
                    </a>
                  )}
                </p>
                {project.subtitle && (
                  <p style={{ fontSize: "0.8rem", color: "#666", fontWeight: 600, marginBottom: "0.25rem" }}>
                    {project.subtitle}
                  </p>
                )}
                <p style={{ fontSize: "0.9rem", color: "#444", lineHeight: 1.6, marginBottom: "0.35rem", whiteSpace: "pre-line" }}>
                  {project.description}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#888", letterSpacing: "0.05em" }}>
                  {project.tech.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section style={{ borderTop: "2px solid #111", paddingTop: "2rem" }}>
          <h2 style={headingStyle}>Get In Touch</h2>
          <p style={bodyStyle}>{cta.description || "Currently open for freelance projects and full-time roles."}</p>
          <p style={{ marginTop: "0.75rem", fontSize: "1rem" }}>
            <strong>Email:</strong>{" "}
            <a href="mailto:samyb.samir@gmail.com" style={{ color: "#111", textDecoration: "underline" }}>
              samyb.samir [at] gmail [dot] com
            </a>
          </p>
          <p style={{ marginTop: "0.35rem", fontSize: "1rem" }}>
            <strong>LinkedIn:</strong>{" "}
            <a href="https://www.linkedin.com/in/samy-barsoum" target="_blank" rel="noopener noreferrer" style={{ color: "#111", textDecoration: "underline" }}>
              linkedin.com/in/samy-barsoum
            </a>
          </p>
          <p style={{ marginTop: "0.35rem", fontSize: "1rem" }}>
            <strong>GitHub:</strong>{" "}
            <a href="https://github.com/samybit" target="_blank" rel="noopener noreferrer" style={{ color: "#111", textDecoration: "underline" }}>
              github.com/samybit
            </a>
          </p>
          <p style={{ marginTop: "0.35rem", fontSize: "1rem" }}>
            <strong>Behance:</strong>{" "}
            <a href="https://www.behance.net/samy-barsoum" target="_blank" rel="noopener noreferrer" style={{ color: "#111", textDecoration: "underline" }}>
              behance.net/samy-barsoum
            </a>
          </p>
        </section>

        {/* Footer line */}
        <p style={{ marginTop: "3rem", fontSize: "0.75rem", color: "#aaa", textAlign: "center" }}>
          samyb.vercel.app · Text-Only Mode
        </p>
      </div>
    </div>
  );
}

const headingStyle: React.CSSProperties = {
  fontSize: "0.7rem",
  fontWeight: 900,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#111",
  borderBottom: "1px solid #ddd",
  paddingBottom: "0.4rem",
  marginBottom: "1rem",
};

const bodyStyle: React.CSSProperties = {
  fontSize: "0.975rem",
  lineHeight: 1.75,
  color: "#333",
};

const listStyle: React.CSSProperties = {
  paddingLeft: "1.25rem",
  fontSize: "0.95rem",
  lineHeight: 1.8,
  color: "#333",
};
