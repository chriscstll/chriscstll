'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { FaReact, FaGitAlt, FaHtml5, FaCss3Alt, FaJs, FaFigma, FaGithub } from 'react-icons/fa';
import { SiVuedotjs, SiNextdotjs, SiTypescript, SiTailwindcss, SiVercel, SiFramer, SiSass } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { skills, projects, skillsTagline } from '@/data/portfolio';
import { CascadeText, BlurIn, StaggerList, StaggerItem } from '@/components/ui/motion-primitives';

const iconMap: Record<string, React.ReactNode> = {
  HTML: <FaHtml5 />,
  CSS: <FaCss3Alt />,
  JavaScript: <FaJs />,
  TypeScript: <SiTypescript />,
  'Next.js': <SiNextdotjs />,
  'Tailwind CSS': <SiTailwindcss />,
  SCSS: <SiSass />,
  React: <FaReact />,
  'Vue.js': <SiVuedotjs />,
  'Framer Motion': <SiFramer />,
  Git: <FaGitAlt />,
  GitHub: <FaGithub />,
  Figma: <FaFigma />,
  'VS Code': <VscVscode />,
  Vercel: <SiVercel />,
};

const groupLabels: Record<string, string> = {
  language: 'Languages',
  frameworks: 'Frameworks',
  libraries: 'Libraries',
  tools: 'Tools',
};

const skillBaseAngles: Record<keyof typeof skills, number> = {
  language: 270,
  frameworks: 0,
  libraries: 90,
  tools: 180,
};

const groupPillTransforms: Record<keyof typeof skills, string> = {
  frameworks: 'translate(0, -50%)',
  libraries: 'translate(-50%, 0)',
  tools: 'translate(-100%, -50%)',
  language: 'translate(-50%, -100%)',
};

const marqueeItems = [
  { name: 'React', icon: <FaReact /> },
  { name: 'Next.js', icon: <SiNextdotjs /> },
  { name: 'TypeScript', icon: <SiTypescript /> },
  { name: 'JavaScript', icon: <FaJs /> },
  { name: 'Tailwind CSS', icon: <SiTailwindcss /> },
  { name: 'Git', icon: <FaGitAlt /> },
  { name: 'VS Code', icon: <VscVscode /> },
  { name: 'Vercel', icon: <SiVercel /> },
  { name: 'HTML', icon: <FaHtml5 /> },
  { name: 'CSS', icon: <FaCss3Alt /> },
];

const toRad = (deg: number) => (deg * Math.PI) / 180;

const getCoords = (cx: number, cy: number, angle: number, radius: number) => ({
  x: cx + radius * Math.cos(toRad(angle)),
  y: cy + radius * Math.sin(toRad(angle)),
});

const getSkillAngles = (group: keyof typeof skills, baseAngle: number, count: number): number[] => {
  if (count === 1) return [baseAngle];

  const isFramework = group === 'frameworks';
  const minSpread = isFramework ? 50 : 35;
  const maxSpread = isFramework ? 80 : 60;
  const perItem = isFramework ? 22 : 18;

  const spread = Math.min(maxSpread, Math.max(minSpread, count * perItem));
  const step = spread / (count - 1);

  return Array.from({ length: count }, (_, i) => baseAngle - spread / 2 + i * step);
};

export default function Skills() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);

  const [flowTarget, setFlowTarget] = useState<{ group: string; skill: string } | null>(null);
  const [flowKey, setFlowKey] = useState(0);

  useEffect(() => {
    if (!containerEl || isMobile) return;

    const measure = () => {
      setSize({ w: containerEl.offsetWidth, h: containerEl.offsetHeight });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(containerEl);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [containerEl, isMobile]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    setMounted(true);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile || !containerEl) return;
    const element = containerRef.current;
    if (!element) return;

    const measure = () => {
      setSize({ w: element.offsetWidth, h: element.offsetHeight });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [isMobile]);

  const cx = size.w / 2;
  const cy = size.h / 2;
  const minDim = Math.min(size.w, size.h);
  const SKILL_RADIUS = isMobile
    ? Math.max(90, Math.min(135, minDim / 2 - 45))
    : Math.min(285, Math.max(150, size.w * 0.27));
  const GROUP_RADIUS = isMobile ? Math.max(55, SKILL_RADIUS * 0.55) : Math.min(120, SKILL_RADIUS * 0.45);
  const ICON_SIZE = isMobile ? 36 : 48;
  const ICON_RADIUS = ICON_SIZE / 2;
  const connectedProjects = activeSkill
    ? projects.filter((p) => p.status === 'live' && p.tech.includes(activeSkill))
    : [];

  const handleSkillClick = (skill: string) => {
    const hasProjects = projects.some((p) => p.status === 'live' && p.tech.includes(skill));
    if (!hasProjects) return;

    const next = activeSkill === skill ? null : skill;
    setActiveSkill(next);

    if (next) {
      const group = (Object.keys(skills) as Array<keyof typeof skills>).find((g) => skills[g].includes(skill));
      if (group) {
        setFlowTarget({ group, skill });
        setFlowKey((k) => k + 1);
      }
    } else {
      setFlowTarget(null);
    }
  };

  const toggleExpanded = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    setPulseKey((k) => k + 1);
    if (!next) {
      setActiveSkill(null);
      setFlowTarget(null);
    }
  };

  const groupNodes = (Object.keys(skills) as Array<keyof typeof skills>).map((group) => ({
    group,
    coords: getCoords(cx, cy, skillBaseAngles[group], GROUP_RADIUS),
  }));

  const allSkillNodes = (Object.keys(skills) as Array<keyof typeof skills>).flatMap((group) => {
    const baseAngle = skillBaseAngles[group];
    const list = skills[group];
    const angles = getSkillAngles(group, baseAngle, list.length);

    return list.map((skill, i) => ({
      skill,
      group,
      angle: angles[i],
      coords: getCoords(cx, cy, angles[i], SKILL_RADIUS),
    }));
  });

  return (
    <section
      id="skills"
      className="section-container">
      <div className="mb-12">
        <CascadeText
          as="h2"
          text="Skills"
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
            {skillsTagline}
          </p>
        </BlurIn>
      </div>
      <div className="w-full mb-12 sm:mb-16 flex justify-center">
        {!mounted ? (
          <div className="w-full h-110" />
        ) : isMobile ? (
          // GRID ON MOBILE
          <BlurIn
            delay={1.2}
            blur={8}
            y={12}
            className="w-full">
            <StaggerList
              className="w-full space-y-4"
              stagger={0.12}
              delay={0.1}>
              {(Object.keys(skills) as Array<keyof typeof skills>).map((group) => (
                <StaggerItem
                  key={group}
                  className="rounded-lg p-4">
                  <h3
                    className="mb-3 text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--color-foreground-subtle)' }}>
                    {groupLabels[group]}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {skills[group].map((skill) => {
                      const hasProjects = projects.some((p) => p.status === 'live' && p.tech.includes(skill));
                      const isActive = activeSkill === skill;

                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillClick(skill)}
                          disabled={!hasProjects}
                          className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors duration-200"
                          style={{
                            backgroundColor: isActive ? 'var(--color-accent-subtle)' : 'var(--color-background)',
                            borderColor: isActive
                              ? 'var(--color-accent)'
                              : hasProjects
                                ? 'var(--color-border-hover)'
                                : 'var(--color-border)',
                            color: isActive
                              ? 'var(--color-accent)'
                              : hasProjects
                                ? 'var(--color-foreground)'
                                : 'var(--color-foreground-subtle)',
                            cursor: hasProjects ? 'pointer' : 'default',
                          }}>
                          <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-sm">
                            {iconMap[skill]}
                          </span>
                          <span className="whitespace-nowrap">{skill}</span>
                          {hasProjects && (
                            <span
                              className="ml-0.5 h-1 w-1 shrink-0 rounded-full"
                              style={{
                                backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-foreground-subtle)',
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </StaggerItem>
              ))}
            </StaggerList>
          </BlurIn>
        ) : (
          // RADIAL ON DESKTOP
          <BlurIn
            delay={1.2}
            blur={10}
            y={16}
            className="w-full flex justify-center">
            <div
              ref={setContainerEl}
              className="relative w-full max-w-275 h-110 sm:h-135 md:h-155 lg:h-170">
              {size.w > 0 && size.h > 0 && (
                <>
                  {/* RINGS WRAPPER */}
                  <motion.div
                    className="absolute inset-0"
                    initial={false}
                    animate={{
                      opacity: isExpanded ? 1 : 0,
                      scale: isExpanded ? 1 : 0.2,
                    }}
                    transition={{
                      duration: isExpanded ? 1.1 : 0.5,
                      ease: isExpanded ? [0.16, 1, 0.3, 1] : 'easeInOut',
                    }}
                    style={{
                      transformOrigin: `${cx}px ${cy}px`,
                      pointerEvents: isExpanded ? 'auto' : 'none',
                    }}>
                    {/* ICONS CONNECTION */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {groupNodes.map(({ group, coords }) => (
                        <motion.line
                          key={`group-line-${group}`}
                          x1={cx}
                          y1={cy}
                          x2={coords.x}
                          y2={coords.y}
                          stroke="var(--color-border)"
                          strokeWidth={0.8}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.7 }}
                          transition={{ duration: 0.4 }}
                        />
                      ))}

                      {flowTarget &&
                        (() => {
                          const groupNode = groupNodes.find((n) => n.group === flowTarget.group);
                          const skillNode = allSkillNodes.find((n) => n.skill === flowTarget.skill);
                          if (!groupNode || !skillNode) return null;

                          const dx = skillNode.coords.x - groupNode.coords.x;
                          const dy = skillNode.coords.y - groupNode.coords.y;
                          const distance = Math.hypot(dx, dy) || 1;
                          const startX = groupNode.coords.x + (dx / distance) * ICON_RADIUS;
                          const startY = groupNode.coords.y + (dy / distance) * ICON_RADIUS;
                          const endX = skillNode.coords.x - (dx / distance) * ICON_RADIUS;
                          const endY = skillNode.coords.y - (dy / distance) * ICON_RADIUS;

                          return (
                            <>
                              {/* CENTER TO GROUP */}
                              <motion.line
                                key={`flow-center-${flowKey}`}
                                x1={cx}
                                y1={cy}
                                x2={groupNode.coords.x}
                                y2={groupNode.coords.y}
                                stroke="var(--color-accent)"
                                strokeWidth={1.5}
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{
                                  pathLength: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                                  opacity: { duration: 0.1 },
                                }}
                                style={{ filter: 'drop-shadow(0 0 4px var(--color-accent))' }}
                              />

                              {/* GROUPT TO SKILLS */}
                              <motion.line
                                key={`flow-skill-${flowKey}`}
                                x1={startX}
                                y1={startY}
                                x2={endX}
                                y2={endY}
                                stroke="var(--color-accent)"
                                strokeWidth={1.5}
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{
                                  pathLength: {
                                    duration: 0.35,
                                    delay: 0.35,
                                    ease: [0.16, 1, 0.3, 1],
                                  },
                                  opacity: { duration: 0.1, delay: 0.35 },
                                }}
                                style={{ filter: 'drop-shadow(0 0 4px var(--color-accent))' }}
                              />
                            </>
                          );
                        })()}
                    </svg>

                    {/* MIDDLE RING */}
                    {groupNodes.map(({ group, coords }) => (
                      <div
                        key={group}
                        className="absolute z-20"
                        style={{
                          left: coords.x,
                          top: coords.y,
                          transform: groupPillTransforms[group],
                        }}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}>
                          <div
                            className="px-2.5 py-1 sm:px-4 sm:py-2 border"
                            style={{
                              backgroundColor: 'var(--color-background-card)',
                              borderColor: 'var(--color-border)',
                            }}>
                            <span
                              className="text-[9px] sm:text-xs font-medium tracking-widest uppercase whitespace-nowrap"
                              style={{ color: 'var(--color-foreground-subtle)' }}>
                              {groupLabels[group]}
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    ))}

                    {/* OUTER RING */}
                    {allSkillNodes.map(({ skill, coords }, idx) => {
                      const isActive = activeSkill === skill;
                      const hasProjects = projects.some((p) => p.status === 'live' && p.tech.includes(skill));

                      return (
                        <motion.div
                          key={skill}
                          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                          style={{ left: coords.x, top: coords.y }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: idx * 0.04,
                            ease: 'easeOut',
                          }}>
                          <button
                            onClick={() => handleSkillClick(skill)}
                            className="relative"
                            style={{
                              width: ICON_SIZE,
                              height: ICON_SIZE,
                              cursor: hasProjects ? 'pointer' : 'default',
                            }}
                            title={hasProjects ? `See projects using ${skill}` : skill}>
                            <motion.div
                              className="w-full h-full rounded-full flex items-center justify-center border text-base sm:text-lg"
                              style={{
                                backgroundColor: isActive
                                  ? 'var(--color-accent-subtle)'
                                  : 'var(--color-background-card)',
                                borderColor: isActive
                                  ? 'var(--color-accent)'
                                  : hasProjects
                                    ? 'var(--color-border-hover)'
                                    : 'var(--color-border)',
                                color: isActive
                                  ? 'var(--color-accent)'
                                  : hasProjects
                                    ? 'var(--color-foreground)'
                                    : 'var(--color-foreground-subtle)',
                              }}
                              whileHover={
                                hasProjects
                                  ? {
                                      scale: 1.15,
                                      borderColor: 'var(--color-accent)',
                                    }
                                  : { scale: 1.05 }
                              }
                              whileTap={{ scale: 0.92 }}
                              animate={{
                                boxShadow: isActive ? '0 0 16px var(--color-accent-subtle)' : 'none',
                              }}>
                              {iconMap[skill]}
                            </motion.div>

                            <span
                              className="absolute left-1/2 top-full mt-1 -translate-x-1/2 text-center leading-tight text-[8px] sm:text-[9px] whitespace-nowrap"
                              style={{
                                color: isActive ? 'var(--color-accent)' : 'var(--color-foreground-subtle)',
                              }}>
                              {skill}
                            </span>

                            {hasProjects && (
                              <span
                                className="absolute left-1/2 top-full mt-4 -translate-x-1/2 w-1 h-1 rounded-full"
                                style={{
                                  backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-foreground-subtle)',
                                }}
                              />
                            )}
                          </button>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* CENTER RING */}
                  <div
                    className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: cx, top: cy }}>
                    <div className="relative">
                      {!isExpanded && (
                        <motion.span
                          key={`pulse-idle-${pulseKey}`}
                          className="absolute inset-0 rounded-full pointer-events-none"
                          style={{ border: '2px solid var(--color-accent)' }}
                          initial={{ opacity: 0.75, scale: 1 }}
                          animate={{ opacity: 0, scale: 1.6 }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            repeatDelay: 0.1,
                            ease: 'easeOut',
                          }}
                        />
                      )}

                      {isExpanded && (
                        <motion.span
                          key={`pulse-burst-${pulseKey}`}
                          className="absolute inset-0 rounded-full pointer-events-none"
                          style={{ border: '2px solid var(--color-accent)' }}
                          initial={{ opacity: 0.8, scale: 1 }}
                          animate={{ opacity: 0, scale: 2.2 }}
                          transition={{
                            duration: 1.1,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      )}

                      <motion.button
                        onClick={toggleExpanded}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center border-2"
                        style={{
                          backgroundColor: 'var(--color-background-card)',
                          borderColor: 'var(--color-accent)',
                          cursor: 'pointer',
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        aria-label={isExpanded ? 'Hide skills' : 'Show skills'}
                        aria-expanded={isExpanded}>
                        <span
                          className="text-sm sm:text-base font-bold font-heading tracking-widest"
                          style={{ color: 'var(--color-accent)' }}>
                          SKILLS
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </BlurIn>
        )}
      </div>

      {/* PROJECT CONNECTION */}
      <AnimatePresence mode="wait">
        {activeSkill && connectedProjects.length > 0 && (
          <motion.div
            key={activeSkill}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mb-12 sm:mb-16">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-4"
              style={{ color: 'var(--color-foreground-subtle)' }}>
              Projects using {activeSkill}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {connectedProjects.map((project) => (
                <div
                  key={project.title}
                  className="p-4 border transition-colors duration-200"
                  style={{ backgroundColor: 'var(--color-background-card)', borderColor: 'var(--color-border)' }}>
                  <h4
                    className="font-heading font-bold text-sm mb-1"
                    style={{ color: 'var(--color-foreground)' }}>
                    {project.title}
                  </h4>

                  <p
                    className="text-xs leading-relaxed mb-3"
                    style={{ color: 'var(--color-foreground-muted)' }}>
                    {project.shortDescription}
                  </p>

                  <div className="flex gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs"
                        style={{ color: 'var(--color-accent)' }}>
                        <ExternalLink size={10} />
                        Live
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs"
                        style={{ color: 'var(--color-foreground-muted)' }}>
                        <FaGithub size={10} />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MARQUEE */}
      <div
        className="pt-8 border-t overflow-hidden"
        style={{ borderColor: 'var(--color-border)' }}>
        <CascadeText
          as="p"
          text="Technologies I work with"
          className="text-xs font-medium tracking-widest uppercase mb-6 text-center"
          delay={0.1}
          stagger={0.03}
          blur={5}
          y={-6}
        />

        <BlurIn
          delay={0.4}
          blur={8}
          y={10}>
          <div className="relative flex overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to right, var(--color-background), transparent)' }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to left, var(--color-background), transparent)' }}
            />

            <div className="flex animate-marquee gap-10 sm:gap-16 items-center">
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span
                  key={i}
                  className="text-2xl sm:text-3xl md:text-4xl shrink-0"
                  style={{ color: 'var(--color-foreground-subtle)' }}
                  title={item.name}>
                  {item.icon}
                </span>
              ))}
            </div>
          </div>
        </BlurIn>
      </div>
    </section>
  );
}
