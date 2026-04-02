'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function InterpretPage() {
  const router = useRouter();
  
  // 登录状态
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  
  // 解梦结果状态
  const [dreamId, setDreamId] = useState<string | null>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [conversationRounds, setConversationRounds] = useState(0);
  const [maxRounds, setMaxRounds] = useState(5);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [endMessage, setEndMessage] = useState<string | null>(null);
  
  // 表单状态
  const [dreamText, setDreamText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 检查登录状态
  useEffect(() => {
    fetch('/api/auth/status')
      .then(res => res.json())
      .then(data => {
        if (!data.isLoggedIn) {
          setIsLoggedIn(false);
          router.push('/login');
        } else {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        router.push('/login');
      });
  }, [router]);

  // 自动滚动到对话底部
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatEnded]);

  // 加载状态
  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen py-24 px-4 flex items-center justify-center">
        <div className="text-accent">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (dreamText.length < 10) {
      setError('Please describe your dream in at least 10 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dreams/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dreamText }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to interpret dream');
      }

      const data = await response.json();
      setDreamId(data.dreamId);
      setInterpretation(data.interpretation);
      setConversationRounds(data.conversationRounds);
      setMaxRounds(data.maxRounds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent, message: string) => {
    e.preventDefault();
    
    if (!message.trim() || !dreamId || chatEnded) return;

    // 添加用户消息
    const newHistory = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(newHistory);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/dreams/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreamId,
          message,
          history: newHistory.slice(0, -1), // 不包含刚添加的用户消息
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get response');
      }

      const data = await response.json();
      
      // 添加AI回复
      setChatHistory([...newHistory, { role: 'assistant', content: data.response }]);
      setConversationRounds(data.conversationRounds);
      
      if (data.ended) {
        setChatEnded(true);
        setEndMessage(data.endMessage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleNewDream = () => {
    setDreamText('');
    setDreamId(null);
    setInterpretation(null);
    setChatHistory([]);
    setConversationRounds(0);
    setChatEnded(false);
    setEndMessage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-center mb-4 glow-text">
          Interpret Your Dream
        </h1>
        <p className="text-center text-text-secondary mb-4">
          Describe your dream and let AI uncover its hidden meanings
        </p>
        <p className="text-center text-sm text-text-secondary/60 mb-8">
          🌙 This service provides interpretations based on psychological theories and traditional cultural wisdom. For reference only—not a substitute for professional medical or psychological diagnosis.
        </p>

        {!dreamId ? (
          // 初始输入界面
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder="Describe your dream... What happened? Who was there? What did you feel?"
                className="w-full h-64 p-6 bg-secondary/50 border border-accent/20 rounded-2xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                maxLength={2000}
              />
              <div className="absolute bottom-4 right-4 text-sm text-text-secondary">
                {dreamText.length} / 2000
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || dreamText.length < 10}
              className="w-full py-4 bg-accent hover:bg-accent/80 disabled:bg-accent/50 disabled:cursor-not-allowed rounded-xl text-lg font-semibold transition-all hover:scale-[1.02] glow"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">✨</span>
                  Interpreting...
                </span>
              ) : (
                '🔮 Reveal Your Dream\'s Meaning'
              )}
            </button>
          </form>
        ) : (
          // 解梦结果和对话界面
          <div className="space-y-6">
            {/* 初步解读 */}
            <div className="p-8 bg-secondary/50 border border-accent/20 rounded-2xl">
              <h2 className="text-2xl font-heading font-semibold mb-4 text-accent">
                🌟 Your Dream Interpretation
              </h2>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                {interpretation}
              </div>
            </div>

            {/* 对话历史 */}
            {chatHistory.length > 0 && (
              <div className="space-y-4">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-accent/20 ml-8'
                        : 'bg-secondary/50 mr-8'
                    }`}
                  >
                    <div className="text-sm text-text-secondary mb-1">
                      {msg.role === 'user' ? 'You' : 'DreamSense AI'}
                    </div>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}

            {/* 对话结束消息 */}
            {chatEnded && endMessage && (
              <div className="p-4 bg-secondary/50 border border-accent/30 rounded-2xl text-center">
                <div className="text-lg text-text-secondary">{endMessage}</div>
              </div>
            )}

            {/* 对话输入框 */}
            {!chatEnded ? (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>💬 Ask a follow-up question</span>
                  <span>{maxRounds - conversationRounds} questions remaining</span>
                </div>
                <ChatInput onSubmit={handleChatSubmit} isLoading={isChatLoading} />
              </div>
            ) : (
              /* 结束后的按钮 */
              <div className="flex gap-4">
                <button
                  onClick={handleNewDream}
                  className="flex-1 py-4 bg-secondary hover:bg-secondary/80 border border-accent/20 rounded-xl text-lg font-semibold transition-all"
                >
                  Interpret Another Dream
                </button>
                <button
                  onClick={() => router.push('/my-dreams')}
                  className="flex-1 py-4 bg-accent hover:bg-accent/80 rounded-xl text-lg font-semibold transition-all glow"
                >
                  View My Dreams
                </button>
              </div>
            )}
          </div>
        )}

        {!dreamId && (
          <div className="mt-12 p-6 bg-secondary/30 rounded-2xl">
            <h3 className="text-lg font-heading font-semibold mb-2">💡 Tips for better interpretation</h3>
            <ul className="text-text-secondary space-y-2">
              <li>• Write as much detail as you remember</li>
              <li>• Include emotions you felt during the dream</li>
              <li>• Note any specific colors, numbers, or symbols</li>
              <li>• Remember how the dream made you feel when you woke up</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// 独立的聊天输入组件
function ChatInput({ onSubmit, isLoading }: { onSubmit: (e: React.FormEvent, msg: string) => void; isLoading: boolean }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    if (!message.trim()) return;
    onSubmit(e, message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask anything about your dream..."
        className="flex-1 p-4 bg-secondary/50 border border-accent/20 rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent/50"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !message.trim()}
        className="px-6 py-4 bg-accent hover:bg-accent/80 disabled:bg-accent/50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all"
      >
        {isLoading ? '...' : 'Send'}
      </button>
    </form>
  );
}