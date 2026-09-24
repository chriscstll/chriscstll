"use client";

import { useState } from "react";
import { about } from "@/data/portfolio";
import { motion } from "framer-motion";
import { FaReact, FaGitAlt, FaHtml5, FaCss3Alt, FaJs } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiTailwindcss } from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

export default function About() {
  const [activeCard, setActiveCard] = useState(0);
  return (
    <section id="about" className="section-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        //LEFT SIDE
        <div className="flex flex-col items-start">
          {about.cards.map((card, i) => (
            <div key={card.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setActiveCard(i)}
                  className="w-4 h-4 rounded-full border-2 shrink-0 transition-all duration-300 mt-1"
                  style={{
                    backgroundColor: activeCard === i ? "var(--color-accent)" : "transparent",
                    borderColor: activeCard === i ? "var(--color-accent)" : "var(--color-border-hover)",
                  }}
                  aria-label={card.label}
                />

                {i < about.cards.length - 1 && (
                  <div
                    className="relative w-px mt-1"
                    style={{ backgroundColor: "var(--color-border)", minHeight: "65px" }}
                  >
                    <motion.div
                      className="absolute top-0 left-0 right-0"
                      style={{ backgroundColor: "var(--color-accent)" }}
                      initial={{ height: "0%", y: "0%" }}
                      animate={{
                        height: activeCard === 1 ? "100%" : "0%",
                        y: activeCard === 1 ? "0%" : "0%",
                      }}
                      transition={{
                        height: {
                          duration: 0.6,
                          ease: [0.4, 0, 0.2, 1],
                        },
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveCard(i)}
                className="flex flex-col gap-1 pb-10 text-left transition-all duration-300 group"
              >
                <span
                  className="font-heading font-bold text-base md:text-lg transition-colors duration-300"
                  style={{ color: activeCard === i ? "var(--color-accent)" : "var(--color-foreground)" }}
                >
                  {card.label}
                </span>
                <span
                  className="text-sm transition-colors duration-300"
                  style={{
                    color: activeCard === i ? "var(--color-foreground-muted)" : "var(--color-foreground-subtle)",
                  }}
                >
                  {card.description}
                </span>
              </button>
            </div>
          ))}
        </div>
        //RIGHT SIDE
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-heading font-bold leading-tight text-3xl sm:text-4xl md:text-5xl mb-4">
              {about.heading} <span className="gradient-text">{about.name}</span>
            </h2>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg md:text-xl mb-3" style={{ color: "var(--color-foreground)" }}>
              {about.cards[activeCard].content.title}
            </h3>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--color-foreground-muted)" }}>
              {about.cards[activeCard].content.body}
            </p>
          </div>
        </div>
      </div>
      //MARQUEE
      <div className="mt-20 pt-8 overflow-hidden">
        <p
          className="text-xs font-medium tracking-widest uppercase mb-6 text-center"
          style={{ color: "var(--color-foreground-subtle)" }}
        >
          Technologies I work with
        </p>

        <div className="relative flex overflow-hidden">
          <div
            className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to right, var(--color-background), transparent)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to left, var(--color-background), transparent)",
            }}
          />

          <div className="flex animate-marquee gap-20 items-center">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                className="text-4xl shrink-0"
                style={{ color: "var(--color-foreground-subtle)" }}
                title={item.name}
              >
                {item.icon}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const marqueeItems = [
  { name: "VSCode", icon: <VscVscode /> },
  { name: "HTML", icon: <FaHtml5 /> },
  { name: "CSS", icon: <FaCss3Alt /> },
  { name: "JavaScript", icon: <FaJs /> },
  { name: "TypeScript", icon: <SiTypescript /> },
  { name: "React", icon: <FaReact /> },
  { name: "Next.js", icon: <SiNextdotjs /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss /> },
  { name: "Git", icon: <FaGitAlt /> },
];
