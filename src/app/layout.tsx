import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SpatialWidget } from "@/components/three/SpatialWidget";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { DesktopCursor } from "@/components/motion/DesktopCursor";
import { MotionProvider } from "@/context/MotionContext";

import { SITE_CONFIG } from "@/config/site.config";

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

export const viewport: Viewport = {
  themeColor: "#08090C",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  applicationName: SITE_CONFIG.name,
  title: {
    default: SITE_CONFIG.titleDefault,
    template: SITE_CONFIG.titleTemplate,
  },
  description: SITE_CONFIG.description,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_CONFIG.shortName,
  },
  openGraph: {
    title: SITE_CONFIG.titleDefault,
    description: SITE_CONFIG.description,
    type: "website",
    locale: SITE_CONFIG.locale,
    url: `${SITE_CONFIG.url}/`,
    siteName: SITE_CONFIG.siteName,
    images: [SITE_CONFIG.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.titleDefault,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
  robots: { index: true, follow: true },
  verification: {
    google: SITE_CONFIG.verification.google,
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
