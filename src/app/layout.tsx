import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'DreamSense AI - Unlock Your Dream Secrets',
  description: 'AI-powered dream interpretation combining Eastern wisdom and Western psychology',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-primary`}>
        <Navbar />
        <main>
          {children}
        </main>
        <footer className="bg-secondary/50 border-t border-accent/20 py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 text-center text-text-secondary">
            <p>© 2026 DreamSense AI. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-4">
              <Link href="/privacy" className="hover:text-accent">Privacy</Link>
              <Link href="/terms" className="hover:text-accent">Terms</Link>
              <Link href="/contact" className="hover:text-accent">Contact</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
