import type { Metadata } from 'next';
import { Bricolage_Grotesque, Lora } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import Script from 'next/script';
import { siteConfig, structuredData } from '@/data/portfolio';

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

  keywords: [siteConfig.name, 'Frontend Developer', 'TypeScript', 'React Developer', 'Tailwind CSS'],

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

  /*  Get this value from: search.google.com/search-console
  verification: {
    google: "your-verification-token",
  }, */
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

        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem("theme");
                  if (stored === "dark") {
                    document.documentElement.setAttribute("data-theme", "dark");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
