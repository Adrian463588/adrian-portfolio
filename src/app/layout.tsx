import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SpatialWidget } from "@/components/three/SpatialWidget";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { DesktopCursor } from "@/components/motion/DesktopCursor";
import { MotionProvider } from "@/context/MotionContext";

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
    default: "Adrian Syah Abidin | Software & QA Automation Engineer",
    template: "%s | Adrian Syah Abidin",
  },
  description:
    "Explore Adrian Syah Abidin's portfolio, featuring enterprise software testing, Cypress automation, DevOps, and personal engineering projects.",
  openGraph: {
    title: "Adrian Syah Abidin | Software & QA Automation Engineer",
    description:
      "Portfolio covering enterprise software testing, Cypress automation, Jenkins CI, DevOps infrastructure, Android apps, and applied AI.",
    type: "website",
    url: SITE_URL,
    siteName: "Adrian Syah Abidin Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Adrian Syah Abidin — Software & QA Automation Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adrian Syah Abidin | Software & QA Automation Engineer",
    description:
      "Portfolio covering enterprise software testing, Cypress automation, DevOps infrastructure, Android apps, and applied AI.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  verification: {
    google: "P4O6B5PWmL-5E0i5XRbfkOSaPcop92urgS2lk-IAZ5s",
  },
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
      <body className="min-h-screen bg-[#08090C] text-[#F2F0EC] antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <MotionProvider>
          <SpatialWidget />
          <DesktopCursor />
          <SmoothScrollProvider>
            <div className="relative z-10 flex min-h-screen flex-col">
              <Navbar />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </SmoothScrollProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
