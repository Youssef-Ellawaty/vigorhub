import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VigorHub - Fitness & Health Management',
  description: 'Comprehensive fitness tracking, nutrition management, progress analytics, and community engagement platform.',
  keywords: ['fitness', 'health', 'tracking', 'athletes', 'workout', 'nutrition'],
  authors: [{ name: 'VigorHub Team' }],
  creator: 'VigorHub',
  publisher: 'VigorHub',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vigorhub.com',
    title: 'VigorHub - Fitness & Health Management',
    description: 'Comprehensive fitness tracking, nutrition management, progress analytics, and community engagement platform.',
    siteName: 'VigorHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VigorHub - Fitness & Health Management',
    description: 'Comprehensive fitness tracking, nutrition management, progress analytics, and community engagement platform.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VigorHub" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
