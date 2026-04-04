import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, deviceFingerprint } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 设备指纹限制检查 (同一设备最多注册 3 个账号)
    if (deviceFingerprint) {
      const existingDevices = await prisma.user.groupBy({
        by: ['deviceFingerprint'],
        where: {
          deviceFingerprint: deviceFingerprint,
        },
        _count: true,
      });

      const deviceCount = existingDevices[0]?._count || 0;
      
      if (deviceCount >= 3) {
        return NextResponse.json(
          { error: 'Maximum accounts reached for this device. Please subscribe to continue.' },
          { status: 403 }
        );
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        deviceFingerprint: deviceFingerprint || null,
      },
    });

    // Generate token and set cookie
    const token = generateToken(user.id);
    const response = NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
      },
    });

    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}