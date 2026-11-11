"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const projects = [
  {
    category: "systems",
    label: "Systems",
    title: "Hardware Diagnostic Tool",
    description:
      "Low-level diagnostics suite designed to benchmark hardware memory bandwidth and monitor telemetry in real time.",
    technologies: ["C++", "Linux", "Python"],
    links: [{ label: "GitHub", href: "https://github.com" }],
  },
  {
    category: "web",
    label: "Web",
    title: "Telemetry Dashboard",
    description:
      "Full-stack dashboard visualizing real-time hardware status metrics with zero latency and responsive charting.",
    technologies: ["JavaScript", "WebSockets", "CSS Grid"],
    links: [
      { label: "GitHub", href: "https://github.com" },
      { label: "Live Demo", href: "https://github.com" },
    ],
  },
  {
    category: "systems",
    label: "Systems",
    title: "Embedded Sensor Hub",
    description:
      "Firmware architecture for multi-channel I2C and SPI sensor acquisition with automated calibration routines.",
    technologies: ["Embedded C", "RTOS", "Altium"],
    links: [{ label: "GitHub", href: "https://github.com" }],
  },
] as const;

type ProjectFilter = "all" | "systems" | "web";
type Theme = "dark" | "light";

export default function Home() {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [theme, setTheme] = useState<Theme>("dark");
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const preferencesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!preferencesOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !preferencesRef.current?.contains(event.target)
      ) {
        setPreferencesOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPreferencesOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [preferencesOpen]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  function chooseTheme(nextTheme: Theme) {
    setTheme(nextTheme);
  }

  const visibleProjects = projects.filter(
    (project) => filter === "all" || project.category === filter,
  );

  return (
    <>
      <header className="navbar">
        <a href="#" className="nav-logo" aria-label="Portfolio home">
          portfolio<span>.</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section id="about" className="hero section">
          <div className="hero-content">
            <p className="tagline">Hello, I&apos;m</p>
            <h1 className="hero-title">Hailey</h1>
            <h2 className="hero-subtitle">Systems &amp; Software Engineer</h2>
            <p className="hero-desc">
              Building high-performance software, low-level firmware, and
              intuitive digital tools. Focused on clean architecture and
              efficient systems.
            </p>
            <div className="hero-cta">
              <a href="#projects" className="btn btn-primary">
                View Projects
              </a>
              <a href="#contact" className="btn btn-secondary">
                Get in Touch
              </a>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="section-header">
            <h2 className="section-title">Projects</h2>
            <div className="filter-controls" aria-label="Filter projects">
              {(["all", "systems", "web"] as const).map((value) => (
                <button
                  type="button"
                  key={value}
                  className={`filter-btn${filter === value ? " active" : ""}`}
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {value === "all"
                    ? "All"
                    : value === "systems"
                      ? "Systems & C++"
                      : "Web & Apps"}
                </button>
              ))}
            </div>
          </div>

          <div className="project-grid">
            {visibleProjects.map((project) => (
              <article
                className="project-card"
                data-category={project.category}
                key={project.title}
              >
                <div className="card-content">
                  <span className="project-badge">{project.label}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <ul className="tag-list">
                    {project.technologies.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                  <div className="card-links">
                    {project.links.map((link) => (
                      <a
                        href={link.href}
                        key={link.label}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label} &rarr;
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section">
          <div className="section-header">
            <h2 className="section-title">Contact</h2>
          </div>
          <div className="contact-box">
            <p>
              I&apos;m always open to discussing new engineering opportunities,
              projects, or collaborations.
            </p>
            <a href="mailto:your.email@example.com" className="btn btn-primary">
              Send Email
            </a>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Hailey. Built with Next.js.</p>
      </footer>

      <div className="preferences-toolbar" ref={preferencesRef}>
        {preferencesOpen && (
          <section
            className="preferences-menu"
            id="preferences-menu"
            role="dialog"
            aria-label="Preferences"
          >
            <h2>Preferences</h2>
            <fieldset className="theme-options">
              <legend>Appearance</legend>
              <div className="theme-options-buttons">
                {(["light", "dark"] as const).map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={`theme-option${theme === value ? " active" : ""}`}
                    aria-pressed={theme === value}
                    onClick={() => chooseTheme(value)}
                  >
                    {value === "light" ? "Light" : "Dark"}
                  </button>
                ))}
              </div>
            </fieldset>
          </section>
        )}
        <button
          type="button"
          className="preferences-trigger"
          aria-label="Open preferences"
          aria-haspopup="dialog"
          aria-expanded={preferencesOpen}
          aria-controls="preferences-menu"
          onClick={() => setPreferencesOpen((open) => !open)}
        >
          <Image
            src="/favicon.ico"
            alt=""
            width={36}
            height={36}
            unoptimized
          />
        </button>
      </div>
    </>
  );
}
