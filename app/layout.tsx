import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VigorHub — Train Harder. Track Smarter.",
  description:
    "VigorHub is the all-in-one fitness platform for athletes, trainees, and professional coaches. Manage workouts, track nutrition, analyse progress, and connect with the community.",
  keywords: ["fitness", "training", "workout", "coaching", "athletes", "nutrition", "VigorHub"],
  authors: [{ name: "VigorHub" }],
  robots: "index, follow",
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#0b0f19" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`bg-[#0b0f19] ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
