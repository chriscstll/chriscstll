'use client';

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/data/portfolio";

const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                backgroundColor: isScrolled ? 'rgba(15,15,15,0.85)' : 'transparent',
                borderBottom: isScrolled ? '1px solid var(--color-border)' : '1px solid transparent',
                backdropFilter: isScrolled ? 'blur(12px)' : 'none',
                WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
            }}>

                <nav className="max-w-5xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between">
                    <a href="#"
                        className="font-heading font-bold text-base md:text-lg tracking-tight text-foreground hover:text-accent transition-colors duration-200" onClick={closeMenu}>
                            {siteConfig.name}
                    </a>

                    <ul className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                 <a href={link.href}
                                    className="group relative inline-flex items-center justify-center text-sm text-foreground-muted hover:text-foreground transition-colors duration-200">
                                    <span className="relative">
                                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 text-xs font-normal transition-all duration-300 ease-out group-hover:left-0 group-hover:-translate-x-[calc(100%+0.25rem)] group-hover:opacity-100">
                                            &lt;
                                        </span>

                                            <span>{link.label}</span>

                                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 text-xs font-normal transition-all duration-300 ease-out group-hover:left-full group-hover:translate-x-1 group-hover:opacity-100">
                                            &gt;
                                        </span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>

                    <button className="md:hidden p-2 -mr-2 rounded-lg text-foreground-muted hover:text-foreground transition-colors duration-200"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}>
                                { isMenuOpen ? <X size={20} /> : <Menu size={20} /> }
                    </button>
                </nav>

                        {/* HAMB MENU */}
                {isMenuOpen && (
                    <div className="md:hidden fixed inset-0 top-14 z-40 flex flex-col items-center px-6 pt-8 gap-6"
                        style={{ backgroundColor: 'var(--color-background)'}}>
                            {navLinks.map((link) => (
                                <a key={link.href}
                                    href={link.href}
                                    className="group relative inline-flex items-center justify-center text-2xl font-heading font-bold text-foreground-muted hover:text-foreground transition-colors duration-200 py-2"
                                            onClick={closeMenu}>

                                        <span className="relative">
                                            <span
                                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 text-lg font-normal transition-all duration-300 ease-out group-hover:left-0 group-hover:-translate-x-[calc(100%+0.5rem)] group-hover:opacity-100">
                                            &lt;
                                            </span>
                                                <span>{link.label}</span>
                                            <span
                                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 text-lg font-normal transition-all duration-300 ease-out group-hover:left-full group-hover:translate-x-2 group-hover:opacity-100">
                                            &gt;
                                            </span>
                                        </span>
                                    </a>
                            ))}
                    </div>
                )}
        </header>
    );
}
