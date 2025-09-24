import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readTokenFromRequest, verifyAuthToken, clearSessionCookie, clearRefreshCookie, readRefreshTokenFromRequest } from '@/lib/auth/jwt';
import { revokeSessionToken } from '@/lib/auth/session';

async function getUserId(req: Request) {
  const token = readTokenFromRequest(req);
  if (!token) return null;
  try {
    const payload = await verifyAuthToken(token);
    return payload.sub as string;
  } catch { return null; }
}

export async function DELETE(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  // Soft delete: mark user, anonymize optional PII in applications if needed.
  await prisma.$transaction([
  prisma.session.deleteMany({ where: { userId } }),
    prisma.user.update({ where: { id: userId }, data: { deletedAt: new Date(), email: `${userId}@deleted.local` } }),
    prisma.auditLog.create({ data: { userId, action: 'account.soft_delete' } })
  ]);

  const res = NextResponse.json({ ok: true, softDeleted: true });
  // clear cookies
  res.headers.append('Set-Cookie', clearSessionCookie());
  res.headers.append('Set-Cookie', clearRefreshCookie());
  const refreshRaw = readRefreshTokenFromRequest(req);
  if (refreshRaw) revokeSessionToken(refreshRaw).catch(()=>{});
  return res;
}
