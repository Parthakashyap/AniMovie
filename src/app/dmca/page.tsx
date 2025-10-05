import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DMCA Notice & Takedown Policy',
  description: 'DMCA Notice & Takedown Policy for AniMovie. How to file a copyright infringement notice.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function DMCAPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-6">DMCA Notice & Takedown Policy</h1>
          <div className="space-y-4 text-foreground/80">
            <p>
              If you are a copyright owner or authorized representative and believe that any content linked on this website infringes your rights, please send a notice containing the following information:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Identification of the copyrighted work claimed to have been infringed;</li>
              <li>The URL of the specific page containing the infringing material;</li>
              <li>Your contact information (email and phone number);</li>
              <li>A statement that you believe in good faith that the use is unauthorized;</li>
              <li>A statement that the information in the notice is accurate and that you are authorized to act on behalf of the owner.</li>
            </ul>
            <p>
              Upon valid notice, we will remove or disable access to the material.
            </p>
            <p>
              Contact: <a href="mailto:parthaforwork@outlook.com" className="text-primary hover:underline">parthaforwork@outlook.com</a>
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
