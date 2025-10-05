import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for AniMovie. By accessing this website, you agree to these terms.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-6">Terms of Use</h1>
          <div className="space-y-4 text-foreground/80">
            <p>
              By accessing this website, you agree to the following terms:
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>This site provides links or embeds to publicly available third-party content and does not host any copyrighted files.</li>
              <li>All materials are for personal and non-commercial use only.</li>
              <li>We are not affiliated with, endorsed by, or connected to any production companies or content providers.</li>
              <li>We make no warranties about the completeness, reliability, or accuracy of information displayed here.</li>
              <li>We reserve the right to remove or block any content upon valid copyright request.</li>
              <li>Any legal disputes shall be governed by the laws of India and subject to the exclusive jurisdiction of the courts in India.</li>
            </ol>
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
