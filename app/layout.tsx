import { siteConfig, structuredData } from '@/data/portfolio';
import { Bricolage_Grotesque, Lora } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import SmoothScroll from '@/components/SmoothScroll';
import type { Metadata } from 'next';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bricolage',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,

  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Frontend Developer`,
      },
    ],
  },

  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${bricolage.variable}`}
      suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <SmoothScroll />
        </ThemeProvider>
      </body>
    </html>
  );
}

/* Every section says the same thing from a different angle:

| Section  | Line                                                                 | Idea                |
| -------- | -------------------------------------------------------------------- | ------------------- |
| Hero     | _The decisions nobody notices are the ones that matter most._        | Invisible decisions |
| Projects | _None of these changed anything. All of them changed me._            | Invisible change    |
| Skills   | _The stack is visible. The judgment isn't._                          | Invisible judgment  |
| About    | _Some hours are spent. Some are invested. They look identical._      | Invisible time      |
| Contact  | _Everything begins with a message. Before the work, there's a word._ | Invisible origin    |

One argument emerges: **the thing you can't see is the thing that matters.** */
