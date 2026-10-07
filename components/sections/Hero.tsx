'use client';

import { CascadeText, BlurIn } from '@/components/ui/motion-primitives';

import { hero } from '@/data/portfolio';
import Image from 'next/image';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-svh flex items-center px-6 pt-10 md:pt-12">
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

          <BlurIn
            delay={0.9}
            blur={6}
            y={8}>
            <p className="text-sm sm:text-base max-w-md text-foreground-muted">{hero.subtitle}</p>
          </BlurIn>

          {/* CTA */}
          <BlurIn
            trigger="view"
            delay={1.1}
            duration={0.6}
            blur={12}
            y={12}
            className="flex flex-col items-start gap-3 mt-[clamp(2.5rem,6vw,5rem)]">
            <a
              href="#contact"
              className="group relative inline-flex items-center pb-1 text-lg font-semibold text-foreground transition-colors duration-300 hover:text-accent-hover sm:text-xl md:text-2xl">
              {hero.cta.contactbtn.label}
              <span
                className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100"
                style={{ backgroundColor: 'var(--color-accent-hover)' }}
              />
            </a>
          </BlurIn>
        </div>

        {/* HERO IMG */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full h-112.5 sm:h-137.5 md:h-175">
            {/* BLOB */}
            <BlurIn
              trigger="view"
              delay={0.4}
              duration={0.9}
              blur={14}
              y={20}
              className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg
                viewBox="0 0 500 500"
                className="w-[90%] h-[90%]"
                aria-hidden="true">
                <path
                  fill="var(--color-background-secondary)"
                  fillOpacity="0.8"
                  d="M220,80 C260,60 310,70 350,100 C390,130 420,180 420,230 C420,280 400,320 380,350 C360,380 330,420 280,440 C230,460 170,450 120,420 C70,390 40,340 50,290 C60,240 90,200 130,170 C170,140 190,100 220,80 Z"
                />
                <circle
                  cx="80"
                  cy="120"
                  r="4"
                  fill="var(--color-background-secondary)"
                  fillOpacity="0.4"
                />
                <circle
                  cx="440"
                  cy="380"
                  r="3"
                  fill="var(--color-background-secondary)"
                  fillOpacity="0.4"
                />
                <circle
                  cx="60"
                  cy="400"
                  r="5"
                  fill="var(--color-background-secondary)"
                  fillOpacity="0.3"
                />
                <circle
                  cx="430"
                  cy="130"
                  r="4"
                  fill="var(--color-background-secondary)"
                  fillOpacity="0.3"
                />
              </svg>
            </BlurIn>

            {/* IMG*/}
            <BlurIn
              trigger="view"
              delay={1.2}
              duration={1.0}
              blur={16}
              y={12}
              className="absolute inset-0 overflow-hidden">
              <Image
                src="/profile-photo.png"
                alt="Christian M. Castillo"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-center select-none pointer-events-none"
                style={{ filter: 'var(--photo-filter)' }}
                draggable={false}
                priority
              />
            </BlurIn>
          </div>
        </div>
      </div>
    </section>
  );
}
