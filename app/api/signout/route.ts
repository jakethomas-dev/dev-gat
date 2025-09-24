import { NextResponse } from "next/server";
import { clearSessionCookie, clearRefreshCookie, readRefreshTokenFromRequest } from "@/lib/auth/jwt";
import { revokeRefreshToken } from "@/lib/auth/session";

export async function POST(req: Request) {
  const refresh = readRefreshTokenFromRequest(req);
  if (refresh) await revokeRefreshToken(refresh).catch(() => {});
  const res = NextResponse.json({ ok: true });
  res.headers.append("Set-Cookie", clearSessionCookie());
  res.headers.append("Set-Cookie", clearRefreshCookie());
  return res;
}
