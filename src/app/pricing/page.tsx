'use client';

import { useState } from 'react';

const plans = [
  {
    name: 'Pay per Dream',
    price: '$1.99',
    period: '/dream',
    description: 'Perfect for occasional dream explorers',
    features: [
      '1 dream interpretation',
      'Detailed symbol analysis',
      'Psychological insight',
      'Practical guidance',
    ],
    cta: 'Get Started',
    popular: false,
    priceId: 'prod_1ZDzIytYEFMDwmnHP77D3E',
  },
  {
    name: 'Monthly',
    price: '$9.99',
    period: '/month',
    description: 'Best for regular dreamers',
    features: [
      'Unlimited interpretations',
      'Priority processing',
      'Dream history storage',
      'All analysis features',
    ],
    cta: 'Subscribe Monthly',
    popular: true,
    priceId: 'prod_hsXcKCUwYE2iYFtwM4ONK',
  },
  {
    name: 'Yearly',
    price: '$99.99',
    period: '/year',
    description: 'Best value - save 17%',
    features: [
      'Everything in Monthly',
      '2 months free',
      'Early access to new features',
      'Premium support',
    ],
    cta: 'Subscribe Yearly',
    popular: false,
    priceId: 'prod_6JtxxrOfoTScuZx7AtILYh',
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<number | null>(null);

  const handleSubscribe = async (plan: typeof plans[0], index: number) => {
    try {
      setLoading(index);

      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          successUrl: `${window.location.origin}/my-dreams`,
        }),
      });


      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert('创建支付失败，请重试');
        setLoading(null);
      }
    } catch (error) {
      console.error('支付错误:', error);
      alert('支付出错，请重试');
      setLoading(null);
    }
  };
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-center mb-4 glow-text">
          Choose Your Plan
        </h1>
        <p className="text-center text-text-secondary mb-12">
          Unlock the full potential of your dreams
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl transition-all hover:scale-105 ${
                plan.popular
                  ? 'bg-secondary border-2 border-accent glow'
                  : 'bg-secondary/50 border border-accent/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-heading font-semibold mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-accent">{plan.price}</span>
                <span className="text-text-secondary">{plan.period}</span>
              </div>
              <p className="text-text-secondary mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-success">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan, index)}
                disabled={loading === index}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-accent hover:bg-accent/80 glow'
                    : 'bg-accent-secondary hover:bg-accent-secondary/80'
                } ${loading === index ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading === index ? 'Processing...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-text-secondary">
          <p>🔒 Secure payment powered by Creem</p>
          <p className="mt-2">Cancel anytime. No hidden fees.</p>
        </div>
      </div>
    </div>
  );
}