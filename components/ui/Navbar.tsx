"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Image from "next/image";
import { contact } from "@/data/portfolio";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
];

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

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // SECTION TRACKER
  useEffect(() => {
    const sections = navLinks.map((link) => link.href.replace("#", ""));

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
        rootMargin: "-40% 0px -40% 0px",
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

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // ESC KEY
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: isMenuOpen ? "var(--color-background)" : isScrolled ? "rgba(15,15,15,0.85)" : "transparent",
          borderBottom: isScrolled && !isMenuOpen ? "1px solid var(--color-border)" : "1px solid transparent",
          backdropFilter: !isMenuOpen && isScrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: !isMenuOpen && isScrolled ? "blur(12px)" : "none",
          transform: isHidden && !isMenuOpen ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        <nav
          className="max-w-6xl mx-auto px-8 lg:px-12 h-14 md:h-16
                        flex items-center justify-between"
        >
          <a
            href="#"
            className="transition-opacity duration-200 hover:opacity-75 relative z-50"
            onClick={closeMenu}
            aria-label="Christian M. Castillo"
          >
            <Image
              src="/logo.png"
              alt="logo"
              width={55}
              height={60}
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group relative inline-flex items-center justify-center text-sm transition-colors duration-200"
                    style={{ color: isActive ? "var(--color-accent)" : "var(--color-foreground-muted)" }}
                  >
                    <span className="relative">
                      <span
                        className={
                          isActive
                            ? "absolute left-0 top-1/2 -translate-x-[calc(100%+0.25rem)] -translate-y-1/2 text-xs font-normal opacity-100 transition-all duration-300 ease-out"
                            : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-normal opacity-0 transition-all duration-300 ease-out group-hover:left-0 group-hover:-translate-x-[calc(100%+0.25rem)] group-hover:opacity-100"
                        }
                      >
                        &lt;
                      </span>
                      <span>{link.label}</span>
                      <span
                        className={
                          isActive
                            ? "absolute left-full top-1/2 translate-x-1 -translate-y-1/2 text-xs font-normal opacity-100 transition-all duration-300 ease-out"
                            : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-normal opacity-0 transition-all duration-300 ease-out group-hover:left-full group-hover:translate-x-1 group-hover:opacity-100"
                        }
                      >
                        &gt;
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* HAMB MENU */}
          <button
            className="md:hidden p-2 -mr-2 rounded-lg relative z-50 text-foreground-muted hover:text-foreground transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 flex flex-col items-center px-6 pt-24 pb-12 gap-6"
            style={{ backgroundColor: "var(--color-background)", willChange: "transform" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="group relative inline-flex items-center justify-center text-2xl font-heading font-bold py-2 text-foreground-muted hover:text-foreground transition-colors duration-200"
                onClick={closeMenu}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.3, ease: "easeOut" }}
              >
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
              transition={{ delay: 0.45, duration: 0.3 }}
            >
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="text-foreground-subtle hover:text-foreground transition-colors duration-200"
              >
                <FaGithub size={20} />
              </a>

              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="text-foreground-subtle hover:text-foreground transition-colors duration-200"
              >
                <FaLinkedin size={20} />
              </a>

              <a
                href={`mailto:${contact.email}`}
                aria-label="Send email"
                className="text-foreground-subtle hover:text-foreground transition-colors duration-200"
              >
                <Mail size={20} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
