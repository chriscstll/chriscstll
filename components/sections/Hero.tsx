'use client';

import Image from 'next/image';
import { motion } from "framer-motion";
import { hero, contact } from '@/data/portfolio';

const techIcons = [
    {
        name: 'React',
        position: 'top-1/5 left-1/8 -translate-y-1/5 md:left-[15%] lg:left-1/8',
        svg: (
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <circle cx="16" cy="16" r="3.2" fill="#61DAFB"/>
                <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" strokeWidth="1.5" fill="none" />
                <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 16 16)" />
                <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 16 16)" />
            </svg>
        ),
    },
    {
        name: 'Next.js',
        position: 'top-[2%] right-1/3 md:right-[28%] md:top-[10%] lg:right-1/3',
        svg: (
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <circle cx="16" cy="16" r="14" fill="black" stroke="#ffffff22" strokeWidth="1"/>
                <path d="M10 22V10l14 16h-4L10 14v8h-0z" fill="white" />
                <path d="M19 10h3v8.5L19 14V10z" fill="white" />
            </svg>
        ),
    },
    {
        name: "TypeScript",
        position: "top-1/3 right-[15%] -translate-y-1/3 md:right-[12%] lg:right-[15%]",
        svg: (
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <rect width="32" height="32" rx="4" fill="#3178C6" />
                <path d="M18.6 22v-2.2c.7.4 1.6.7 2.4.7.9 0 1.4-.3 1.4-.9 0-.2-.1-.4-.2-.6-.2-.1-.4-.3-.7-.4l-1-.4c-1.4-.5-2.1-1.3-2.1-2.5 0-.8.3-1.4.9-1.9.6-.5 1.4-.7 2.4-.7.9 0 1.7.1 2.3.4v2.1c-.6-.3-1.3-.5-2.1-.5-.8 0-1.2.3-1.2.8 0 .2.1.4.3.5.2.1.5.3.9.4l.8.3c.8.3 1.3.6 1.7 1.1.4.4.5 1 .5 1.6 0 .9-.3 1.5-.9 2-.6.5-1.5.7-2.6.7-1 0-1.9-.2-2.8-.5zM9 14.2H6V12h8.2v2.2h-3V22H9v-7.8z" fill="white" />
            </svg>
        ),
    },
    {
        name: "Tailwind CSS",
        position: "bottom-1/4 right-1/4 md:right-[18%] lg:right-1/4",
        svg: (
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path d="M16 7c-3.6 0-5.8 1.8-6.8 5.4 1.4-1.8 2.9-2.5 4.7-2 1 .25 1.7 1 2.5 1.8C17.6 13.4 19 15 22 15c3.6 0 5.8-1.8 6.8-5.4-1.4 1.8-2.9 2.5-4.7 2-1-.25-1.7-1-2.5-1.8C20.4 8.6 19 7 16 7zM9.2 15c-3.6 0-5.8 1.8-6.8 5.4 1.4-1.8 2.9-2.5 4.7-2 1 .25 1.7 1 2.5 1.8 1.2 1.2 2.6 2.8 5.6 2.8 3.6 0 5.8-1.8 6.8-5.4-1.4 1.8-2.9 2.5-4.7 2-1-.25-1.7-1-2.5-1.8C13.6 16.6 12.2 15 9.2 15z" fill="#38BDF8" />
            </svg>
        ),
    },
    {
        name: "Git",
        position: "bottom-1/4 left-1/6 md:left-[12%] lg:left-1/6",
        svg: (
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path d="M29.5 14.6L17.4 2.5a1.7 1.7 0 00-2.4 0l-2.4 2.4 3 3a2 2 0 012.6 2.6l2.9 2.9a2 2 0 112.4 2.4 2 2 0 01-2-2 2 2 0 01.1-.6l-2.7-2.7v7a2 2 0 11-2.4 1.9 2 2 0 012-2v-7.1a2 2 0 01-1.1-2.6L12.6 8 2.5 18.1a1.7 1.7 0 000 2.4l11.1 11.1a1.7 1.7 0 002.4 0L29.5 17a1.7 1.7 0 000-2.4z" fill="#F05032" />
            </svg>
        ),
    },

];

const floatVariant = (delay: number) => ({
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay,
        },
    },
});

export default function Hero() {
    return (
        <section id='hero' className='relative min-h-svh flex items-center px-6 pt-14 md:pt-16 overflow-hidden'>
            <div className='relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center py-16 md:py-0'>
                <div className='flex flex-col items-start'>

                    <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide mb-6 border'
                        style={{
                            backgroundColor: 'var(--color-accent-subtle)',
                            borderColor: "var(--color-accent)",
                            color: 'var(--color-accent)',
                        }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                {hero.title}
                    </div>

                    <h1 className="font-heading font-bold leading-tight text-4xl sm:text-5xl lg:text-6xl gradient-text mb-3">
                            {hero.tagline}
                    </h1>

                    <div className='flex flex-col items-start gap-3 mb-8'>
                        < a href={hero.cta.contactbtn.href}
                            className="inline-flex px-6 py-3 font-medium text-sm text-foreground hover:text-accent transition-colors duration-200">
                                {hero.cta.contactbtn.label}
                        </a>
                    </div>
                </div>

                <div className="relative flex items-center justify-center">
                    <div className="relative w-full h-112.5 sm:h-137.5 md:h-175">
                        <div className="relative w-full h-full overflow-hidden">
                            <Image src="/profile-photo.png" alt="Your Full Name - Frontend Developer" fill className="object-contain object-center"
                                style={{
                                    filter: "grayscale(100%) contrast(1.1) brightness(0.85)",
                                }}
                                priority/>
                            <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" aria-hidden="true"
                                style={{
                                    background:"linear-gradient(to top, var(--color-background), transparent)",
                                }}/>
                        </div>

                        {techIcons.map((icon, i) => (
                            <motion.div
                                key={icon.name}
                                className={`absolute flex items-center justify-center w-10 h-10 z-10 
                                    ${icon.position}`}
                                style={{
                                    backgroundColor: "rgba(15,15,15,0.75)",
                                    backdropFilter: "blur(6px)",
                                    WebkitBackdropFilter: "blur(6px)",
                                }}
                                variants={floatVariant(i * 0.4)}
                                animate="animate"
                                title={icon.name}>
                                    <div className="w-7 h-7">
                                        {icon.svg}
                                    </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}



