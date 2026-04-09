'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateDeviceFingerprint } from '@/lib/device-fingerprint';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [banned, setBanned] = useState<{ reason: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceFingerprint, setDeviceFingerprint] = useState('');

  useEffect(() => {
    // 检查是否已有设备指纹，没有则生成
    let fp = localStorage.getItem('deviceFingerprint');
    if (!fp) {
      fp = generateDeviceFingerprint();
      localStorage.setItem('deviceFingerprint', fp);
    }
    setDeviceFingerprint(fp);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setBanned(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, deviceFingerprint }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.banned) {
          setBanned({ reason: data.banReason || null });
          return;
        }
        throw new Error(data.error || 'Login failed');
      }

      router.push('/my-dreams');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-heading font-bold text-center mb-8 glow-text">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-secondary/50 border border-accent/20 rounded-xl text-text-primary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-secondary/50 border border-accent/20 rounded-xl text-text-primary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
              required
            />
          </div>

          {/* Banned notice */}
          {banned && (
            <div className="p-5 bg-amber-500/10 border border-amber-500/40 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">⚠️</span>
                <div className="flex-1">
                  <p className="text-amber-400 font-semibold text-base mb-1">Account Suspended</p>
                  <p className="text-amber-400/80 text-sm mb-3">
                    Your account has been suspended due to a policy violation.
                  </p>
                  {banned.reason && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mb-3">
                      <p className="text-amber-400/70 text-xs font-medium mb-0.5">Reason:</p>
                      <p className="text-amber-400 text-sm">{banned.reason}</p>
                    </div>
                  )}
                  <p className="text-amber-400/60 text-xs">
                    If you believe this is a mistake, please contact us at{' '}
                    <a href="mailto:support@dreamsenseai.org" className="text-amber-400 underline hover:text-amber-300">
                      support@dreamsenseai.org
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* General error */}
          {!banned && error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-accent hover:bg-accent/80 disabled:bg-accent/50 rounded-xl text-lg font-semibold transition-all hover:scale-[1.02] glow"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-text-secondary mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}