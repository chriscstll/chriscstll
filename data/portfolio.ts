import { title } from "process";

export const siteConfig = {
  name: "Christian M. Castillo",
  title: "Christian M. Castillo",
  description:
    "Christian Castillo is a frontend developer focused on creating scalable, intuitive and seamless digital experiences",
  url: "https://stillindevelopment.com",
  ogImage: "/og-image.jpg",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  name: "Christian M. Castillo",
  title: "Frontend Developer",
  tagline: "\u201CThe decisions nobody notices are the ones that matter most\u201D",
  cta: {
    contactbtn: { label: "Contact Me", href: "#contact" },
  },
};

export const about = {
  heading: "Hello!",
  name: "I'm Christian Castillo",
  stats: [
    { value: "2", label: "years" },
    { value: "8", label: "projects" },
  ],
  privacyNote: "NDA'd client projects aren't listed.",
  bio: [
    "Christian Castillo is a frontend developer based in the Philippines, focused on building thoughtful web applications using React, Typescript and Tailwind CSS",
    "I'm open to opportunities where i can contribute to meaningful work to keep learning and developing my skills as a frontend developer",
  ],
  resumeUrl: "/resume",
  cards: [
    {
      id: "frontend",
      label: "Frontend Developer",
      description: "What I do and how I approach building for the web.",
      content: {
        title: "Frontend Developer",
        body: "Placeholder — describe your frontend approach, what you enjoy building, and what kind of work you're looking for.",
      },
    },
    {
      id: "the-unlogged-hours",
      label: "The unlogged hours",
      description: "Some hours are spent. Some are invested. They look identical.",
      content: {
        title: "Unlogged hours",
        body: "Reading, mostly — sci-fi, essays, anything that isn't a screen. Long walks with no destination. Slow coffee before the day starts. Rebuilding my setup every few months for no clear reason. Cooking the same five dishes well. None of it looks productive. All of it is. The ideas that end up in the work almost never arrive while I'm working — they arrive on a walk, in the shower, mid-conversation about something else entirely. The best hours don't show up in any log.",
      },
    },
  ],
};

export type Project = {
  title: string;
  shortDescription: string;
  description: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  image: string;
  status: "live" | "coming-soon" | "in-progress";
};

export const projectsTagline = "None of these changed anything. All of them changed me";
export const projects: Project[] = [
  {
    title: "Your Real Project One",
    shortDescription: "One line — what it does.",
    description: "Two sentences — what it does and what problem it solves.",
    tech: ["HTML", "CSS", "JavaScript"],
    liveUrl: "https://chriscstll.github.io/j4g_Autoworks/",
    githubUrl: "https://github.com/chriscstll/j4g_Autoworks",
    image: "/projects/project-one.png",
    status: "live",
  },
  {
    title: "Your Real Project Two",
    shortDescription: "One line — what it does.",
    description: "Two sentences — what it does and what problem it solves.",
    tech: ["HTML", "SCSS", "JavaScript"],
    liveUrl: "https://chriscstll.github.io/KingPandaDefense/",
    githubUrl: "https://github.com/chriscstll/KingPandaDefense",
    image: "/projects/project-two.png",
    status: "live",
  },
  {
    title: "Project Three",
    shortDescription: "Something exciting is coming.",
    description: "This project is currently in progress. Check back soon.",
    tech: ["React", "Next.js"],
    image: "/projects/placeholder.png",
    status: "in-progress",
  },
  {
    title: "Project Four",
    shortDescription: "Something exciting is coming.",
    description: "This project is currently in progress. Check back soon.",
    tech: ["TypeScript", "Tailwind CSS"],
    image: "/projects/placeholder.png",
    status: "coming-soon",
  },
  {
    title: "Project Five",
    shortDescription: "Something exciting is coming.",
    description: "This project is currently in progress. Check back soon.",
    tech: ["React", "Next.js"],
    image: "/projects/placeholder.png",
    status: "coming-soon",
  },
  {
    title: "Project Six",
    shortDescription: "Something exciting is coming.",
    description: "This project is currently in progress. Check back soon.",
    tech: ["React", "Next.js"],
    image: "/projects/placeholder.png",
    status: "coming-soon",
  },
];

export const skillsTagline = "The stack is visible. The judgment isn't.";
export const skills = {
  language: ["JavaScript", "TypeScript", "HTML", "CSS"],
  libraries: ["React", "Framer Motion"],
  frameworks: ["Vue.js", "Next.js", "Tailwind CSS", "SCSS"],
  tools: ["Git", "GitHub", "VS Code", "Vercel"],
};

export const contact = {
  tagline: "Everything begins with a message. Before the work, there's a word.",
  email: "castilloxtiann@gmail.com",
  linkedin: "https://linkedin.com/in/placeholder",
  github: "https://github.com/chriscstll",
  formspreeEndpoint: "https://formspree.io/f/your-form-id",
};

export const footer = {
  identity: {
    name: "Christian M. Castillo",
    role: "Frontend Developer",
  },

  nav: [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],

  location: {
    city: "Manila",
    timeZone: "Asia/Manila",
    locale: "en-PH",
  },

  startYear: 2026,
  year: new Date().getFullYear(),
  get copyright() {
    return this.year === this.startYear
      ? `© ${this.year} ${this.identity.name}`
      : `© ${this.startYear}–${this.year} ${this.identity.name}`;
  },

  backToTop: { label: "Back to top", href: "#hero" },
};

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: "Frontend Developer",
  description: siteConfig.description,
  sameAs: [contact.linkedin, contact.github],
};
