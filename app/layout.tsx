import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig, contact, structuredData } from "@/data/portfolio"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    canonical: '/'
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.url,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Frontend Developer`
      },
    ],
  },

  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,

  keywords: [
    siteConfig.name,
    'Frontend Developer',
    'React Developer',
    'Tailwind CSS',
    'TypeScript',
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1
    },
  },

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

 /*  Get this value from: search.google.com/search-console
  verification: {
    google: "your-verification-token",
  }, */

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressContentEditableWarning>
        <head>
          <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }} />
        </head>
        <body className="bg-background text-foreground font-sans antialiased">
          {children}
        </body>
    </html>
  );
  
}
