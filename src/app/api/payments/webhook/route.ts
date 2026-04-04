import { NextRequest, NextResponse } from 'next/server';
import { creemClient } from '@/lib/creem';


export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-webhook-signature');

  if (!signature) {
    return NextResponse.json(
      { error: '缺少签名' },
      { status: 400 }
    );
  }

  try {
    // 验证 Webhook 签名
    const event = creemClient.webhooks.verify({
      payload: body,
      signature: signature,
      secret: process.env.CREEM_WEBHOOK_SECRET || '',
    });


    // 根据事件类型处理
    switch (event.type) {
      case 'checkout.completed':
        await handleCheckoutCompleted(event.data);
        break;
      case 'checkout.failed':
        await handleCheckoutFailed(event.data);
        break;
      default:
        console.log(`未处理的事件类型: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook 处理失败:', error);
    return NextResponse.json(
      { error: 'Webhook 处理失败' },
      { status: 400 }
    );
  }
}

async function handleCheckoutCompleted(data: any) {
  console.log('支付成功:', data);
  // TODO: 更新数据库，记录支付信息
  // TODO: 激活用户订阅或积分
}

async function handleCheckoutFailed(data: any) {
  console.log('支付失败:', data);
  // TODO: 记录失败原因
}
