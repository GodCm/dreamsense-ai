import { NextRequest, NextResponse } from 'next/server';
import { creem } from '@/lib/creem';

export const dynamic = 'force-dynamic';

interface CreatePaymentRequest {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentRequest = await request.json();
    const { priceId, successUrl, cancelUrl, metadata = {} } = body;

    // 创建 Checkout Session
    const session = await creem.checkout.sessions.create({
      price: priceId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('创建支付会话失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '创建支付会话失败',
      },
      { status: 500 }
    );
  }
}
