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
    // 使用测试环境 API（因为 API Key 是测试模式的）
    // 正确的端点格式：/v1/subscriptions?subscription_id={id}
    const creemResponse = await fetch(`https://test-api.creem.io/v1/subscriptions?subscription_id=${creemSubscriptionId}`, {
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

    // 处理可能的响应格式
    let subscriptionData = creemData;
    if (creemData.items && Array.isArray(creemData.items)) {
      subscriptionData = creemData.items[0];
    } else if (Array.isArray(creemData)) {
      subscriptionData = creemData[0];
    }

    console.log('Extracted subscription data:', subscriptionData);

    if (!subscriptionData) {
      return NextResponse.json({ error: 'No subscription data found' }, { status: 404 });
    }

    // 更新或创建数据库中的订阅记录
    const currentPeriodEnd = subscriptionData.current_period_end_date
      ? new Date(subscriptionData.current_period_end_date)
      : null;

    const updatedSubscription = await prisma.subscription.upsert({
      where: { creemSubscriptionId },
      create: {
        userId: user.id,
        creemSubscriptionId,
        status: subscriptionData.status,
        productId: subscriptionData.product?.id || null,
        productName: subscriptionData.product?.name || null,
        currentPeriodEnd,
        trialEnd: subscriptionData.trial_end_date ? new Date(subscriptionData.trial_end_date) : null,
      },
      update: {
        status: subscriptionData.status,
        productId: subscriptionData.product?.id || null,
        productName: subscriptionData.product?.name || null,
        currentPeriodEnd,
        trialEnd: subscriptionData.trial_end_date ? new Date(subscriptionData.trial_end_date) : null,
        updatedAt: new Date()
      }
    });

    // 同时更新用户的订阅状态
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isSubscribed: ['ACTIVE', 'TRIALING'].includes(subscriptionData.status),
        subscriptionType: subscriptionData.product?.id || null,
      }
    });

    console.log('Subscription synced:', {
      userId: user.id,
      creemSubscriptionId,
      currentPeriodEnd,
      status: subscriptionData.status
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
