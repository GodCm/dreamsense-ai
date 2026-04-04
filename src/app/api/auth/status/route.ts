import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ isLoggedIn: false });
    }

    return NextResponse.json({
      isLoggedIn: true,
      user: {
        id: user.id,
        email: user.email,
        isSubscribed: user.isSubscribed,
      }
    });
  } catch (error) {
    console.error('Check auth error:', error);
    return NextResponse.json({ isLoggedIn: false });
  }
}