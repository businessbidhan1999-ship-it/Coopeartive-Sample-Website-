// src/app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Topbar } from "@/components/layout/Topbar";
import { I18nWrapper } from "@/components/layout/I18nWrapper";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.shortName} – ${siteConfig.name}`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description:
    "Royal Multipurpose Cooperative Society Ltd. – Empowering communities in Nepal since 1998 through savings, loans, microfinance, and financial inclusion.",
  keywords: ["cooperative", "Nepal", "savings", "loan", "microfinance", "RMCL", "Kathmandu"],
  authors: [{ name: "RMCL" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.tagline,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <I18nWrapper>
          <Topbar />
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </I18nWrapper>
      </body>
    </html>
  );
}
