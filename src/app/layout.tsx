import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Mero Sahakari | Together, for a better tomorrow',
    template: '%s | Mero Sahakari',
  },
  description:
    'A warm, accessible sample website for a Nepali cooperative. Explore illustrative savings, loans, member services and the people behind Mero Sahakari.',
  applicationName: 'Mero Sahakari',
  robots: { index: true, follow: true },
  icons: { icon: '/images/brand/favicon.png', apple: '/images/brand/apple-touch-icon.png' },
  openGraph: {
    type: 'website',
    locale: 'en_NP',
    siteName: 'Mero Sahakari',
    title: 'Mero Sahakari',
    description: 'Small steps. Shared hopes. A sample cooperative website for Nepal.',
    images: [
      {
        url: '/images/hero-cooperative.webp',
        width: 1440,
        height: 960,
        alt: 'Savings supporting homes, education and farming in a Nepali cooperative',
      },
    ],
  },
};
export const viewport: Viewport = { themeColor: '#234b3c' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/dm-sans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
