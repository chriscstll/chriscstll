"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ArrowLeft, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import ProjectCard from "@/components/ui/ProjectCard";
import { CascadeText, BlurIn, StaggerList, StaggerItem } from "@/components/ui/motion-primitives";
import { projects, projectsTagline } from "@/data/portfolio";

type Project = (typeof projects)[number];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* =========================================================
     SCROLL — active index detection
     ========================================================= */
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const cards = el.querySelectorAll<HTMLElement>("[data-project-card]");
    if (cards.length < 2) return;

    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    if (step <= 0) return;

    const index = Math.round(el.scrollLeft / step);
    setActiveIndex(Math.max(0, Math.min(index, projects.length - 1)));
  };

  /* =========================================================
     ARROWS — scroll to specific index
     ========================================================= */
  const goTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const cards = el.querySelectorAll<HTMLElement>("[data-project-card]");
    if (!cards[index]) return;

    const target = cards[index].offsetLeft - cards[0].offsetLeft;
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  const atStart = activeIndex === 0;
  const atEnd = activeIndex === projects.length - 1;

  /* =========================================================
     KEYBOARD — left/right arrows while section is in view
     ========================================================= */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Skip if user is typing in a form field
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      // Skip if modal is open
      if (selectedProject) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, selectedProject]);

  /* =========================================================
     DRAG — pointer handlers (existing behavior, preserved)
     ========================================================= */
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    hasDragged.current = false;
    dragStartX.current = e.clientX;
    dragStartScrollLeft.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 4) hasDragged.current = true;
    el.scrollLeft = dragStartScrollLeft.current - delta;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    const el = scrollRef.current;
    if (el) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handleProjectClick = (project: Project) => {
    // If the user just dragged, don't trigger the click
    if (hasDragged.current) return;
    setSelectedProject(project);
  };

  const closeModal = () => setSelectedProject(null);

  return (
    <section id="projects" className="py-24 md:py-32">
      {/* ===============================================
          SECTION HEADER
      ================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <CascadeText
          as="p"
          text="Work"
          className="text-xs font-medium tracking-widest uppercase mb-3"
          delay={0.1}
          stagger={0.06}
          blur={6}
          y={-8}
        />

        <CascadeText
          as="h2"
          text="Projects"
          className="section-title text-3xl sm:text-4xl md:text-5xl font-bold"
          delay={0.25}
          stagger={0.05}
          blur={8}
          y={-10}
        />

        <BlurIn delay={0.5} blur={8} y={6}>
          <div className="section-title-underline" />
        </BlurIn>

        <BlurIn delay={0.65} blur={8} y={10} className="mt-6 max-w-xl">
          <p
            className="text-sm italic leading-relaxed sm:text-base"
            style={{ color: "var(--color-foreground-subtle)" }}
          >
            {projectsTagline}
          </p>
        </BlurIn>
      </div>

      {/* ===============================================
          HORIZONTAL SCROLL
      ================================================ */}
      <div className="relative">
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, var(--color-background), transparent)",
          }}
        />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            display: "flex",
            flexDirection: "row",
            overflowX: "hidden",
            overflowY: "hidden",
            paddingBottom: "1rem",
            scrollSnapType: "none",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            touchAction: "pan-y",
            overscrollBehaviorX: "contain",
          }}
        >
          <div className="flex flex-nowrap gap-4 px-4 sm:px-6 lg:px-8" style={{ width: "max-content" }}>
            {projects.map((project) => (
              <div key={project.title} data-project-card>
                <ProjectCard project={project} isDragging={isDragging} onClick={() => handleProjectClick(project)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===============================================
          NAV — arrows + dots
      ================================================ */}
      <div className="mt-6 flex items-center justify-center gap-4 px-4 sm:gap-6">
        {/* LEFT ARROW — hidden on mobile */}
        <button
          type="button"
          onClick={prev}
          disabled={atStart}
          aria-label="Previous project"
          className="hidden items-center justify-center rounded-full border p-2 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed sm:flex"
          style={{
            borderColor: atStart ? "var(--color-border)" : "var(--color-border-hover)",
            color: atStart ? "var(--color-foreground-subtle)" : "var(--color-foreground)",
          }}
        >
          <ArrowLeft size={16} />
        </button>

        {/* DOTS */}
        <div className="flex items-center gap-1">
          {projects.map((project, i) => {
            const isActive = i === activeIndex;

            return (
              <button
                key={project.title}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to ${project.title}`}
                aria-current={isActive}
                className="group relative flex h-8 items-center justify-center px-1"
              >
                {/* Pill / dot */}
                <span
                  className="block rounded-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    width: isActive ? "20px" : "6px",
                    height: "6px",
                    backgroundColor: isActive ? "var(--color-accent)" : "var(--color-border-hover)",
                  }}
                />

                {/* Tooltip */}
                <span
                  className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{
                    backgroundColor: "var(--color-background-card)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-foreground)",
                  }}
                >
                  {project.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* RIGHT ARROW — hidden on mobile */}
        <button
          type="button"
          onClick={next}
          disabled={atEnd}
          aria-label="Next project"
          className="hidden items-center justify-center rounded-full border p-2 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed sm:flex"
          style={{
            borderColor: atEnd ? "var(--color-border)" : "var(--color-border-hover)",
            color: atEnd ? "var(--color-foreground-subtle)" : "var(--color-foreground)",
          }}
        >
          <ArrowRight size={16} />
        </button>
      </div>

      {/* ===============================================
          MODAL — unchanged
      ================================================ */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              className="fixed inset-0 z-50"
              style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            <motion.div
              className="fixed z-50 overflow-y-auto"
              style={{
                backgroundColor: "var(--color-background-card)",
                top: "50%",
                left: "50%",
                width: "calc(100% - 2rem)",
                maxWidth: "672px",
                maxHeight: "90vh",
              }}
              initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                className="relative w-full h-55 md:h-70 overflow-hidden"
                style={{ backgroundColor: "var(--color-background-secondary)" }}
              >
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-contain object-center"
                />

                <button
                  onClick={closeModal}
                  aria-label="Close project"
                  className="absolute top-3 right-3 z-10 p-2 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-125 active:scale-90"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <h3 className="font-heading font-bold text-xl" style={{ color: "var(--color-foreground)" }}>
                  {selectedProject.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-foreground-muted)" }}>
                  {selectedProject.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-3 py-1 border"
                      style={{
                        color: "var(--color-foreground-muted)",
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-background-secondary)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors duration-200 text-white"
                      style={{ backgroundColor: "var(--color-accent)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
                    >
                      <ExternalLink size={14} />
                      Live Site
                    </a>
                  )}

                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border transition-colors duration-200"
                      style={{
                        color: "var(--color-foreground)",
                        borderColor: "var(--color-border-hover)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-accent)";
                        e.currentTarget.style.color = "var(--color-accent)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-border-hover)";
                        e.currentTarget.style.color = "var(--color-foreground)";
                      }}
                    >
                      <FaGithub size={14} />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
