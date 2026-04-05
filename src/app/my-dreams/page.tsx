'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  isSubscribed: boolean;
  subscriptionType: string | null;
  subscriptionEnd: string | null;
  createdAt: string;
}

interface Dream {
  id: string;
  dreamText: string;
  interpretation: string;
  createdAt: string;
  isPaid: boolean;
}

export default function MyDreamsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchDreams();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/status');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // 未登录，跳转到首页
        router.push('/');
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDreams = async () => {
    try {
      const response = await fetch('/api/dreams/history');
      if (response.ok) {
        const data = await response.json();
        setDreams(data.dreams || []);
      }
    } catch (error) {
      console.error('获取梦境历史失败:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-heading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 用户信息卡片 */}
        <div className="bg-secondary/50 backdrop-blur-sm border border-accent/20 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2 glow-text">
                Welcome back, {user.email.split('@')[0]}!
              </h1>
              <p className="text-text-secondary">
                {user.isSubscribed ? '✨ Subscribed' : '🎯 Free User'}
              </p>
              {user.subscriptionType && (
                <p className="text-accent mt-1">
                  Subscription: {user.subscriptionType}
                </p>
              )}
              {user.isSubscribed && user.subscriptionEnd && (
                <p className="text-text-secondary/60 text-sm mt-1">
                  Expires: {new Date(user.subscriptionEnd).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-accent-secondary hover:bg-accent-secondary/80 rounded-xl font-semibold transition-all"
            >
              Logout
            </button>
          </div>

          {!user.isSubscribed && (
            <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-xl">
              <p className="text-text-secondary mb-3">
                Unlock unlimited dream interpretations and get deeper psychological insights!
              </p>
              <button
                onClick={() => router.push('/pricing')}
                className="px-6 py-2 bg-accent hover:bg-accent/80 rounded-xl font-semibold transition-all"
              >
                View Subscription Plans
              </button>
            </div>
          )}
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-secondary/30 backdrop-blur-sm border border-accent/10 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-accent mb-2">{dreams.length}</div>
            <div className="text-text-secondary">Total Dreams</div>
          </div>
          <div className="bg-secondary/30 backdrop-blur-sm border border-accent/10 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-success mb-2">
              {dreams.filter(d => d.isPaid).length}
            </div>
            <div className="text-text-secondary">Unlocked Dreams</div>
          </div>
          <div className="bg-secondary/30 backdrop-blur-sm border border-accent/10 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-accent-secondary mb-2">
              {dreams.filter(d => !d.isPaid).length}
            </div>
            <div className="text-text-secondary">Locked Dreams</div>
          </div>
        </div>

        {/* 梦境历史 */}
        <div className="bg-secondary/30 backdrop-blur-sm border border-accent/10 rounded-2xl p-6">
          <h2 className="text-2xl font-heading font-bold mb-6 glow-text">
            Dream History
          </h2>

          {dreams.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              <p className="text-xl mb-4">No dreams recorded yet</p>
              <p className="mb-6">Start recording your dreams to explore the mysteries of your subconscious</p>
              <button
                onClick={() => router.push('/interpret')}
                className="px-6 py-3 bg-accent hover:bg-accent/80 rounded-xl font-semibold transition-all"
              >
                Start Dream Interpretation
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {dreams.map((dream) => (
                <div
                  key={dream.id}
                  className="bg-secondary/50 border border-accent/20 rounded-xl p-6 hover:border-accent/40 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-sm text-text-secondary">
                      {new Date(dream.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        dream.isPaid
                          ? 'bg-success/20 text-success'
                          : 'bg-warning/20 text-warning'
                      }`}
                    >
                      {dream.isPaid ? 'Unlocked' : 'Locked'}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-text-primary mb-2">Dream Content</h3>
                    <div className="text-text-secondary max-h-32 overflow-y-auto pr-2">
                      <p>{dream.dreamText}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Interpretation</h3>
                    <div className="text-text-secondary max-h-96 overflow-y-auto pr-2">
                      <p>{dream.interpretation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
