import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer for AniMovie. This website does not host or store any video, image, or manga files on its servers.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-6">Disclaimer</h1>
          <div className="space-y-4 text-foreground/80">
            <p>
              This website does not host or store any video, image, or manga files on its servers.
            </p>
            <p>
              All media content is provided by publicly available third-party services, including VidSrc.
            </p>
            <p>
              We are not responsible for the accuracy, legality, or content of any external sources.
            </p>
            <p>
              If you believe any link on this site infringes copyright, please contact us.
            </p>
          </div>
          <div className="mt-12 text-center">
            <Link href="/" className="text-primary hover:underline">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
