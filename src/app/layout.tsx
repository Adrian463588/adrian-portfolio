import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SpatialWidget } from "@/components/three/SpatialWidget";

const displaySans = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://adriansyahabidin.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Adrian Syah Abidin — Software, DevOps & QA/SDET Engineer",
    template: "%s | Adrian Syah Abidin",
  },
  description:
    "Engineering portfolio of Adrian Syah Abidin — Software Quality Control Engineer & Software Engineer specializing in QA Automation (Cypress, Playwright), Jenkins CI/CD, Enterprise Financial Systems (AOL UniPaaS, Magic xpa), Backend, and Applied AI. Past roles across Berijalan Techno Center (ACC Group), Qiscus, Tokopedia (ByteDance), and Bitbybit Studio.",
  keywords: [
    "Adrian Syah Abidin",
    "Software Quality Control Engineer",
    "Quality Assurance Engineer",
    "QA Automation",
    "SDET",
    "Cypress",
    "Jenkins",
    "Enterprise Software Testing",
    "Financial Systems",
    "Application Modernization",
    "Automotive Financing",
    "DevOps",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Adrian Syah Abidin — Software, QA Automation & Enterprise Systems Engineer",
    description:
      "Enterprise automotive financing QA case studies, QA automation suites, DevOps/DevSecOps infrastructure, and offline-first AI engineering projects.",
    type: "website",
    url: SITE_URL,
    siteName: "Adrian Syah Abidin Portfolio",
    images: [
      {
        url: "/projects/automate-plus-workbench.webp",
        width: 1200,
        height: 750,
        alt: "Adrian Syah Abidin — Engineering Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adrian Syah Abidin — Software, QA Automation & Enterprise Systems Engineer",
    description:
      "Software Engineer portfolio spanning Enterprise Quality Engineering, Cypress/Jenkins CI, DevOps, Backend APIs, Android, and On-Device AI.",
    images: ["/projects/automate-plus-workbench.webp"],
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Adrian Syah Abidin",
  url: SITE_URL,
  email: "mailto:adriansyah1230@gmail.com",
  jobTitle: "Software Engineer & Software Quality Control Engineer",
  description:
    "Software engineer with experience in enterprise automotive financing QA, Cypress test automation, Jenkins CI integration, DevOps infrastructure, and offline-first AI applications.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Yogyakarta",
    addressCountry: "ID",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Universitas Gadjah Mada",
  },
  sameAs: [
    "https://github.com/Adrian463588",
    "https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/",
    "https://medium.com/@adriansyah1230",
  ],
  knowsAbout: [
    "Software Engineering",
    "Software Quality Control",
    "QA Automation",
    "SDET",
    "Cypress",
    "Jenkins CI",
    "Enterprise Software Testing",
    "Automotive Financing Systems",
    "Application Modernization",
    "DevOps & DevSecOps",
    "Backend Engineering",
    "Android Development",
    "On-Device AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displaySans.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-[#08090B] text-[#F1F3F5] antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SpatialWidget />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
