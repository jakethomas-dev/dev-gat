import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readTokenFromRequest, verifyAuthToken, readRefreshTokenFromRequest, buildSessionCookie } from '@/lib/auth/jwt';
import { rotateSessionToken } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { signAuthToken } from '@/lib/auth/jwt';

const PROTECTED_PREFIXES = ['/dashboard'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  const access = readTokenFromRequest(req as unknown as Request);
  if (access) {
    try {
      await verifyAuthToken(access);
      return NextResponse.next();
    } catch {
      // fall through to refresh logic
    }
  }

  // Try refresh rotation
  const refresh = readRefreshTokenFromRequest(req as unknown as Request);
  if (refresh) {
    try {
  const rotated = await rotateSessionToken(refresh, { ip: req.headers.get('x-forwarded-for'), userAgent: req.headers.get('user-agent') });
      if (rotated) {
  const tokenRecord = await prisma.session.findUnique({ where: { id: rotated.id } });
        if (tokenRecord) {
          const user = await prisma.user.findUnique({ where: { id: tokenRecord.userId } });
          if (user) {
            const newAccess = await signAuthToken({ sub: user.id, email: user.email });
            const res = NextResponse.next();
            res.headers.append('Set-Cookie', buildSessionCookie(newAccess));
            return res;
          }
        }
      }
    } catch {
      // ignore
    }
  }

  const loginUrl = new URL('/signIn', req.url);
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/dashboard/:path*']
};
