'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 这里可以添加实际的邮件发送逻辑
    // 暂时只显示成功消息
    try {
      // 模拟提交
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitMessage({
        type: 'success',
        text: 'Thank you for your message! We will get back to you soon.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitMessage(null), 5000);
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-center mb-4 glow-text">
          Contact Us
        </h1>
        <p className="text-center text-text-secondary mb-12">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-heading font-semibold text-accent mb-2">
                📧 Email
              </h3>
              <a 
                href="mailto:support@dreamsenseai.org" 
                className="text-text-secondary hover:text-accent transition-colors"
              >
                support@dreamsenseai.org
              </a>
            </div>

            <div>
              <h3 className="text-xl font-heading font-semibold text-accent mb-2">
                🌐 Social Media
              </h3>
              <div className="space-y-2 text-text-secondary">
                <p>Follow us for updates and tips on dream interpretation:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Twitter / X: @DreamSenseAI</li>
                  <li>• Instagram: @DreamSenseAI</li>
                  <li>• Discord: DreamSense Community</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-heading font-semibold text-accent mb-2">
                ⏱️ Response Time
              </h3>
              <p className="text-text-secondary">
                We typically respond to inquiries within 24-48 hours during business days.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-secondary/50 border border-accent/20 rounded-xl text-text-primary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-secondary/50 border border-accent/20 rounded-xl text-text-primary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-secondary/50 border border-accent/20 rounded-xl text-text-primary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
              >
                <option value="">Select a subject</option>
                <option value="feedback">Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="partnership">Partnership Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-secondary/50 border border-accent/20 rounded-xl text-text-primary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 resize-none"
                placeholder="Tell us your thoughts..."
              />
            </div>

            {submitMessage && (
              <div className={`p-4 rounded-lg ${
                submitMessage.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                  : 'bg-red-500/20 border border-red-500/50 text-red-400'
              }`}>
                {submitMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-accent hover:bg-accent/80 disabled:bg-accent/50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all hover:scale-[1.02]"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
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
