"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { CascadeText, BlurIn } from "@/components/ui/motion-primitives";
import { hero } from "@/data/portfolio";

const techIcons = [
  {
    name: "React",
    position: "top-1/5 left-1/8 md:left-[15%] lg:left-1/8",
    svg: (
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <circle cx="16" cy="16" r="3.2" fill="#61DAFB" />
        <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" strokeWidth="1.5" fill="none" />
        <ellipse
          cx="16"
          cy="16"
          rx="13"
          ry="5"
          stroke="#61DAFB"
          strokeWidth="1.5"
          fill="none"
          transform="rotate(60 16 16)"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="13"
          ry="5"
          stroke="#61DAFB"
          strokeWidth="1.5"
          fill="none"
          transform="rotate(120 16 16)"
        />
      </svg>
    ),
  },
  {
    name: "Next.js",
    position: "top-[2%] right-1/3 md:right-[28%] md:top-[10%] lg:right-1/3",
    svg: (
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <circle cx="16" cy="16" r="14" fill="black" stroke="#ffffff22" strokeWidth="1" />
        <path d="M10 22V10l14 16h-4L10 14v8h-0z" fill="white" />
        <path d="M19 10h3v8.5L19 14V10z" fill="white" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    position: "top-1/3 right-[15%] md:right-[12%] lg:right-[15%]",
    svg: (
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <rect width="32" height="32" rx="4" fill="#3178C6" />
        <path
          d="M18.6 22v-2.2c.7.4 1.6.7 2.4.7.9 0 1.4-.3 1.4-.9 0-.2-.1-.4-.2-.6-.2-.1-.4-.3-.7-.4l-1-.4c-1.4-.5-2.1-1.3-2.1-2.5 0-.8.3-1.4.9-1.9.6-.5 1.4-.7 2.4-.7.9 0 1.7.1 2.3.4v2.1c-.6-.3-1.3-.5-2.1-.5-.8 0-1.2.3-1.2.8 0 .2.1.4.3.5.2.1.5.3.9.4l.8.3c.8.3 1.3.6 1.7 1.1.4.4.5 1 .5 1.6 0 .9-.3 1.5-.9 2-.6.5-1.5.7-2.6.7-1 0-1.9-.2-2.8-.5zM9 14.2H6V12h8.2v2.2h-3V22H9v-7.8z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    position: "bottom-1/4 right-1/4 md:right-[18%] lg:right-1/4",
    svg: (
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <path
          d="M16 7c-3.6 0-5.8 1.8-6.8 5.4 1.4-1.8 2.9-2.5 4.7-2 1 .25 1.7 1 2.5 1.8C17.6 13.4 19 15 22 15c3.6 0 5.8-1.8 6.8-5.4-1.4 1.8-2.9 2.5-4.7 2-1-.25-1.7-1-2.5-1.8C20.4 8.6 19 7 16 7zM9.2 15c-3.6 0-5.8 1.8-6.8 5.4 1.4-1.8 2.9-2.5 4.7-2 1 .25 1.7 1 2.5 1.8 1.2 1.2 2.6 2.8 5.6 2.8 3.6 0 5.8-1.8 6.8-5.4-1.4 1.8-2.9 2.5-4.7 2-1-.25-1.7-1-2.5-1.8C13.6 16.6 12.2 15 9.2 15z"
          fill="#38BDF8"
        />
      </svg>
    ),
  },
  {
    name: "Git",
    position: "bottom-1/4 left-1/6 md:left-[12%] lg:left-1/6",
    svg: (
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <path
          d="M29.5 14.6L17.4 2.5a1.7 1.7 0 00-2.4 0l-2.4 2.4 3 3a2 2 0 012.6 2.6l2.9 2.9a2 2 0 112.4 2.4 2 2 0 01-2-2 2 2 0 01.1-.6l-2.7-2.7v7a2 2 0 11-2.4 1.9 2 2 0 012-2v-7.1a2 2 0 01-1.1-2.6L12.6 8 2.5 18.1a1.7 1.7 0 000 2.4l11.1 11.1a1.7 1.7 0 002.4 0L29.5 17a1.7 1.7 0 000-2.4z"
          fill="#F05032"
        />
      </svg>
    ),
  },
];

const iconVariant = (i: number): Variants => ({
  initial: {
    opacity: 0,
    scale: 0.3,
    x: (i % 2 === 0 ? 1 : -1) * (40 + i * 15), // fly in from alternating sides
    y: i * 25 - 40,
    rotate: (i % 2 === 0 ? 1 : -1) * 90,
  },
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      delay: 0.5 + i * 0.1,
      type: "spring",
      stiffness: 120,
      damping: 14,
    },
  },
});

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-svh flex items-center px-6 pt-14 md:pt-16">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center py-16 md:py-0">
        {/* HERO TAGLINE */}
        <div className="flex flex-col items-start">
          {/* Tagline */}
          <CascadeText
            as="h1"
            text={hero.tagline}
            trigger="view"
            className="font-heading font-bold leading-tight text-[clamp(2.25rem,5vw,4rem)] mb-3"
            charClassName="gradient-text"
            delay={0.25}
            stagger={0.02}
            duration={0.6}
            blur={12}
            y={-16}
          />

          {/* CTA  */}
          <BlurIn
            trigger="view"
            delay={1.1}
            duration={0.6}
            blur={12}
            y={12}
            className="flex flex-col items-start gap-3 mb-8"
          >
            <a
              href={hero.cta.contactbtn.href}
              className="group relative inline-flex items-center overflow-hidden rounded-full border border-border bg-background-card px-7 py-2.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-accent hover:text-accent"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "conic-gradient(from 0deg at 50% 50%, transparent 0deg, var(--color-accent-subtle) 40deg, transparent 80deg)",
                  animation: "radar 3s linear infinite",
                }}
              />
              <span
                aria-hidden
                className="absolute inset-0 z-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
              <span className="relative z-10">{hero.cta.contactbtn.label}</span>
            </a>
          </BlurIn>
        </div>

        {/* HERO IMG */}
        <BlurIn
          trigger="view"
          delay={0.2}
          duration={0.9}
          blur={16}
          y={24}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-full h-112.5 sm:h-137.5 md:h-175">
            {/* SVG BLOB */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
              <svg viewBox="0 0 500 500" className="w-[85%] h-[85%] sm:w-[80%] sm:h-[80%]"></svg>
            </div>

            {/* IMAGE */}
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src="/profile-photo.png"
                alt="Christian M. Castillo"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-center"
                style={{ filter: "grayscale(100%) contrast(1.1) brightness(0.85)" }}
                priority
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
                aria-hidden="true"
                style={{ background: "linear-gradient(to top, var(--color-background), transparent)" }}
              />
            </div>

            {/* TECH ICONS*/}
            {techIcons.map((icon, i) => (
              <motion.div
                key={icon.name}
                className={`absolute flex items-center justify-center w-10 h-10 z-10 ${icon.position}`}
                variants={iconVariant(i)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                title={icon.name}
              >
                <div className="w-7 h-7">{icon.svg}</div>
              </motion.div>
            ))}
          </div>
        </BlurIn>
      </div>
    </section>
  );
}
