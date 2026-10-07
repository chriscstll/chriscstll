'use client';

import { CascadeText, BlurIn, StaggerList, StaggerItem } from '@/components/ui/motion-primitives';
import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, useState } from 'react';
import { about } from '@/data/portfolio';

export default function About() {
  const [activeCard, setActiveCard] = useState(0);
  return (
    <section
      id="about"
      className="section-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        {/* LEFT SIDE */}
        <StaggerList
          className="order-2 md:order-1 flex flex-col items-start"
          stagger={0.25}
          delay={1.1}>
          {about.cards.map((card, i) => (
            <StaggerItem
              key={card.id}
              className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setActiveCard(i)}
                  className="w-4 h-4 rounded-full border-2 shrink-0 transition-all duration-300 mt-1"
                  style={{
                    backgroundColor: activeCard === i ? 'var(--color-accent)' : 'transparent',
                    borderColor: activeCard === i ? 'var(--color-accent)' : 'var(--color-border-hover)',
                  }}
                  aria-label={card.label}
                />

                {i < about.cards.length - 1 && (
                  <div
                    className="relative w-px mt-1"
                    style={{
                      backgroundColor: 'var(--color-border)',
                      minHeight: '65px',
                    }}>
                    <motion.div
                      className="absolute top-0 left-0 right-0"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                      initial={{ height: '0%' }}
                      animate={{ height: activeCard === 1 ? '100%' : '0%' }}
                      transition={{
                        height: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveCard(i)}
                className="flex flex-col gap-1 pb-10 text-left transition-all duration-300 group">
                <span
                  className="font-heading font-bold text-base md:text-lg transition-colors duration-300"
                  style={{
                    color: activeCard === i ? 'var(--color-accent)' : 'var(--color-foreground)',
                  }}>
                  {card.label}
                </span>
                <span
                  className="text-sm transition-colors duration-300"
                  style={{
                    color: activeCard === i ? 'var(--color-foreground-muted)' : 'var(--color-foreground-subtle)',
                  }}>
                  {card.description}
                </span>
              </button>
            </StaggerItem>
          ))}
        </StaggerList>

        {/* RIGHT SIDE */}
        <div className="order-1 md:order-2 flex flex-col gap-6 self-start md:self-auto md:min-h-112.5">
          <h2>
            <CascadeText
              as="span"
              text={about.heading}
              className="block text-xs tracking-widest text-foreground-subtle mb-2"
              delay={0.35}
              stagger={0.05}
              splitBy="char"
              blur={6}
            />
            <CascadeText
              as="span"
              text={about.name}
              className="block font-bold leading-tight text-[clamp(2.25rem,4.5vw,3.5rem)]"
              charClassName="gradient-text"
              delay={0.6}
              stagger={0.04}
              splitBy="char"
              blur={10}
              y={-14}
            />
          </h2>
          <BlurIn
            delay={1.1}
            blur={12}
            y={16}
            className="min-h-95 min-[375px]:min-h-68 sm:min-h-60 md:min-h-0">
            <AnimatePresence
              mode="wait"
              initial={false}>
              <motion.div key={activeCard}>
                <motion.h3
                  initial={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="font-heading font-bold text-lg md:text-xl mb-3"
                  style={{ color: 'var(--color-foreground)' }}>
                  {about.cards[activeCard].content.title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-sm leading-[1.65] tracking-wide md:max-w-90 lg:max-w-md rounded-md px-4 py-3"
                  style={{
                    color: 'var(--color-foreground)',
                    backgroundColor: 'var(--color-background-card)',
                  }}>
                  {about.cards[activeCard].content.body}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </BlurIn>
        </div>
      </div>
      {/* STATS ROW */}
      <BlurIn
        delay={1.6}
        blur={8}
        y={12}
        className="mt-6 flex flex-col items-start text-left pl-[10%] lg:pl-67">
        <div className="flex items-stretch gap-5 sm:gap-7">
          {about.stats.map((stat, i) => (
            <Fragment key={stat.label}>
              {/* STATS DIVIDER*/}
              {i > 0 && (
                <div
                  className="w-px self-stretch"
                  style={{ backgroundColor: 'var(--color-background-secondary)' }}
                  aria-hidden="true"
                />
              )}

              <div className="flex flex-col items-center">
                <CascadeText
                  as="span"
                  text={stat.value}
                  className="font-heading text-2xl leading-none sm:text-3xl"
                  delay={0.85 + i * 0.1}
                  stagger={0.05}
                  blur={6}
                  y={-6}
                />
                <span
                  className="mt-2 text-[9px] font-medium uppercase tracking-[0.25em]"
                  style={{ color: 'var(--color-foreground-muted)' }}>
                  {stat.label}
                </span>
              </div>
            </Fragment>
          ))}
        </div>

        {/* PRIVACY NOTE */}
        {about.privacyNote && (
          <BlurIn
            delay={1.15}
            blur={6}
            y={8}>
            <p
              className="mt-5 max-w-55 text-[11px] italic leading-relaxed"
              style={{ color: 'var(--color-foreground-subtle)' }}>
              {about.privacyNote}
            </p>
          </BlurIn>
        )}
      </BlurIn>
    </section>
  );
}
