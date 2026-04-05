'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to maintenance page
    router.push('/maintenance');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Redirecting...</div>
    </div>
  );
}

// Original home page content (commented out for maintenance)
/*
'use client';

import { useState, useRef, useEffect } from 'react';

const dreamScenes = [
  {
    image: '/dream-beach.png',
    title: 'Beach Day',
    description: 'Lying on warm sand, feeling the gentle ocean breeze...',
  },
  {
    image: '/dream-exam.png',
    title: 'The Exam',
    description: 'In a classroom, facing a test you didn\'t study for...',
  },
  {
    image: '/dream-walk.png',
    title: 'Morning Walk',
    description: 'Walking through a beautiful park with a happy dog...',
  },
];

export default function Home() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isHoveringHead, setIsHoveringHead] = useState(false);
  const [showDream, setShowDream] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHoveringHead(true);
    setShowDream(true);
    
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
    }
    
    timeoutRef.current = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % dreamScenes.length);
    }, 3000);
  };

  const handleMouseLeave = () => {
    setIsHoveringHead(false);
    setTimeout(() => setShowDream(false), 300);
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-start px-4 pt-56 pb-4">
        {/* Character Container */}
        <div className="relative mt-28">
          {/* Dream Bubble - 放在小人的上方 */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-12 w-72 z-20">
            {showDream && (
              <div className="p-3 bg-secondary/90 rounded-2xl border border-accent/30 transition-all duration-300 animate-fade-in">
                <div className="text-center">
                  <img 
                    src={dreamScenes[currentScene].image} 
                    alt={dreamScenes[currentScene].title}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-secondary/90 border-r border-b border-accent/30 rotate-45"></div>
              </div>
            )}
          </div>

          {/* Sleeping Character */}
          <div 
            className="relative w-64 h-64"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="float-animation">
              <video 
                src="/sleeping.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            
            {/* Head trigger zone */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-16 cursor-pointer z-10"></div>

            {/* Hover hint - 放在小人左侧 */}
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-4 text-sm text-accent transition-opacity pointer-events-none whitespace-nowrap ${isHoveringHead ? 'opacity-0' : 'opacity-60'}`}>
              ✨ Hover my head
            </div>
          </div>
        </div>

        {/* Hero Text */}
        <div className="text-center max-w-2xl -mt-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2 glow-text">
            Unlock the Secrets of Your Dreams
          </h1>
          <p className="text-lg text-text-secondary mb-4">
            AI-powered dream analysis blending Eastern wisdom & Western psychology
          </p>
          <a 
            href="/interpret"
            className="inline-block px-8 py-4 bg-accent hover:bg-accent/80 rounded-full text-lg font-semibold transition-all hover:scale-105 glow"
          >
            Start Free Interpretation ✨
          </a>
          <p className="mt-4 text-sm text-text-secondary/60">
            🌙 This service provides interpretations based on psychological theories and traditional cultural wisdom. For reference only—not a substitute for professional medical or psychological diagnosis.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Why DreamSense AI?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-secondary/50 hover:bg-secondary/80 transition-all hover:scale-105">
              <div className="text-4xl mb-4">🔮</div>
              <h3 className="text-xl font-heading font-semibold mb-2">Personalized</h3>
              <p className="text-text-secondary">
                Every dream is unique. Get interpretations tailored to your specific details and emotions.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-secondary/50 hover:bg-secondary/80 transition-all hover:scale-105">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-heading font-semibold mb-2">Deep Analysis</h3>
              <p className="text-text-secondary">
                Combining psychological theories with ancient symbolism for profound insights.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-secondary/50 hover:bg-secondary/80 transition-all hover:scale-105">
              <div className="text-4xl mb-4">💫</div>
              <h3 className="text-xl font-heading font-semibold mb-2">Practical Guidance</h3>
              <p className="text-text-secondary">
                Not just analysis - receive actionable advice for your waking life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent">
                1
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Describe</h3>
              <p className="text-text-secondary">
                Write down your dream in as much detail as you remember.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent">
                2
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Analyze</h3>
              <p className="text-text-secondary">
                Our AI deeply analyzes symbols, emotions, and patterns.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent">
                3
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Understand</h3>
              <p className="text-text-secondary">
                Receive your personalized interpretation with practical guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Ready to Explore Your Dreams?
          </h2>
          <p className="text-text-secondary mb-8">
            Start with your free dream interpretation today.
          </p>
          <a 
            href="/register"
            className="inline-block px-8 py-4 bg-accent hover:bg-accent/80 rounded-full text-lg font-semibold transition-all hover:scale-105 glow"
          >
            Get Started Free 🚀
          </a>
        </div>
      </section>
    </div>
  );
}