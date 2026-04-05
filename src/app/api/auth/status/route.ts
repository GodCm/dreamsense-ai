import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

// 强制动态渲染，避免构建时预渲染错误
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ isLoggedIn: false });
    }

    // Get user's subscription info
    const { prisma } = await import('@/lib/db');
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: {
          in: ['ACTIVE', 'TRIALING']
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 调试日志
    console.log('User subscription data:', {
      userId: user.id,
      subscription,
      currentPeriodEnd: subscription?.currentPeriodEnd
    });

    return NextResponse.json({
      isLoggedIn: true,
      user: {
        id: user.id,
        email: user.email,
        isSubscribed: user.isSubscribed,
        subscriptionType: user.subscriptionType,
        subscriptionEnd: subscription?.currentPeriodEnd || null,
      }
    });
  } catch (error) {
    console.error('Check auth error:', error);
    return NextResponse.json({ isLoggedIn: false });
  }
}