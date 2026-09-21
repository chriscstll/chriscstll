'use client';

import { ArrowDown, Mail } from 'lucide-react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import { hero, contact } from "@/data/portfolio";

export default function Hero() {
  return (
    <section id="hero"
              className='relative min-h-svh flex flex-col items-center justify-center px-6 pt-14 md:pt-16'>
                <div aria-hidden='true'
                className='absolute inset-0 pointer-events-none'
                style={{
                  background:'radial-gradient(ellipse 100% 60% at 50% 40%, var(--color-accent-subtle), transparent)',
                }}/>

              <div className='relative z-10 w-full max-w-3xl flex flex-col items-center text-center'>
                <p className='text-xs md:text-sm font-medium tracking-widest uppercase text-foreground-muted mb-4 md:mb-6'>
                  {hero.greeting}
                </p>
                <h1 className='gradient-text font-heading font-bold leading-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-3 md:mb-4'>
                  {hero.name}
                </h1>
                <h2 className='text-lg sm:text-2xl lg:text-3xl font-semibold text-foreground-muted mb-4 md:mb-6'>
                  {hero.title}
                </h2>
                <p className='text-sm md:text-base lg:text-lg leading-relaxed text-foreground-muted max-w-md md:max-w-xl mb-8 md:mb-10'>
                  {hero.tagline}
                </p>

                <div className='flrx flex-col sm:flex-row gap-3 w-full sm:w-auto mb-12 md:mb-16'>
                  <a href={hero.cta.primary.href}
                          className='w-full sm:w-auto px-8 py-3 rounded-lg font-medium text-sm text-white text-center transition-colors duration-200 bg-accent hover:bg-accent-hover'> 
                    {hero.cta.primary.label}
                  </a>
                  <a href={hero.cta.secondary.href}
                          className='w-full sm:w-auto px-8 py-3 rounded-lg font-medium text-sm text-foreground text-center transition-colors duration-200 border border-border-hover hover:border-accent hover:text-accent'>
                    {hero.cta.secondary.label}        
                  </a>
                </div>

                <div className='flex items-center gap-6'>
                  <a href={contact.github}
                      target='_blank' rel='noopener noreferrer' aria-label='GitHub Profile' className='text-foreground-subtle hover:text-foreground transition-colors duration-200'>
                        <FaGithub size={20}/>
                  </a>
                  <a href={contact.linkedin}
                      target='_blank' rel='noopener noreferrer' aria-label='LinkedinIn Profile' className='text-foreground-subtle hover:text-foreground transition-colors duration-200'>
                        <FaLinkedinIn size={20}/>
                  </a>
                  <a href={`mailto:${contact.email}`}
                      aria-label='Send email' className='text-foreground-subtle hover:text-foreground transition-colors duration-200'>
                        <Mail size={20} />
                  </a>
                </div>
              </div>
              
              <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground-subtle">
                <span className="text-xs tracking-widest uppercase">Scroll</span>
                  <ArrowDown size={14} className="animate-bounce" />
              </div>

    </section>
  );
}
