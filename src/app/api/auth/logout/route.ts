import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

// 强制动态渲染，避免构建时预渲染错误
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Logout successful' });
    clearAuthCookie(response);
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}