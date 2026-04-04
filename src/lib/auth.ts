import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dreamsense-ai-secret';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function getUserFromRequest(request?: Request) {
  if (!request) return null;

  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/);
  if (!tokenMatch) return null;

  const token = tokenMatch[1];

  const decoded = verifyToken(token);
  if (!decoded) return null;

  // 动态导入 prisma 避免构建时的依赖分析
  const { prisma } = await import('./db');

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      isSubscribed: true,
      subscriptionType: true,
      freeTrialUsed: true,
    },
  });

  return user;
}

export function setAuthCookie(response: any, token: string) {
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export function clearAuthCookie(response: any) {
  response.cookies.delete('auth-token');
}