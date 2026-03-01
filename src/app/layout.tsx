import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThreeScene } from "@/app/ThreeScene";
import { ClientEffects } from "@/app/ClientEffects";

const orbitron = Orbitron({
  variable: "--font-orbitron-var",
  subsets: ["latin"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani-var",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adrian Syah Abidin — DevOps · QA/SDET · Backend Engineer",
  description:
    "Portfolio of Adrian Syah Abidin — DevOps, QA/SDET, and Backend Engineer. Final-year IT student at UGM with experience at Tokopedia (ByteDance), Qiscus, and Bitbybit. AWS & CompTIA certified.",
  openGraph: {
    title: "Adrian Syah Abidin — DevOps · QA/SDET · Backend Engineer",
    description:
      "Explore projects, experience, and certifications. DevOps, QA, and Backend engineering.",
    type: "website",
    url: "https://adriansyahabidin.vercel.app",
    siteName: "Adrian Syah Abidin Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adrian Syah Abidin — Portfolio",
    description:
      "DevOps, QA/SDET, and Backend Engineer. AWS & CompTIA certified.",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://adriansyahabidin.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body className="antialiased" style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ThreeScene />
        <ClientEffects />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
