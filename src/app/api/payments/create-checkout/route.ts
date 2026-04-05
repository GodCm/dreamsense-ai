import { NextRequest, NextResponse } from 'next/server';
import { creemClient } from '@/lib/creem';


export const dynamic = 'force-dynamic';

interface CreatePaymentRequest {
  priceId: string;
  successUrl: string;
  metadata?: Record<string, string>;
}


export async function POST(request: NextRequest) {
  try {
    console.log('=== Creating Checkout Session ===');
    console.log('Test Mode:', process.env.CREEM_TEST_MODE);
    console.log('API Key:', process.env.CREEM_API_KEY?.substring(0, 15) + '...');

    const body: CreatePaymentRequest = await request.json();
    const { priceId, successUrl, metadata = {} } = body;
    console.log('Request body:', { priceId, successUrl });

    // 创建 Checkout Session
    const checkout = await creemClient.checkouts.create({
      productId: priceId,
      successUrl: successUrl,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    });


    return NextResponse.json({
      success: true,
      url: checkout.checkoutUrl,
    });
  } catch (error: any) {
    console.error('创建支付会话失败:', error);
    console.error('错误详情:', {
      message: error.message,
      status: error.status,
      statusCode: error.statusCode,
      response: error.response?.data,
    });
    return NextResponse.json(
      {
        success: false,
        error: '创建支付会话失败',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
