'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-heading font-bold mb-8 glow-text">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us, such as:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Account information (email, password)</li>
              <li>Dream descriptions you submit for interpretation</li>
              <li>Usage data and interaction patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              2. How We Use Your Information
            </h2>
            <p>
              Your information is used to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Provide dream interpretation services</li>
              <li>Improve our AI models and service quality</li>
              <li>Maintain account security</li>
              <li>Send service-related announcements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              3. Data Protection
            </h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access, disclosure, or destruction. All communication is encrypted using industry-standard SSL/TLS protocols.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              4. Third-Party Services
            </h2>
            <p>
              We use third-party AI services (DeepSeek API) to provide dream interpretations. We do not share personally identifiable information with these services beyond what is necessary to provide the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              5. Your Rights
            </h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              6. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              7. Contact Us
            </h2>
            <p>
              If you have any questions about this privacy policy, please{' '}
              <Link href="/contact" className="text-accent hover:underline">
                contact us
              </Link>
              .
            </p>
          </section>

          <p className="text-sm text-text-secondary/60 mt-8 pt-8 border-t border-accent/20">
            Last updated: April 1, 2026
          </p>
        </div>

        <div className="mt-12">
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
