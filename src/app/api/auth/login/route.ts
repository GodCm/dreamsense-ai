import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';

// 强制动态渲染，避免构建时预渲染错误
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password, deviceFingerprint } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is banned
    if (user.isBanned) {
      return NextResponse.json(
        {
          error: 'Your account has been suspended.',
          banned: true,
          banReason: user.banReason || null,
        },
        { status: 403 }
      );
    }

    // 更新设备指纹（如果用户之前没有）
    if (deviceFingerprint && !user.deviceFingerprint) {
      await prisma.user.update({
        where: { id: user.id },
        data: { deviceFingerprint },
      });
    }

    // Generate token and set cookie
    const token = generateToken(user.id);
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        isSubscribed: user.isSubscribed,
        freeTrialUsed: user.freeTrialUsed,
      },
    });

    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}