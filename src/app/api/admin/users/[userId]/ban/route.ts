import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/admin/users/[userId]/ban - 封禁用户
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUser = await getUserFromRequest(request);
    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;
    const { reason } = await request.json();

    // 不能封禁自己
    if (userId === currentUser.id) {
      return NextResponse.json({ error: 'Cannot ban yourself' }, { status: 400 });
    }

    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 不能封禁其他管理员
    if (target.isAdmin) {
      return NextResponse.json({ error: 'Cannot ban an admin user' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        isBanned: true,
        banReason: reason || 'Violation of terms of service.',
      },
      select: { id: true, email: true, isBanned: true, banReason: true },
    });

    return NextResponse.json({ message: 'User banned successfully', user: updated });
  } catch (error) {
    console.error('Ban user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/users/[userId]/ban - 解封用户
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUser = await getUserFromRequest(request);
    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;

    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isBanned: false, banReason: null },
      select: { id: true, email: true, isBanned: true },
    });

    return NextResponse.json({ message: 'User unbanned successfully', user: updated });
  } catch (error) {
    console.error('Unban user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
