import type { Metadata } from 'next';
import { Fraunces, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

const sans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'Rolins Montessori Academy',
    template: '%s | Rolins Montessori Academy',
  },
  description:
    'Rolins Montessori Academy — Nursery, Primary and Secondary education in Alakahia, Port Harcourt. Montessori foundations with the Nigerian standard curriculum.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
