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

    const body = await request.json();
    const { creemSubscriptionId } = body;

    if (!creemSubscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    const { prisma } = await import('@/lib/db');

    // 从 Creem API 获取订阅详情
    const creemResponse = await fetch(`https://api.creem.io/v1/subscriptions/${creemSubscriptionId}`, {
      headers: {
        'x-api-key': process.env.CREEM_API_KEY!
      }
    });

    console.log('Creem API status:', creemResponse.status);

    if (!creemResponse.ok) {
      const errorText = await creemResponse.text();
      console.error('Creem API error:', errorText);
      return NextResponse.json({
        error: 'Failed to fetch subscription from Creem',
        details: errorText,
        status: creemResponse.status
      }, { status: 500 });
    }

    const creemData = await creemResponse.json();
    console.log('Creem subscription data:', creemData);

    // 更新或创建数据库中的订阅记录
    const currentPeriodEnd = creemData.current_period_end_date
      ? new Date(creemData.current_period_end_date)
      : null;

    const updatedSubscription = await prisma.subscription.upsert({
      where: { creemSubscriptionId },
      create: {
        userId: user.id,
        creemSubscriptionId,
        status: creemData.status,
        productId: creemData.product?.id || null,
        productName: creemData.product?.name || null,
        currentPeriodEnd,
        trialEnd: creemData.trial_end_date ? new Date(creemData.trial_end_date) : null,
      },
      update: {
        status: creemData.status,
        productId: creemData.product?.id || null,
        productName: creemData.product?.name || null,
        currentPeriodEnd,
        trialEnd: creemData.trial_end_date ? new Date(creemData.trial_end_date) : null,
        updatedAt: new Date()
      }
    });

    // 同时更新用户的订阅状态
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isSubscribed: ['ACTIVE', 'TRIALING'].includes(creemData.status),
        subscriptionType: creemData.product?.id || null,
      }
    });

    console.log('Subscription synced:', {
      userId: user.id,
      creemSubscriptionId,
      currentPeriodEnd,
      status: creemData.status
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
    console.error('Manual sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
