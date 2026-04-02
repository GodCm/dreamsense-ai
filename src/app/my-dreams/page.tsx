'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Dream {
  id: string;
  dream_text: string;
  interpretation: string;
  created_at: string;
  is_paid: boolean;
}

export default function MyDreamsPage() {
  const router = useRouter();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

  useEffect(() => {
    fetchDreams();
  }, []);

  const fetchDreams = async () => {
    try {
      const response = await fetch('/api/dreams/history');
      if (response.ok) {
        const data = await response.json();
        setDreams(data.dreams);
      }
    } catch (err) {
      console.error('Failed to fetch dreams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 px-4 flex items-center justify-center">
        <div className="text-2xl">✨ Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-center mb-4 glow-text">
          My Dreams
        </h1>
        <p className="text-center text-text-secondary mb-8">
          Your journey through the realm of dreams
        </p>

        {dreams.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌙</div>
            <h2 className="text-2xl font-heading font-semibold mb-2">
              No dreams yet
            </h2>
            <p className="text-text-secondary mb-6">
              Start exploring your dreams with your first free interpretation!
            </p>
            <button
              onClick={() => router.push('/interpret')}
              className="px-8 py-4 bg-accent hover:bg-accent/80 rounded-full text-lg font-semibold transition-all glow"
            >
              Interpret Your First Dream
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {dreams.map((dream) => (
              <div
                key={dream.id}
                onClick={() => setSelectedDream(dream)}
                className="p-6 bg-secondary/50 border border-accent/20 rounded-2xl hover:bg-secondary/80 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-text-secondary">
                    {formatDate(dream.created_at)}
                  </div>
                  {dream.is_paid ? (
                    <span className="px-2 py-1 bg-gold/20 text-gold text-xs rounded-full">
                      Premium
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-success/20 text-success text-xs rounded-full">
                      Free Trial
                    </span>
                  )}
                </div>
                <p className="text-text-primary line-clamp-2">
                  {dream.dream_text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Dream Detail Modal */}
        {selectedDream && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 bg-secondary rounded-2xl border border-accent/30">
              <div className="flex justify-between items-start mb-4">
                <div className="text-sm text-text-secondary">
                  {formatDate(selectedDream.created_at)}
                </div>
                <button
                  onClick={() => setSelectedDream(null)}
                  className="text-text-secondary hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-heading font-semibold mb-2 text-accent">
                  Your Dream
                </h3>
                <p className="text-text-primary whitespace-pre-wrap">
                  {selectedDream.dream_text}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-heading font-semibold mb-2 text-accent">
                  🔮 Interpretation
                </h3>
                <div className="text-text-primary whitespace-pre-wrap">
                  {selectedDream.interpretation}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}