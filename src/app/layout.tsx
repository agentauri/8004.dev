import type { Metadata } from 'next';
import { JetBrains_Mono, Press_Start_2P, Silkscreen } from 'next/font/google';

import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/organisms/json-ld';
import './globals.css';
import { Providers } from './providers';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel-display',
  display: 'swap',
});

const silkscreen = Silkscreen({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel-body',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.8004.dev'),
  title: {
    default: 'Agent Explorer - ERC-8004 Agent Discovery',
    template: '%s | Agent Explorer',
  },
  description:
    'Discover and explore autonomous AI agents registered on the ERC-8004 (Trustless Agents) standard across multiple blockchain networks.',
  keywords: [
    'ERC-8004',
    'AI Agents',
    'Blockchain',
    'Trustless Agents',
    'Web3',
    'Agent Discovery',
    'MCP Protocol',
    'A2A Protocol',
    'Ethereum',
    'Base',
    'Polygon',
  ],
  authors: [{ name: 'Agent Explorer' }],
  creator: 'Agent Explorer',
  publisher: 'Agent Explorer',
  alternates: {
    canonical: 'https://www.8004.dev',
  },
  openGraph: {
    title: 'Agent Explorer - ERC-8004 Agent Discovery',
    description:
      'Discover and explore autonomous AI agents registered on the ERC-8004 (Trustless Agents) standard across multiple blockchain networks.',
    url: 'https://www.8004.dev',
    siteName: 'Agent Explorer',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Agent Explorer - ERC-8004 Agent Discovery Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agent Explorer - ERC-8004 Agent Discovery',
    description:
      'Discover and explore autonomous AI agents registered on the ERC-8004 (Trustless Agents) standard.',
    images: ['/api/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: 'your-google-verification-code',
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
      className={`${pressStart2P.variable} ${silkscreen.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className="min-h-screen bg-[var(--pixel-black)] text-[var(--pixel-white)] font-[family-name:var(--font-mono)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
