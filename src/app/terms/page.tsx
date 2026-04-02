'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-heading font-bold mb-8 glow-text">
          Terms of Service
        </h1>

        <div className="space-y-6 text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using DreamSense AI, you agree to be bound by these Terms of Service. If you do not agree to any of these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              2. Service Description
            </h2>
            <p>
              DreamSense AI provides AI-powered dream interpretation services combining psychological theories with traditional cultural wisdom. Our interpretations are for informational and entertainment purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              3. Disclaimer
            </h2>
            <p>
              <strong>IMPORTANT:</strong> Dream interpretations provided by DreamSense AI are NOT:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Professional medical or psychological advice</li>
              <li>A substitute for professional mental health treatment</li>
              <li>A diagnosis or cure for any medical or psychological condition</li>
            </ul>
            <p className="mt-2">
              If you are experiencing mental health concerns, please consult with a qualified mental health professional.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              4. User Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              5. User Content
            </h2>
            <p>
              By submitting dreams or other content to our service, you grant DreamSense AI the right to use this content to improve our service and AI models. You retain all ownership rights to your original content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              6. Prohibited Activities
            </h2>
            <p>
              You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Harass, abuse, or discriminate against others</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Submit false, defamatory, or malicious content</li>
              <li>Use automated means to access or scrape our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              DreamSense AI is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              8. Subscription and Payment
            </h2>
            <p>
              Subscription fees are billed according to your chosen plan. You may cancel your subscription at any time, and cancellations take effect at the end of your current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              9. Termination
            </h2>
            <p>
              We reserve the right to terminate or suspend your account if you violate these terms or for any reason at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              10. Changes to Terms
            </h2>
            <p>
              We may modify these terms at any time. Your continued use of the service constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-accent mb-3">
              11. Contact
            </h2>
            <p>
              For questions about these terms, please{' '}
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
