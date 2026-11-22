"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const projects = [
  {
    category: "systems",
    label: "Systems",
    title: "MPPT Solar Charging Circuit",
    image: "/mppt-circuit.png",
    description: [
      "This circuit is a Maximum Point Power Tracking circuit. The main function of this circuit is to charge the 4 Samsung 35e 18650 batteries that are in a 2S-2P configuration(2 in series, 2 in parallel) with the 4 XTE-SF solar cells, which are all in series, without blowing them up. However, the reason for using an MPPT circuit over the alternatives is that it is much more efficient than other options.",
      "The fundamental reason why this is true is that the MPPT circuit tracks the output of the solar panels, compares it to the battery voltage and decides what the best output is for charging the battery. It then converts the DC charge from the original solar panel output to AC and then back to DC to get the voltage necessary for the battery. By continuously finding the best result for the battery, this circuit eliminates a lot of wasted energy.",
      "For this project I chose Texas Intruments' BQ24650RVAR because this IC has built in functionality specifically for MPPT circuits(which saves me a ton of time) and can handle the range of voltages that the solar panels have. I want to point out that I know I used 2 different types of ground. This is because the data sheet specified them as different. Moving on, the negative coefficient thermistor I used is the 103AT-2 because it was recommended in the data sheet of the IC. The thermistor is an important part of the circuit because the resistance of it is translated into temperature by the IC to make sure the circuit doesn't overheat(as the temperature increases, the resistance decreases).",
      "The LEDS connected to the STAT1 and STAT2 pins light up when charging is in progress and charging is complete, respectively. The capacitors around the circuit are used to help stabilize the voltage/reduce noise, and the resistors are either used for sensing or to lower the voltage for the other components. The MPPSET pin is used to set the max power point voltage for the solar panels. The IC compares the solar input voltage to this pin to make sure the solar cells are operating at max power. Wire 1 of the transistor connected to the MPPSET is connected to the chip enable function and is 'true' when the CE is off as indicated by the data sheet.",
      "Speaking of the transistors, the MOSFET transistors I chose are the N-channel MOSFET IRLZ44NPbF because of their gate drive which the IC has to control directly. Plus, they can handle the stress of the circuit(max of 40V). The inductor value I chose was recommended on the data sheet as 10µH so that's what I went with as a start for 1ish Amps. I would have put in the schematic that my choice of inductor was the Würth Elektronik 744311010, but I couldn't find it on Altium and the inductor really just needed to be rated for roughly 2 Amps, so I used the generic one.",
      "Finally, it's important to acknowledge that the EP or exposed pad under the IC, also known as the thermal pad, should always be soldered to the PCB board and have the vias on the thermal pad plane star-connecting to GND and ground plane for high-current power converter as recommended in the data sheet.",
    ].join(" "),
    technologies: ["Solar MPPT", "BQ24650RVAR", "Altium"],
    links: [
      {
        label: "Download schematic (.SchDoc)",
        href: "/mppt-circuit.SchDoc",
        download: true,
      },
    ],
  },
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

type Theme = "dark" | "light";

export default function Home() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [carouselPosition, setCarouselPosition] = useState(1);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isCarouselTransitioning, setIsCarouselTransitioning] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(
    null,
  );
  const [theme, setTheme] = useState<Theme>("dark");
  const [isResumeEnlarged, setIsResumeEnlarged] = useState(false);
  const [resumeZoom, setResumeZoom] = useState(1);
  const resumeDialogRef = useRef<HTMLDialogElement>(null);
  const projectDialogRef = useRef<HTMLDialogElement>(null);
  const dragStartRef = useRef<{
    pointerId: number;
    startX: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const carouselTransitionRef = useRef(false);

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

  const selectedProject =
    selectedProjectIndex === null ? null : projects[selectedProjectIndex];

  const changeResumeZoom = (amount: number) => {
    setResumeZoom((zoom) => Math.min(3, Math.max(1, zoom + amount)));
  };

  const openProject = (index: number) => {
    setSelectedProjectIndex(index);
    projectDialogRef.current?.showModal();
  };

  const closeProject = () => {
    projectDialogRef.current?.close();
    setSelectedProjectIndex(null);
  };

  const changeProject = (direction: -1 | 1) => {
    if (carouselTransitionRef.current) {
      return;
    }

    carouselTransitionRef.current = true;
    setIsCarouselTransitioning(true);
    setActiveProjectIndex(
      (index) => (index + direction + projects.length) % projects.length,
    );
    setCarouselPosition((position) => position + direction);
  };

  const finishCarouselTransition = () => {
    setIsCarouselTransitioning(false);
    carouselTransitionRef.current = false;
    setCarouselPosition((position) => {
      if (position === 0) {
        return projects.length;
      }
      if (position === projects.length + 1) {
        return 1;
      }
      return position;
    });
  };

  const startProjectDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      carouselTransitionRef.current ||
      !event.isPrimary ||
      (event.pointerType === "mouse" && event.button !== 0) ||
      (event.target instanceof Element &&
        event.target.closest("a, button:not(.project-preview)"))
    ) {
      return;
    }

    dragStartRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveProjectDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragStartRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const offset = event.clientX - drag.startX;
    if (Math.abs(offset) > 6) {
      drag.moved = true;
      setIsDragging(true);
      setDragOffset(offset);
    }
  };

  const finishProjectDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragStartRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const offset = event.clientX - drag.startX;
    const direction =
      drag.moved && Math.abs(offset) > 50
        ? offset < 0
          ? 1
          : -1
        : null;
    suppressClickRef.current = drag.moved;
    dragStartRef.current = null;
    setDragOffset(0);
    setIsDragging(false);
    if (direction !== null) {
      changeProject(direction);
    }
  };

  const cancelProjectDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current?.pointerId !== event.pointerId) {
      return;
    }

    dragStartRef.current = null;
    setDragOffset(0);
    setIsDragging(false);
    setIsCarouselTransitioning(false);
    carouselTransitionRef.current = false;
  };

  useEffect(() => {
    if (
      isPointerDown ||
      isDragging ||
      isCarouselTransitioning ||
      selectedProjectIndex !== null
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => changeProject(1), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [
    activeProjectIndex,
    isPointerDown,
    isDragging,
    isCarouselTransitioning,
    selectedProjectIndex,
  ]);

  const closeResumeDialog = () => {
    resumeDialogRef.current?.close();
    setIsResumeEnlarged(false);
  };

  return (
    <>
      <header className="navbar">
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
          </div>

          <div
            id="project-carousel"
            className={`project-carousel${isDragging ? " dragging" : ""}${isCarouselTransitioning ? " transitioning" : ""}`}
            aria-live="polite"
            onPointerDown={startProjectDrag}
            onPointerMove={moveProjectDrag}
            onPointerUp={finishProjectDrag}
            onPointerCancel={cancelProjectDrag}
            onPointerDownCapture={() => setIsPointerDown(true)}
            onPointerUpCapture={() => setIsPointerDown(false)}
            onPointerCancelCapture={() => setIsPointerDown(false)}
            onClickCapture={(event) => {
              if (suppressClickRef.current) {
                event.preventDefault();
                event.stopPropagation();
                suppressClickRef.current = false;
              }
            }}
          >
            <div
              className="project-track"
              onTransitionEnd={(event) => {
                if (
                  event.target === event.currentTarget &&
                  event.propertyName === "transform" &&
                  isCarouselTransitioning
                ) {
                  finishCarouselTransition();
                }
              }}
              style={{
                transform: `translateX(calc((100% - 88%) / 2 - ${carouselPosition * 88}% - ${carouselPosition}rem + ${dragOffset}px))`,
              }}
            >
              {[projects[projects.length - 1], ...projects, projects[0]].map(
                (project, slideIndex) => {
                const index = (slideIndex - 1 + projects.length) % projects.length;
                const isActive = slideIndex === carouselPosition;

                return (
                  <article
                    className={`project-card${isActive ? " active" : ""}`}
                    key={`${project.title}-${slideIndex}`}
                    aria-hidden={!isActive}
                    inert={!isActive}
                  >
                    <button
                      type="button"
                      className="project-preview"
                      aria-label={`View ${project.title} larger`}
                      onClick={() => openProject(index)}
                    >
                      {"image" in project ? (
                        <Image
                          className="project-image"
                          src={project.image}
                          alt={`${project.title} schematic`}
                          width={1530}
                          height={1213}
                        />
                      ) : (
                        <span className="project-placeholder" aria-hidden="true">
                          <span className="project-badge">{project.label}</span>
                          <span className="project-placeholder-title">
                            {project.title}
                          </span>
                          <span className="project-placeholder-hint">
                            Project image coming soon
                          </span>
                        </span>
                      )}
                    </button>
                    <div className="card-content">
                      <span className="project-badge">{project.label}</span>
                      <h3>{project.title}</h3>
                      <p className="project-description">{project.description}</p>
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
                            download={"download" in link ? link.download : undefined}
                            target={"download" in link ? undefined : "_blank"}
                            rel={"download" in link ? undefined : "noopener noreferrer"}
                          >
                            {link.label} &rarr;
                          </a>
                        ))}
                        <button
                          type="button"
                          className="project-details-link"
                          onClick={() => openProject(index)}
                        >
                          View project &rarr;
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="project-carousel-controls">
            <button
              type="button"
              className="carousel-arrow"
              aria-label="Previous project"
              onClick={() => changeProject(-1)}
            >
              &larr;
            </button>
            <div className="carousel-dots" aria-label="Choose a project">
              {projects.map((project, index) => (
                <button
                  type="button"
                  key={project.title}
                  className={`carousel-dot${activeProjectIndex === index ? " active" : ""}`}
                  aria-label={`Show ${project.title}`}
                  aria-current={activeProjectIndex === index ? "true" : undefined}
                  onClick={() => {
                    if (carouselTransitionRef.current || index === activeProjectIndex) {
                      return;
                    }

                    carouselTransitionRef.current = true;
                    setIsCarouselTransitioning(true);
                    setActiveProjectIndex(index);
                    setCarouselPosition(index + 1);
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              className="carousel-arrow"
              aria-label="Next project"
              onClick={() => changeProject(1)}
            >
              &rarr;
            </button>
          </div>

          <dialog
            ref={projectDialogRef}
            className="project-dialog"
            aria-label="Project details"
            onClose={() => setSelectedProjectIndex(null)}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeProject();
              }
            }}
          >
            {selectedProject && (
              <>
                <div className="project-dialog-toolbar">
                <span className="project-badge">{selectedProject.label}</span>
                <button
                  type="button"
                  className="resume-dialog-close"
                  onClick={closeProject}
                >
                  Close
                </button>
                </div>
                <div className="project-dialog-content">
                <h3>{selectedProject.title}</h3>
                {"image" in selectedProject && (
                  <Image
                    className="project-dialog-image"
                    src={selectedProject.image}
                    alt={`${selectedProject.title} schematic`}
                    width={1530}
                    height={1213}
                  />
                )}
                <p>{selectedProject.description}</p>
                <ul className="tag-list">
                  {selectedProject.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
                <div className="card-links">
                  {selectedProject.links.map((link) => (
                    <a
                      href={link.href}
                      key={link.label}
                      download={"download" in link ? link.download : undefined}
                      target={"download" in link ? undefined : "_blank"}
                      rel={"download" in link ? undefined : "noopener noreferrer"}
                    >
                      {link.label} &rarr;
                    </a>
                  ))}
                </div>
                </div>
              </>
            )}
          </dialog>
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
                closeResumeDialog();
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
                onClick={closeResumeDialog}
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
