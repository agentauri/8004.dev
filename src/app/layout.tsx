import type { Metadata } from 'next';
import { JetBrains_Mono, Press_Start_2P, Silkscreen } from 'next/font/google';
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
  title: 'Agent Explorer - ERC-8004 Agent Discovery',
  description:
    'Discover and explore autonomous AI agents registered on the ERC-8004 (Trustless Agents) standard across multiple blockchain networks.',
  keywords: ['ERC-8004', 'AI Agents', 'Blockchain', 'Trustless Agents', 'Web3', 'Agent Discovery'],
  authors: [{ name: 'Agent Explorer' }],
  openGraph: {
    title: 'Agent Explorer - ERC-8004 Agent Discovery',
    description: 'Discover and explore autonomous AI agents registered on the ERC-8004 standard.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agent Explorer - ERC-8004 Agent Discovery',
    description: 'Discover and explore autonomous AI agents registered on the ERC-8004 standard.',
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
      <body className="min-h-screen bg-[var(--pixel-black)] text-[var(--pixel-white)] font-[family-name:var(--font-mono)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
