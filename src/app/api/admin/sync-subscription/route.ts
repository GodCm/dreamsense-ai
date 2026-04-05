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

    // 从 Creem API 获取用户的订阅列表（按邮箱筛选）
    const creemResponse = await fetch(`https://api.creem.io/v1/subscriptions?customer_email=${encodeURIComponent(user.email)}`, {
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
    console.log('Creem subscriptions response:', creemData);

    const subscriptions = creemData.data || creemData.subscriptions || [];

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ error: 'No subscription found in Creem' }, { status: 404 });
    }

    // 取最新的活跃订阅
    const activeSubscription = subscriptions.find((s: any) =>
      ['ACTIVE', 'TRIALING'].includes(s.status)
    ) || subscriptions[0];

    console.log('Selected subscription:', activeSubscription);

    // 更新或创建数据库中的订阅记录
    const currentPeriodEnd = activeSubscription.current_period_end_date
      ? new Date(activeSubscription.current_period_end_date)
      : null;

    const updatedSubscription = await prisma.subscription.upsert({
      where: { creemSubscriptionId: activeSubscription.id },
      create: {
        userId: user.id,
        creemSubscriptionId: activeSubscription.id,
        status: activeSubscription.status,
        productId: activeSubscription.product?.id || null,
        productName: activeSubscription.product?.name || null,
        currentPeriodEnd,
        trialEnd: activeSubscription.trial_end_date ? new Date(activeSubscription.trial_end_date) : null,
      },
      update: {
        status: activeSubscription.status,
        productId: activeSubscription.product?.id || null,
        productName: activeSubscription.product?.name || null,
        currentPeriodEnd,
        trialEnd: activeSubscription.trial_end_date ? new Date(activeSubscription.trial_end_date) : null,
        updatedAt: new Date()
      }
    });

    // 同时更新用户的订阅状态
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isSubscribed: ['ACTIVE', 'TRIALING'].includes(activeSubscription.status),
        subscriptionType: activeSubscription.product?.id || null,
      }
    });

    console.log('Subscription synced:', {
      userId: user.id,
      creemSubscriptionId: activeSubscription.id,
      currentPeriodEnd,
      status: activeSubscription.status
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
