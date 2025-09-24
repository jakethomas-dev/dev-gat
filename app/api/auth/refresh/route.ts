import { NextResponse } from "next/server";
import { readRefreshTokenFromRequest, buildSessionCookie, buildRefreshCookie } from "@/lib/auth/jwt";
import { rotateRefreshToken } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { signAuthToken } from "@/lib/auth/jwt";

export async function POST(req: Request) {
  const refresh = readRefreshTokenFromRequest(req);
  if (!refresh) return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  const rotated = await rotateRefreshToken(refresh);
  if (!rotated) return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
  // We have the new token id; fetch its record to get userId
  const tokenRecord = await prisma.refreshToken.findUnique({ where: { id: rotated.id } });
  if (!tokenRecord) return NextResponse.json({ message: "Invalid state" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: tokenRecord.userId } });
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 401 });
  const access = await signAuthToken({ sub: user.id, email: user.email });
  const res = NextResponse.json({ ok: true });
  res.headers.append("Set-Cookie", buildSessionCookie(access));
  res.headers.append("Set-Cookie", buildRefreshCookie(rotated.raw, 60 * 60 * 24 * 7));
  return res;
}
