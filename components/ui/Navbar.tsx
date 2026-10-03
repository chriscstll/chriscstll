'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlignRight, SquareX, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { contact, navLinks } from '@/data/portfolio';
import { BlurIn } from '@/components/ui/motion-primitives';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // AUTO HIDE ON SCROLL DOWN, SHOW ON SCROLL UP
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 80) {
        setIsHidden(false);
      } else if (currentScrollY > lastScrollY) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // SECTION TRACKER
  useEffect(() => {
    const sections = navLinks.map((link) => link.href.replace('#', ''));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (window.scrollY < 40) return;
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-40% 0px -40% 0px',
      },
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY < 40) {
        setActiveSection(null);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // ESC KEY
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: isMenuOpen
            ? 'var(--color-background-secondary)'
            : isScrolled
              ? 'var(--navbar-tint)'
              : 'transparent',
          borderBottom: isScrolled && !isMenuOpen ? '1px solid var(--color-border)' : '1px solid transparent',
          backdropFilter: !isMenuOpen && isScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: !isMenuOpen && isScrolled ? 'blur(20px)' : 'none',
          transform: isHidden && !isMenuOpen ? 'translateY(-100%)' : 'translateY(0)',
        }}>
        <nav
          className="max-w-6xl mx-auto px-8 lg:px-12 h-14 md:h-16
                        flex items-center justify-between">
          <BlurIn
            trigger="mount"
            delay={0.1}
            blur={8}
            y={-6}
            duration={0.5}
            className="relative z-50">
            <Link
              href="/#hero"
              className="transition-opacity duration-200 hover:opacity-75 relative z-50"
              onClick={closeMenu}
              aria-label="Christian M. Castillo">
              <Image
                src="/logo.png"
                alt="logo"
                width={55}
                height={60}
                className="h-10 w-auto sm:h-11 md:h-12"
                priority
              />
            </Link>
          </BlurIn>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;

              return (
                <li
                  key={link.href}
                  className="py-1">
                  <motion.a
                    href={link.href}
                    className="group relative inline-flex items-center justify-center whitespace-nowrap px-1.5 text-sm transition-colors duration-300 ease-out"
                    style={{
                      color: isActive ? 'var(--color-accent-text)' : 'var(--color-foreground-muted)',
                    }}>
                    {/* LEFT BRAKCET */}
                    <span
                      className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-xs font-normal transition-all duration-300 ease-out ${
                        isActive
                          ? 'left-0 -translate-x-[calc(100%-0.05rem)]'
                          : 'left-1/2 -translate-x-1/2 opacity-0 group-hover:left-0 group-hover:-translate-x-full group-hover:opacity-100'
                      }`}>
                      &lt;
                    </span>

                    {/* LABEL */}
                    <span className="relative inline-block overflow-hidden">
                      <motion.span
                        className="inline-block"
                        initial={{ y: '110%' }}
                        animate={{ y: '0%' }}
                        transition={{
                          delay: 0.8 + i * 0.07,
                          type: 'spring',
                          stiffness: 220,
                          damping: 22,
                        }}>
                        {link.label}
                      </motion.span>
                    </span>

                    {/* RIGHT BRAKCET */}
                    <span
                      className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-xs font-normal transition-all duration-300 ease-out ${
                        isActive
                          ? 'left-full translate-x-[0.05rem]'
                          : 'left-1/2 -translate-x-1/2 opacity-0 group-hover:left-full group-hover:translate-x-0 group-hover:opacity-100'
                      }`}>
                      &gt;
                    </span>
                  </motion.a>
                </li>
              );
            })}
          </ul>

          {/* HAMB MENU */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <BlurIn
              trigger="mount"
              delay={0.2}
              blur={8}
              y={-6}
              duration={0.5}
              className="md:hidden relative z-50">
              <button
                className="p-2 -mr-2 rounded-lg cursor-pointer text-foreground-muted hover:text-foreground transition-colors duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}>
                {isMenuOpen ? <SquareX size={25} /> : <AlignRight size={25} />}
              </button>
            </BlurIn>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 flex flex-col items-center px-6 pt-24 pb-12 gap-6"
            style={{ backgroundColor: 'var(--color-background-secondary)', willChange: 'transform' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}>
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="group relative inline-flex items-center justify-center text-2xl font-heading font-bold py-2 text-foreground-muted hover:text-foreground transition-colors duration-200"
                onClick={closeMenu}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                <span className="relative">
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 text-lg font-normal transition-all duration-300 ease-out group-hover:left-0 group-hover:-translate-x-[calc(100%+0.5rem)] group-hover:opacity-100">
                    &lt;
                  </span>
                  <span>{link.label}</span>
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 text-lg font-normal transition-all duration-300 ease-out group-hover:left-full group-hover:translate-x-2 group-hover:opacity-100">
                    &gt;
                  </span>
                </span>
              </motion.a>
            ))}

            {/* SOCIAL LINKS */}
            <motion.div
              className="flex items-center gap-6 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="text-foreground-subtle hover:text-foreground transition-colors duration-200">
                <FaGithub size={20} />
              </a>

              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="text-foreground-subtle hover:text-foreground transition-colors duration-200">
                <FaLinkedin size={20} />
              </a>

              <a
                href={`mailto:${contact.email}`}
                aria-label="Send email"
                className="text-foreground-subtle hover:text-foreground transition-colors duration-200">
                <Mail size={20} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
