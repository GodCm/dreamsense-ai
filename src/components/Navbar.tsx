'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/status')
      .then(res => res.json())
      .then(data => setIsLoggedIn(data.isLoggedIn))
      .catch(() => {
        const cookies = document.cookie;
        setIsLoggedIn(cookies.includes('auth-token'));
      });
  }, [pathname]);

  // 路由切换时关闭菜单
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/interpret', label: 'Interpret' },
    { href: '/pricing', label: 'Pricing' },
    ...(isLoggedIn ? [{ href: '/my-dreams', label: 'My Dreams' }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-md border-b border-accent/20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-heading font-bold text-accent glow-text">
          🌙 DreamSense AI
        </Link>

        {/* 桌面导航 */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="hover:text-accent transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        {/* 桌面右侧按钮 */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* 移动端右侧：登录按钮 + 汉堡菜单 */}
        <div className="flex md:hidden items-center gap-3">
          {!isLoggedIn && (
            <Link href="/login" className="px-3 py-1.5 text-sm text-accent hover:text-white transition-colors">
              Login
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="p-2 text-white hover:text-accent transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              // X 图标
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="18" y2="18" />
                <line x1="18" y1="4" x2="4" y2="18" />
              </svg>
            ) : (
              // 三条线图标
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="19" y2="6" />
                <line x1="3" y1="11" x2="19" y2="11" />
                <line x1="3" y1="16" x2="19" y2="16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {menuOpen && (
        <div className="md:hidden bg-primary/95 backdrop-blur-md border-t border-accent/20 px-4 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base hover:text-accent transition-colors py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-accent/20 pt-4 flex flex-col gap-3">
            {isLoggedIn ? (
              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  window.location.href = '/';
                }}
                className="text-left text-text-secondary hover:text-white transition-colors py-1"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="text-accent hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-all text-center glow" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
