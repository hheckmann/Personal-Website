"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

const resumeExperience = [
  {
    company: "Capgemini",
    location: "Atlanta, GA",
    title: "Software Engineer Intern",
    duration: "June 2026 – July 2026",
    technologies: ["Python", "C++", "Azure", "MCP", "Node.js"],
    bullets: [
      "Expanded existing agentic AI frameworks for Coca-Cola bottlers by developing a Model Context Protocol (MCP) server on Azure with 80+ tools, enabling natural-language models to execute critical system tests every morning.",
      "Researched Capgemini’s internally produced agentic AI framework versus open-source frameworks to identify recommendations and market gaps for the Enterprise Architect team.",
      "Executed low-level C++ and Python software test cases using strict quality assurance practices to ensure algorithmic correctness and system reliability.",
      "Implemented automated testing scripts and performance profiling tools to identify bottlenecks and maintain enterprise reliability under high-concurrency workloads.",
    ],
  },
  {
    company: "Gulfstream Aerospace",
    location: "Savannah, GA",
    title: "Avionics Engineer Intern",
    duration: "January 2026 – May 2026",
    technologies: ["MATLAB", "Jira", "V&V"],
    bullets: [
      "Improved efficiency of an Electrical Load calculation app by up to 50% by identifying software redundancies and data storage waste in a MATLAB app design workflow.",
      "Investigated global field problem reports by reproducing avionics anomalies in a flight simulator environment to isolate root causes and validate system behavior.",
      "Executed rigorous requirements verification and validation testing for integrated avionics systems to ensure compliance with aerospace performance standards.",
    ],
  },
  {
    company: "Create Labs",
    location: "Athens, GA",
    title: "Chief Engineer",
    duration: "August 2024 – December 2025",
    technologies: ["Product Development", "PCB Design", "Embedded Systems"],
    bullets: [
      "Led design-for-manufacturing and product development across multiple client projects while managing five-figure budgets and delivering scalable engineering solutions.",
      "Coordinated a 28+ member multidisciplinary team, establishing standard operating procedures for lab operations, technical training, and client engagement.",
      "Project-managed 7 employees to develop a biometric measurement device and designed modular mechanical housing for 9 industry-standard devices under tight constraints.",
      "Provided hands-on engineering support in custom PCB design, data storage, onboard processing, app development, and embedded systems programming.",
    ],
  },
  {
    company: "Small Satellite Research Lab",
    location: "Athens, GA",
    title: "Electrical Engineer",
    duration: "January 2025 – December 2025",
    technologies: ["Power Systems", "PCB Rework", "MPPT"],
    bullets: [
      "Tested and assembled a solar power system on a 2U CubeSat, saving $13,000+ by soldering and desoldering damaged PCBs to salvage custom hardware.",
      "Analyzed component performance data to maximize satellite power efficiency within mission constraints.",
      "Designed MPPT circuit schematics and selected components for rugged temperatures, cutting the project timeline by 71% and improving battery life by approximately 30%.",
    ],
  },
] as const;

type ProjectFilter = "all" | "systems" | "web";
type Theme = "dark" | "light";

export default function Home() {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

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

          <div className="resume-box">
            <div className="resume-copy">
              <p>
                My experience blends software engineering, avionics, embedded
                systems, and product development — with a focus on building
                reliable, high-impact solutions.
              </p>

              <div className="resume-experience">
                {resumeExperience.map((entry) => (
                  <article className="resume-entry" key={entry.company}>
                    <div className="resume-entry-header">
                      <div>
                        <h3>{entry.company}</h3>
                        <p className="resume-role">{entry.title}</p>
                      </div>
                      <div className="resume-meta">
                        <span>{entry.location}</span>
                        <span>{entry.duration}</span>
                      </div>
                    </div>

                    <ul className="resume-bullets">
                      {entry.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>

                    <div className="resume-tech-list">
                      {entry.technologies.map((technology) => (
                        <span key={technology}>{technology}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="resume-actions">
              <a
                href="/Hailey-Heckmann-2026-Resume.pdf"
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
              <a
                href="/Hailey-Heckmann-2026-Resume.pdf"
                className="btn btn-secondary"
                download="Hailey-Heckmann-2026-Resume.pdf"
              >
                Download PDF
              </a>
            </div>
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
