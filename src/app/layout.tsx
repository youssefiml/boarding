import type { Metadata } from 'next';
import { Outfit, Space_Mono, Syne } from 'next/font/google';
import type { ReactNode } from 'react';

import '@/index.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Boarding',
  description: "Plateforme pour trouver un stage a l'etranger avec un accompagnement guide.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${outfit.variable} ${syne.variable} ${spaceMono.variable}`}>{children}</body>
    </html>
  );
}
