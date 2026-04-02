'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 从 API 检查登录状态
    fetch('/api/auth/status')
      .then(res => res.json())
      .then(data => setIsLoggedIn(data.isLoggedIn))
      .catch(() => {
        // 如果 API 失败，回退到检查 cookie
        const cookies = document.cookie;
        setIsLoggedIn(cookies.includes('auth-token'));
      });
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-md border-b border-accent/20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-heading font-bold text-accent glow-text">
          🌙 DreamSense AI
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <Link href="/interpret" className="hover:text-accent transition-colors">Interpret</Link>
          <Link href="/pricing" className="hover:text-accent transition-colors">Pricing</Link>
          {isLoggedIn && (
            <Link href="/my-dreams" className="hover:text-accent transition-colors">My Dreams</Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/my-dreams" className="px-4 py-2 text-accent hover:text-white transition-colors">
                My Dreams
              </Link>
              <button 
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  window.location.href = '/';
                }}
                className="px-4 py-2 text-text-secondary hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-accent hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-all hover:scale-102 glow">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}