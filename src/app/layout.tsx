import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: {
    template: '%s | AniMovie',
    default: 'AniMovie - Watch Anime, Manga & Movies Online',
  },
  description: 'Your one-stop platform for streaming the latest anime, reading popular manga, and watching movies. All for free, with sub and dub options available.',
};

function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
          <p>&copy; {new Date().getFullYear()} AniMovie. All Rights Reserved.</p>
          <p className="max-w-md text-xs">
            All media content is provided by third-party services. 
            AniMovie does not claim ownership of any anime, movies, TV shows, or manga linked or embedded on this site.
          </p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
          <Link href="/dmca" className="hover:text-primary transition-colors">DMCA Policy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </nav>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn('font-sans antialiased flex flex-col min-h-screen', nunito.variable)}>
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
