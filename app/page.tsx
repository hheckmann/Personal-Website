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
  const [isResumeEnlarged, setIsResumeEnlarged] = useState(false);
  const [resumeZoom, setResumeZoom] = useState(1);
  const resumeDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const dialog = resumeDialogRef.current;
    if (isResumeEnlarged && dialog && !dialog.open) {
      dialog.showModal();
    } else if (!isResumeEnlarged && dialog?.open) {
      dialog.close();
    }
  }, [isResumeEnlarged]);

  const visibleProjects = projects.filter(
    (project) => filter === "all" || project.category === filter,
  );

  const changeResumeZoom = (amount: number) => {
    setResumeZoom((zoom) => Math.min(3, Math.max(1, zoom + amount)));
  };

  return (
    <>
      <header className="navbar">
        <a href="#" className="nav-logo" aria-label="Portfolio home">
          portfolio<span>.</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#resume">Resume</a>
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

        <section id="resume" className="section">
          <div className="section-header">
            <h2 className="section-title">Resume</h2>
          </div>
          <div className="resume-viewer">
            <button
              type="button"
              className="resume-image-button"
              aria-label="Enlarge resume preview"
              aria-haspopup="dialog"
              onClick={() => {
                setResumeZoom(1);
                setIsResumeEnlarged(true);
              }}
            >
              <Image
                src="/resume-page-1.png"
                alt="Hailey Heckmann 2026 Resume"
                width={1224}
                height={1584}
                className="resume-image"
                unoptimized
              />
            </button>
            <div className="resume-actions">
              <a
                href="/Hailey-Heckmann-2026-Resume.pdf"
                className="btn btn-secondary"
                download="Hailey-Heckmann-2026-Resume.pdf"
              >
                Download PDF
              </a>
            </div>
          </div>
          <dialog
            ref={resumeDialogRef}
            className="resume-dialog"
            aria-label="Enlarged resume preview"
            onClose={() => setIsResumeEnlarged(false)}
            onCancel={() => setIsResumeEnlarged(false)}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setIsResumeEnlarged(false);
              }
            }}
          >
            <div className="resume-dialog-toolbar">
              <div className="resume-zoom-controls" aria-label="Resume zoom controls">
                <button
                  type="button"
                  aria-label="Zoom out"
                  disabled={resumeZoom <= 1}
                  onClick={() => changeResumeZoom(-0.25)}
                >
                  −
                </button>
                <span aria-live="polite">
                  {Math.round(resumeZoom * 100)}%
                </span>
                <button
                  type="button"
                  aria-label="Zoom in"
                  disabled={resumeZoom >= 3}
                  onClick={() => changeResumeZoom(0.25)}
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setResumeZoom(1)}
                  disabled={resumeZoom === 1}
                >
                  Reset
                </button>
              </div>
              <button
                type="button"
                className="resume-dialog-close"
                onClick={() => setIsResumeEnlarged(false)}
              >
                Close
              </button>
            </div>
            <div
              className="resume-dialog-content"
              onWheel={(event) => {
                if (event.ctrlKey || event.metaKey) {
                  event.preventDefault();
                  changeResumeZoom(event.deltaY < 0 ? 0.1 : -0.1);
                }
              }}
            >
              <Image
                src="/resume-page-1.png"
                alt="Hailey Heckmann 2026 Resume"
                width={1224}
                height={1584}
                className="resume-dialog-image"
                style={{ height: `${resumeZoom * 100}%` }}
                unoptimized
              />
            </div>
          </dialog>
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

      <div className="theme-toggle-container">
        <button
          type="button"
          className="theme-toggle-button"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-pressed={theme === "dark"}
          onClick={() =>
            setTheme((currentTheme) =>
              currentTheme === "dark" ? "light" : "dark",
            )
          }
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
