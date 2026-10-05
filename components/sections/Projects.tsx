'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CascadeText, BlurIn } from '@/components/ui/motion-primitives';
import { useState, useRef, useEffect, useCallback } from 'react';
import { projects, projectsTagline } from '@/data/portfolio';
import { X, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Image from 'next/image';

type Project = (typeof projects)[number];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const closeModal = useCallback(() => setSelectedProject(null), []);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();

  // RING POSITION
  const n = projects.length;
  const [pos, setPos] = useState(0);
  const active = ((pos % n) + n) % n;
  const activeProject = projects[active];

  const go = useCallback((dir: 1 | -1) => setPos((p) => p + dir), []);
  const goTo = (index: number) =>
    setPos((p) => {
      const cur = ((p % n) + n) % n;
      let d = index - cur;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      return p + d;
    });

  // SWIPE
  const start = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
    swiped.current = false;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    start.current = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true;
      go(dx < 0 ? 1 : -1);
    }
  };

  // SCROLL LOCK WHEN MODAL IS OPEN
  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  // KEYBOARD
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if (e.key === 'Escape' && selectedProject) {
        closeModal();
        return;
      }
      if (selectedProject) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedProject, closeModal, go]);

  useEffect(() => {
    const el = document.activeElement as HTMLButtonElement | null;
    if (el && dotRefs.current.includes(el)) dotRefs.current[active]?.focus();
  }, [active]);

  return (
    <section
      id="projects"
      className="py-24 md:py-32 overflow-x-clip">
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
        <BlurIn
          delay={0.75}
          blur={8}
          y={10}
          className="mt-6 max-w-xl">
          <p
            className="text-sm italic leading-relaxed sm:text-base"
            style={{ color: 'var(--color-foreground-subtle)' }}>
            {projectsTagline}
          </p>
        </BlurIn>
      </div>

      {/* PROJECT RING */}
      <BlurIn
        delay={1.2}
        blur={8}
        y={10}>
        <div
          className="ring-stage mx-auto"
          role="group"
          aria-roledescription="carousel"
          aria-label="Projects"
          style={{ '--n': n, '--pos': pos } as React.CSSProperties}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (start.current = null)}>
          <div className="ring-tilt">
            <div className="card-spin">
              {projects.map((project, i) => {
                let d = i - active;
                if (d > n / 2) d -= n;
                if (d < -n / 2) d += n;
                const dist = Math.abs(d);
                const isLive = project.status === 'live';
                const showCta = dist === 0 && isLive;
                const o = Math.max(0.25, 1 - 0.75 * (dist / (n / 2)));

                const face = isLive ? (
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    draggable={false}
                    sizes="(max-width: 640px) 74vw, (max-width: 1024px) 380px, 440px"
                    className="object-cover object-top"
                  />
                ) : (
                  <span
                    className="absolute inset-0 flex items-center justify-center text-xs font-medium uppercase tracking-widest"
                    style={{ color: 'var(--color-foreground-subtle)' }}>
                    {project.status === 'in-progress' ? 'In Progress' : 'Coming Soon'}
                  </span>
                );

                const faceStyle = {
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-background-secondary)',
                  cursor: dist === 0 && !isLive ? 'default' : 'pointer',
                };

                const onCardClick = () => {
                  if (swiped.current) {
                    swiped.current = false;
                    return;
                  }
                  if (dist !== 0) goTo(i);
                  else if (isLive) setSelectedProject(project);
                };

                return (
                  <div
                    key={project.title}
                    className="ring-card"
                    style={{ '--i': i, '--o': o } as React.CSSProperties}
                    aria-hidden={dist > 2}>
                    <button
                      type="button"
                      className="ring-face border"
                      style={faceStyle}
                      tabIndex={dist === 0 ? 0 : -1}
                      aria-label={
                        dist === 0
                          ? `${project.title}${isLive ? ', open details' : ''}`
                          : `${project.title}, bring to front`
                      }
                      onClick={onCardClick}>
                      {face}
                      {showCta && (
                        <span
                          className="ring-cta"
                          aria-hidden="true">
                          <span className="ring-cta-label">View project</span>
                        </span>
                      )}
                    </button>
                    <div
                      aria-hidden="true"
                      className="ring-face ring-face-back border"
                      style={faceStyle}
                      onClick={onCardClick}>
                      {face}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="ring-info">
            <AnimatePresence
              mode="wait"
              initial={false}>
              <motion.div
                key={active}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: reduce ? 0 : 10, filter: reduce ? 'blur(0px)' : 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: reduce ? 0 : -10, filter: reduce ? 'blur(0px)' : 'blur(8px)' }}
                transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}>
                <h3
                  className="font-heading mt-1 text-lg font-bold text-balance sm:mt-2 sm:text-2xl lg:text-3xl"
                  style={{ color: 'var(--color-foreground)' }}>
                  {activeProject.title}
                </h3>
                <p
                  className="mt-1 text-xs italic sm:mt-2 sm:text-sm lg:text-base"
                  style={{ color: 'var(--color-foreground-subtle)' }}>
                  {activeProject.shortDescription}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </BlurIn>

      {/* DOTS */}
      <BlurIn
        delay={1.3}
        blur={8}
        y={8}
        className="mt-6 flex items-center justify-center px-4 gap-0.5 sm:gap-1 md:gap-1.5">
        {projects.map((project, i) => {
          const isActive = i === active;
          return (
            <button
              key={project.title}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => goTo(i)}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              aria-label={`Go to ${project.title}`}
              aria-current={isActive}
              className="flex h-8 items-center justify-center px-0.5 sm:px-1">
              <span
                className="block rounded-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  width: isActive ? '20px' : '6px',
                  height: '6px',
                  backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-border-hover)',
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
              style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            <motion.div
              className="fixed z-50 overflow-hidden rounded-lg"
              style={{
                backgroundColor: 'var(--color-background-card)',
                top: '50%',
                left: '50%',
                width: 'calc(100% - 2rem)',
                maxWidth: '672px',
                maxHeight: '90vh',
              }}
              initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}>
              <div
                className="relative w-full h-55 md:h-70 overflow-hidden"
                style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-contain object-center"
                />

                <button
                  onClick={closeModal}
                  aria-label="Close project"
                  className="absolute top-3 right-3 z-10 p-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-125 active:scale-90"
                  style={{ color: 'var(--color-accent)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}>
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <h3
                  className="font-heading font-bold text-xl"
                  style={{ color: 'var(--color-foreground)' }}>
                  {selectedProject.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-foreground-muted)' }}>
                  {selectedProject.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {selectedProject.tech.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-md px-3 py-1.5 text-xs"
                      style={{
                        color: 'var(--color-foreground-muted)',
                        backgroundColor: 'var(--color-background-secondary)',
                      }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2.5 pt-3.5">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-base font-medium "
                      style={{ color: 'var(--color-accent-text)' }}>
                      <ExternalLink size={14} />
                      Live Site
                    </a>
                  )}

                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-base font-medium"
                      style={{ color: 'var(--color-accent-text)' }}>
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
