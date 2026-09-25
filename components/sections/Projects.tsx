"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CascadeText, BlurIn, StaggerList, StaggerItem } from "@/components/ui/motion-primitives";
import { X, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { projects, Project } from "@/data/portfolio";
import ProjectCard from "@/components/ui/ProjectCard";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPointerDown = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const selectedProjectRef = useRef<Project | null>(null);

  useEffect(() => {
    selectedProjectRef.current = selectedProject;
    if (!selectedProject) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedProject]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    isPointerDown.current = true;
    hasDragged.current = false;
    startX.current = e.clientX;
    scrollStart.current = el.scrollLeft;
    el.style.cursor = "grabbing";
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!isPointerDown.current || !el) return;

    const distance = e.clientX - startX.current;
    if (Math.abs(distance) > 5) {
      hasDragged.current = true;
      setIsDragging(true);
      e.preventDefault();
      el.scrollLeft = scrollStart.current - distance;
    }
  };

  const handlePointerUp = () => {
    const el = scrollRef.current;
    isPointerDown.current = false;
    if (el) {
      el.style.cursor = "grab";
    }
    setIsDragging(false);
  };

  const handlePointerCancel = () => {
    const el = scrollRef.current;
    isPointerDown.current = false;
    hasDragged.current = false;
    setIsDragging(false);
    if (el) {
      el.style.cursor = "grab";
    }
  };

  const handleProjectClick = (project: Project) => {
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }
    openProject(project);
  };

  const openProject = (project: Project) => {
    selectedProjectRef.current = project;
    setSelectedProject(project);
    window.history.pushState({ modal: true }, "");
  };

  const closeModal = () => {
    if (window.history.state?.modal) {
      window.history.back();
      return;
    }
    selectedProjectRef.current = null;
    setSelectedProject(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProjectRef.current) {
        closeModal();
      }
    };
    const handlePopState = () => {
      selectedProjectRef.current = null;
      setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

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
      </div>

      <div className="relative">
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--color-background), transparent)" }}
        />

        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
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
          <StaggerList className="flex flex-nowrap gap-4 px-4 sm:px-6 lg:px-8" stagger={0.12} delay={0.3}>
            <div style={{ width: "max-content" }} className="flex flex-nowrap gap-4">
              {projects.map((project) => (
                <StaggerItem key={project.title} style={{ scrollSnapAlign: "start" }}>
                  <ProjectCard project={project} isDragging={isDragging} onClick={() => handleProjectClick(project)} />
                </StaggerItem>
              ))}
            </div>
          </StaggerList>
        </div>
      </div>

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
              {/* MODAL IMG */}
              <div
                className="relative w-full h-55 md:h-70 overflow-hidden"
                style={{
                  backgroundColor: "var(--color-background-secondary)",
                }}
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

              {/* MODAL CONTENT */}
              <div className="p-6 flex flex-col gap-4">
                <h3 className="font-heading font-bold text-xl" style={{ color: "var(--color-foreground)" }}>
                  {selectedProject.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-foreground-muted)" }}>
                  {selectedProject.description}
                </p>

                {/* TECH STACK */}
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

                {/* LINKS */}
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
