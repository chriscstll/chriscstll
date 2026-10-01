"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
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
  const pointerId = useRef<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const pendingIndexRef = useRef<number | null>(null);

  /* SCROLL - DETECT ACTIVE INDEX */
  const handleScroll = () => {
    if (pendingIndexRef.current !== null) return;

    const el = scrollRef.current;
    if (!el) return;

    const cards = el.querySelectorAll<HTMLElement>("[data-project-card]");
    if (cards.length === 0) return;

    const startOffset = cards[0].offsetLeft;
    const scrollLeft = el.scrollLeft;

    let closest = 0;
    let minDiff = Infinity;

    cards.forEach((card, i) => {
      const diff = Math.abs(card.offsetLeft - startOffset - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    });

    setActiveIndex(closest);
  };

  /* ARROWS */
  const goTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const cards = el.querySelectorAll<HTMLElement>("[data-project-card]");
    if (!cards[index]) return;

    setActiveIndex(index);
    pendingIndexRef.current = index;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const startOffset = cards[0].offsetLeft;
    const target = Math.min(cards[index].offsetLeft - startOffset, maxScroll);

    el.scrollTo({ left: target, behavior: "smooth" });

    window.setTimeout(() => {
      pendingIndexRef.current = null;
    }, 600);
  };

  // SCROLL LOCK WHEN MODAL IS OPEN
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  /* KEYBOARD */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      if (e.key === "Escape" && selectedProject) {
        closeModal();
        return;
      }
      if (selectedProject) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(Math.max(0, activeIndex - 1));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(Math.min(projects.length - 1, activeIndex + 1));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, selectedProject]);

  // DEADSPACE AT THE END OF CARDS
  const [spacerWidth, setSpacerWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      const el = scrollRef.current;
      if (!el) return;
      const cards = el.querySelectorAll<HTMLElement>("[data-project-card]");
      if (cards.length === 0) return;
      const cardWidth = cards[0].offsetWidth;
      setSpacerWidth(Math.max(0, el.clientWidth - cardWidth));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [projects.length]);

  /* DRAG */
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    dragStartX.current = e.clientX;
    dragStartScrollLeft.current = el.scrollLeft;
    hasDragged.current = false;
    pointerId.current = e.pointerId;

    setIsDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    if (pointerId.current !== e.pointerId) return;

    const delta = e.clientX - dragStartX.current;

    // Only start dragging after 4px of movement
    if (!hasDragged.current && Math.abs(delta) > 4) {
      hasDragged.current = true;
      setIsDragging(true);
      try {
        el.setPointerCapture(e.pointerId);
      } catch {}
    }

    if (hasDragged.current) {
      el.scrollLeft = dragStartScrollLeft.current - delta;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (el && pointerId.current === e.pointerId) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {}
    }
    pointerId.current = null;
    setIsDragging(false);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerUp(e);
  };

  const handleProjectClick = (project: Project) => {
    if (hasDragged.current) return;
    setSelectedProject(project);
  };

  const closeModal = () => setSelectedProject(null);

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <CascadeText
          as="h2"
          text="Projects"
          className="section-title text-3xl sm:text-4xl md:text-5xl font-bold"
          delay={0.25}
          stagger={0.05}
          blur={8}
          y={-10}
        />

        <BlurIn delay={0.75} blur={8} y={10} className="mt-6 max-w-xl">
          <p
            className="text-sm italic leading-relaxed sm:text-base"
            style={{ color: "var(--color-foreground-subtle)" }}
          >
            {projectsTagline}
          </p>
        </BlurIn>
      </div>

      {/* HORIZONTAL SCROLL */}
      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" />

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
            overflowX: "scroll",
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
          <StaggerList
            className="flex flex-nowrap gap-4 px-4 sm:px-6 lg:px-8"
            style={{ width: "max-content" }}
            stagger={0.12}
            delay={1.0}
          >
            {projects.map((project) => (
              <StaggerItem key={project.title} data-project-card>
                <ProjectCard project={project} isDragging={isDragging} onClick={() => handleProjectClick(project)} />
              </StaggerItem>
            ))}
            <div aria-hidden="true" style={{ width: spacerWidth, flexShrink: 0 }} />
          </StaggerList>
        </div>
      </div>

      {/* DOTS */}
      <BlurIn
        delay={1.6}
        blur={8}
        y={8}
        className="mt-6 flex items-center justify-center gap-0.5 px-4 sm:gap-1 md:gap-1.5"
      >
        {projects.map((project, i) => {
          const isActive = i === activeIndex;

          return (
            <button
              key={project.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${project.title}`}
              aria-current={isActive}
              className="flex h-8 items-center justify-center px-0.5 sm:px-1"
            >
              <span
                className="block rounded-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  width: isActive ? "20px" : "6px",
                  height: "6px",
                  backgroundColor: isActive ? "var(--color-accent)" : "var(--color-border-hover)",
                }}
              />
            </button>
          );
        })}
      </BlurIn>

      {/* MODAL */}
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
              className="fixed z-50 overflow-hidden rounded-lg"
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
                  className="absolute top-3 right-3 z-10 p-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-125 active:scale-90"
                  style={{ color: "var(--color-accent-hover)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-accent-hover)")}
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
                      className="inline-flex items-center rounded-sm px-3 py-1.5 text-xs"
                      style={{
                        color: "var(--color-foreground-muted)",
                        boxShadow: "inset 0 1px 0 var(--color-border-hover), inset 0 -1px 0 var(--color-border-hover)",
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
                      className="group inline-flex items-center gap-2 rounded-md border border-transparent px-4 py-2 text-sm font-medium transition-all duration-300 hover:border-accent"
                      style={{ color: "var(--color-accent-text)" }}
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
                      className="group inline-flex items-center gap-2 rounded-md border border-transparent px-4 py-2 text-sm font-medium transition-all duration-300 hover:border-accent"
                      style={{ color: "var(--color-accent-text)" }}
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
