'use client';

import { useRouter } from 'next/navigation';

export default function CancelPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToPricing = () => {
    router.push('/pricing');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 取消图标 */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-warning/20 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-warning"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-3xl font-heading font-bold mb-4 glow-text">
          支付已取消
        </h1>

        {/* 描述 */}
        <p className="text-text-secondary mb-8">
          您取消了支付。没有产生任何费用，您可以随时回来继续订阅。
        </p>

        {/* 按钮组 */}
        <div className="space-y-3">
          <button
            onClick={handleGoToPricing}
            className="w-full py-3 bg-accent hover:bg-accent/80 rounded-xl font-semibold transition-all"
          >
            返回订阅页面
          </button>
          <button
            onClick={handleGoBack}
            className="w-full py-3 bg-accent-secondary hover:bg-accent-secondary/80 rounded-xl font-semibold transition-all"
          >
            返回上一页
          </button>
        </div>
      </div>
    </div>
  );
}
