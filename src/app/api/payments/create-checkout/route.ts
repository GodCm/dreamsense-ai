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
    const checkout = await creem.checkouts.create({
      priceId: priceId,
      successUrl: successUrl,
      cancelUrl: cancelUrl,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      url: checkout.url,
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
