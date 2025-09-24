import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signAuthToken, buildSessionCookie, buildRefreshCookie } from "@/lib/auth/jwt";
import { issueRefreshToken } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

  const token = await signAuthToken({ sub: user.id, email: user.email });
  const refresh = await issueRefreshToken(user.id);
  const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
  res.headers.append("Set-Cookie", buildSessionCookie(token));
  res.headers.append("Set-Cookie", buildRefreshCookie(refresh.raw, 60 * 60 * 24 * 7));
    return res;
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Server error" }, { status: 500 });
  }
}
