'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // 获取 URL 参数
    const orderIdParam = searchParams.get('order_id');
    const checkoutId = searchParams.get('checkout_id');
    const customerId = searchParams.get('customer_id');
    const subscriptionId = searchParams.get('subscription_id');

    setOrderId(orderIdParam);

    console.log('支付成功回调:', {
      orderId: orderIdParam,
      checkoutId,
      customerId,
      subscriptionId,
    });

    // 等待几秒让用户看到成功页面，然后跳转到 my-dreams
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleGoToMyDreams = () => {
    router.push('/my-dreams');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 成功图标 */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-success/20 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-3xl font-heading font-bold mb-4 glow-text">
          支付成功！
        </h1>

        {/* 描述 */}
        <p className="text-text-secondary mb-6">
          感谢您的订阅！您现在可以解锁无限梦境解析功能。
        </p>

        {/* 订单信息 */}
        {orderId && (
          <div className="bg-secondary/50 border border-accent/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-text-secondary mb-1">订单号</p>
            <p className="font-mono text-accent">{orderId}</p>
          </div>
        )}

        {/* 按钮 */}
        <button
          onClick={handleGoToMyDreams}
          disabled={loading}
          className="w-full py-3 bg-accent hover:bg-accent/80 rounded-xl font-semibold transition-all disabled:opacity-50"
        >
          {loading ? '正在跳转...' : '查看我的订阅'}
        </button>

        {/* 自动跳转提示 */}
        {loading && (
          <p className="text-sm text-text-secondary mt-4">
            页面将在几秒后自动跳转...
          </p>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-xl">加载中...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 成功图标 */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-success/20 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-3xl font-heading font-bold mb-4 glow-text">
          支付成功！
        </h1>

        {/* 描述 */}
        <p className="text-text-secondary mb-6">
          感谢您的订阅！您现在可以解锁无限梦境解析功能。
        </p>

        {/* 订单信息 */}
        {orderId && (
          <div className="bg-secondary/50 border border-accent/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-text-secondary mb-1">订单号</p>
            <p className="font-mono text-accent">{orderId}</p>
          </div>
        )}

        {/* 按钮 */}
        <button
          onClick={handleGoToMyDreams}
          disabled={loading}
          className="w-full py-3 bg-accent hover:bg-accent/80 rounded-xl font-semibold transition-all disabled:opacity-50"
        >
          {loading ? '正在跳转...' : '查看我的订阅'}
        </button>

        {/* 自动跳转提示 */}
        {loading && (
          <p className="text-sm text-text-secondary mt-4">
            页面将在几秒后自动跳转...
          </p>
        )}
      </div>
    </div>
  );
}
