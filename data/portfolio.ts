import { title } from "process";

export const siteConfig = {
    name: 'Christian M. Castillo',
    title: 'Christian M. Castillo',
    description: 'Christian Castillo is a frontend developer focused on creating scalable, intuitive and seamless digital experiences',
    url: 'https://stillindevelopment.com',
    ogImage: '/og-image.jpg'
};

export const hero = {
    name: 'Christian M. Castillo',
    title: 'Frontend Developer',
    tagline: 'Crafting ideas into reality',
    cta: {
        contactbtn: { label: 'Contact Me', href: '#contact'},
    },
};

export const about = {
    bio: [
        'Christian Castillo is a frontend developer based in the Philippines, focused on building thoughtful web applications using React, Typescript and Tailwind CSS',
        "I'm open to opportunities where i can contribute to meaningful work to keep learning and developing my skills as a frontend developer",
    ],
    resumeUrl: '/resume'
};

export type Project = {
    title: string;
    description: string;
    tech: string[];
    liveUrl?: string;
    githubUrl?: string;
    image: string;
    featured: boolean;
};

export const projects: Project[] = [
    {
    title: "Project One",
    description:
      "What it does and what problem it solves — one or two sentences. Not a list of features.",
    tech: ["React", "Next.js", "Tailwind CSS"],
    liveUrl: "https://project-one.com",
    githubUrl: "https://github.com/yourusername/project-one",
    image: "/projects/project-one.png",
    featured: true,
  },
    {
    title: "Project Two",
    description:
      "What it does and what problem it solves — one or two sentences. Not a list of features.",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://project-two.com",
    githubUrl: "https://github.com/yourusername/project-two",
    image: "/projects/project-two.png",
    featured: true,
  },
  {
    title: "Project Three",
    description:
      "What it does and what problem it solves — one or two sentences. Not a list of features.",
    tech: ["JavaScript", "CSS", "HTML"],
    liveUrl: undefined,
    githubUrl: "https://github.com/yourusername/project-three",
    image: "/projects/project-three.png",
    featured: false,
  },
];

export const skills = {
    language: ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
    frameworks: ['Next.js', 'Tailwind CSS'],
};

export const contact = {
    email: 'castilloxtiann@gmail.com',
    linkedin: '',
    github: 'https://github.com/chriscstll',
    formspreeEndpoint: 'https://formspree.io/f/your-form-id',
};

export const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: 'Frontend Developer',
    description: siteConfig.description,
    sameAs: [
        contact.linkedin,
        contact.github,
    ],
};