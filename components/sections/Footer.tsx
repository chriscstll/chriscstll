'use client';

import { BlurIn } from '@/components/ui/motion-primitives';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { contact, footer } from '@/data/portfolio';
import { useEffect, useState } from 'react';

/* SOCIALS — built from `contact`, empty URLs are dropped */
const socials = [
  contact.github && {
    label: 'GitHub',
    href: contact.github,
    icon: <FaGithub size={14} />,
  },
  contact.linkedin && {
    label: 'LinkedIn',
    href: contact.linkedin,
    icon: <FaLinkedin size={14} />,
  },
].filter(Boolean) as Array<{
  label: string;
  href: string;
  icon: React.ReactNode;
}>;

export default function Footer() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString(footer.location.locale, {
        timeZone: footer.location.timeZone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      setTime(formatted);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer
      className=""
      style={{ backgroundColor: 'var(--color-background-secondary)' }}>
      <BlurIn
        delay={0.5}
        blur={6}
        y={12}
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* IDENTITY + SOCIALS */}
          <p
            className="font-heading text-base font-bold"
            style={{ color: 'var(--color-foreground)' }}>
            {footer.identity.name}
          </p>
          <p
            className="mt-1 text-xs tracking-wide"
            style={{ color: 'var(--color-foreground-muted)' }}>
            {footer.identity.role}
          </p>

          {socials.length > 0 && (
            <ul className="mt-4 flex flex-row items-center gap-5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs transition-colors duration-200 hover:text-accent"
                    style={{ color: 'var(--color-foreground-muted)' }}>
                    <span aria-hidden="true">{s.icon}</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* META */}
          <div className="mt-8 flex flex-col gap-1.5 text-xs">
            <p style={{ color: 'var(--color-foreground-muted)' }}>
              {footer.location.city}
              {time ? ` · ${time}` : ''}
            </p>
            <p
              suppressHydrationWarning
              style={{ color: 'var(--color-foreground-subtle)' }}>
              {footer.copyright}
            </p>
          </div>
        </div>
      </BlurIn>
    </footer>
  );
}
