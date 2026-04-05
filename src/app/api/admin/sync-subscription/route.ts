import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 验证用户身份
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prisma } = await import('@/lib/db');

    // 查找用户的订阅记录
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ['ACTIVE', 'TRIALING'] }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    // 从 Creem API 获取订阅详情
    const creemResponse = await fetch(`https://api.creem.io/v1/subscriptions/${subscription.creemSubscriptionId}`, {
      headers: {
        'x-api-key': process.env.CREEM_API_KEY!
      }
    });

    if (!creemResponse.ok) {
      const errorText = await creemResponse.text();
      console.error('Creem API error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch subscription from Creem' }, { status: 500 });
    }

    const creemData = await creemResponse.json();

    // 更新数据库中的订阅信息
    const currentPeriodEnd = creemData.current_period_end_date
      ? new Date(creemData.current_period_end_date)
      : null;

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        currentPeriodEnd,
        status: creemData.status,
        updatedAt: new Date()
      }
    });

    console.log('Subscription synced:', {
      userId: user.id,
      creemSubscriptionId: subscription.creemSubscriptionId,
      currentPeriodEnd
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        currentPeriodEnd: updatedSubscription.currentPeriodEnd,
        productId: updatedSubscription.productId,
        productName: updatedSubscription.productName
      }
    });

  } catch (error) {
    console.error('Sync subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
