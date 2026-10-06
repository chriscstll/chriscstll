export const siteConfig = {
  name: 'Christian Castillo',
  title: 'Christian Castillo',
  description: 'Frontend developer drawn to the logic of how things work and the craft of making them work well.',
  url: 'https://chriscstll.vercel.app/',
  ogImage: '/og-image.jpg',
};

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export const hero = {
  tagline: '\u201CThe decisions nobody notices are the ones that matter most\u201D',
  subtitle: 'I craft seamless web applications through thoughtful engineering.',
  cta: {
    contactbtn: { label: 'Say something', href: '#contact' },
  },
};

export const about = {
  heading: 'Hello!',
  name: "I'm Christian Castillo",
  stats: [
    { value: '1+', label: 'years' },
    { value: '6', label: 'projects' },
  ],
  privacyNote: "NDA'd client projects aren't listed.",
  cards: [
    {
      id: 'frontend',
      label: 'Frontend Developer',
      description: 'Less than it looks. More than it shows.',
      content: {
        title: 'Frontend Developer',
        body: "I've been building frontends for two years.In that time I've worked with clients, built for businesses and consumers, and shipped personal projects on the side.Every one of them taught me something different. Some taught me how to work with a team, others taught me how to work alone. Client work taught me how to listen. Personal work taught me how to build things nobody asked for.",
      },
    },
    {
      id: 'the-unlogged-hours',
      label: 'Unlogged hours',
      description: 'Some hours are spent. Some are invested. They look identical.',
      content: {
        title: 'Unlogged hours',
        body: 'When I’m not coding, I’m usually looking for somewhere to go or something to do outside. I enjoy cars, going on long drives by myself, doing off-road trails, camping, and overlanding. I also spend a fair amount of time in the kitchen. Sometimes I’m trying out a new recipe, sometimes I’m just cooking whatever I feel like. These are the things that help me slow down, clear my head, and enjoy some time away from the screen.',
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
  status: 'live' | 'coming-soon' | 'in-progress';
};

export const projectsTagline = 'None of these changed anything. All of them changed me';
export const projects: Project[] = [
  {
    title: 'J4G Autoworks',
    shortDescription: '',
    description:
      'I built a web-based booking system for J4G Autoworks to simplify how customers schedule automotive services. The application uses Google Apps Script for booking management and automated email notifications, reducing the need for manual appointment handling.',
    tech: ['VS Code', 'GitHub', 'Git', 'HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://chriscstll.github.io/j4g_Autoworks/',
    githubUrl: 'https://github.com/chriscstll/j4g_Autoworks',
    image: '/projects/project-one.png',
    status: 'live',
  },
  {
    title: 'King Panda Defense',
    shortDescription: '',
    description:
      'A responsive frontend experience developed for King Panda Defense to establish a professional digital presence and improve how customers discover and engage with its services.',
    tech: ['VS Code', 'GitHub', 'Git', 'HTML', 'SCSS', 'JavaScript'],
    liveUrl: 'https://chriscstll.github.io/KingPandaDefense/',
    githubUrl: 'https://github.com/chriscstll/KingPandaDefense',
    image: '/projects/project-two.png',
    status: 'live',
  },
  {
    title: 'Project Three',
    shortDescription: 'Something exciting is coming.',
    description: 'This project is currently in progress. Check back soon.',
    tech: ['React', 'Next.js'],
    image: '/projects/placeholder.png',
    status: 'in-progress',
  },
  {
    title: 'Project Four',
    shortDescription: 'Something exciting is coming.',
    description: 'This project is currently in progress. Check back soon.',
    tech: ['TypeScript', 'Tailwind CSS'],
    image: '/projects/placeholder.png',
    status: 'coming-soon',
  },
  {
    title: 'Project Five',
    shortDescription: 'Something exciting is coming.',
    description: 'This project is currently in progress. Check back soon.',
    tech: ['React', 'Next.js'],
    image: '/projects/placeholder.png',
    status: 'coming-soon',
  },
  {
    title: 'Project Six',
    shortDescription: 'Something exciting is coming.',
    description: 'This project is currently in progress. Check back soon.',
    tech: ['React', 'Next.js'],
    image: '/projects/placeholder.png',
    status: 'coming-soon',
  },
  {
    title: 'Project Seven',
    shortDescription: 'Something exciting is coming.',
    description: 'This project is currently in progress. Check back soon.',
    tech: ['React', 'Next.js'],
    image: '/projects/placeholder.png',
    status: 'coming-soon',
  },
];

export const skillsTagline = "The stack is visible. The judgment isn't.";
export const skills = {
  language: ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
  libraries: ['React', 'Framer Motion'],
  frameworks: ['Vue.js', 'Next.js', 'Tailwind CSS', 'SCSS'],
  tools: ['Git', 'GitHub', 'VS Code', 'Vercel'],
};

export const contact = {
  tagline: "Everything begins with a message. Before the work, there's a word.",
  email: 'castilloxtiann@gmail.com',
  linkedin: 'https://linkedin.com/in/placeholder',
  github: 'https://github.com/chriscstll',
  formspreeEndpoint: 'https://formspree.io/f/myezaryz',
};

export const footer = {
  identity: {
    name: 'Christian M. Castillo',
    role: 'Frontend Developer',
  },

  nav: [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ],

  location: {
    city: 'Manila',
    timeZone: 'Asia/Manila',
    locale: 'en-PH',
  },

  startYear: 2026,
  year: new Date().getFullYear(),
  get copyright() {
    return this.year === this.startYear
      ? `© ${this.year} ${this.identity.name}`
      : `© ${this.startYear}–${this.year} ${this.identity.name}`;
  },

  backToTop: { label: 'Back to top', href: '#hero' },
};

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: 'Frontend Developer',
  description: siteConfig.description,
  image: `${siteConfig.url}/profile-photo.png`,
};
