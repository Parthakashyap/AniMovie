import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for AniMovie. We value your privacy.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-6">Privacy Policy</h1>
          <div className="space-y-4 text-foreground/80">
            <p>
              We value your privacy.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>We do not collect, store, or share personal data.</li>
              <li>Third-party embeds such as VidSrc may use cookies or tracking technologies under their own policies.</li>
              <li>This site does not use analytics, ads, or user tracking at this time.</li>
              <li>For any privacy concerns, contact <a href="mailto:parthaforwork@outlook.com" className="text-primary hover:underline">parthaforwork@outlook.com</a>.</li>
            </ul>
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
