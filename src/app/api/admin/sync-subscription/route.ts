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

    // 检查 API Key
    const apiKey = process.env.CREEM_API_KEY;
    console.log('API Key exists:', !!apiKey);
    console.log('API Key prefix:', apiKey?.substring(0, 15));

    // 从 Creem API 获取用户的订阅列表
    const creemResponse = await fetch('https://api.creem.io/v1/subscriptions/search', {
      headers: {
        'x-api-key': apiKey!,
        'Content-Type': 'application/json'
      }
    });

    console.log('Creem API status:', creemResponse.status);
    console.log('Creem API statusText:', creemResponse.statusText);

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
    console.log('Creem subscriptions response:', creemData);

    // 查找匹配当前用户邮箱的订阅
    const subscriptions = creemData.items || [];
    const userSubscriptions = subscriptions.filter((s: any) => {
      const customerEmail = s.customer?.email || '';
      return customerEmail.toLowerCase() === user.email.toLowerCase();
    });

    if (!userSubscriptions || userSubscriptions.length === 0) {
      console.log('No subscription found for email:', user.email);
      return NextResponse.json({ error: 'No subscription found in Creem' }, { status: 404 });
    }

    console.log('Found subscriptions:', userSubscriptions.length);

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
