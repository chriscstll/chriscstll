'use client';

import Image from 'next/image';
import { Project } from '@/data/portfolio';

type Props = {
  project: Project;
  onClick: () => void;
  isDragging?: boolean;
};

export default function ProjectCard({ project, onClick, isDragging = false }: Props) {
  const isPlaceholder = project.status !== 'live';

  return (
    <div
      className="shrink-0 w-90 flex flex-col rounded-lg overflow-hidden border transition-all duration-300 group "
      style={{ borderColor: 'var(--color-border)' }}>
      <div
        className={`relative w-full h-45 overflow-hidden ${isPlaceholder ? 'cursor-default' : 'cursor-pointer'}`}
        style={{ backgroundColor: 'var(--color-background-secondary)' }}
        onClick={
          isPlaceholder
            ? undefined
            : () => {
                if (isDragging) return;
                onClick();
              }
        }>
        {isPlaceholder ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div
              className="text-xs font-medium tracking-widest uppercase px-3 py-1 border"
              style={{ color: 'var(--color-foreground-subtle)', borderColor: 'var(--color-border)' }}>
              {project.status === 'in-progress' ? 'In Progress' : 'Coming Soon'}
            </div>
          </div>
        ) : (
          /* PORJECT IMG */
          <>
            <Image
              src={project.image}
              alt={project.title}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="320px"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />

            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
              <span
                className="border rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-widest"
                style={{
                  color: 'rgba(241, 234, 218, 1)',
                }}>
                View Project
              </span>
            </div>
          </>
        )}
      </div>

      <div
        className="px-4 py-3 flex flex-col gap-1"
        style={{ backgroundColor: 'var(--color-background-card)' }}>
        <h3
          className="font-heading font-bold text-sm"
          style={{ color: isPlaceholder ? 'var(--color-foreground-subtle)' : 'var(--color-foreground)' }}>
          {project.title}
        </h3>

        <p
          className="text-xs leading-relaxed"
          style={{ color: 'var(--color-foreground-subtle)' }}>
          {project.shortDescription}
        </p>

        {/* TECH TAGS */}
        <div className="flex flex-wrap gap-1 mt-1">
          {project.tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-0.5 border rounded-md overflow-hidden"
              style={{ color: 'var(--color-foreground-subtle)', backgroundColor: 'var(--color-background-secondary)' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
