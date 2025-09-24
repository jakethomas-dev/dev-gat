import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signAuthToken, buildSessionCookie, buildRefreshCookie } from "@/lib/auth/jwt";
import { issueSessionToken } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
  const { email, password, forename: rawForename, surname: rawSurname } = await req.json();
  const forename = rawForename?.trim();
  const surname = rawSurname?.trim();

    if (!email || !password || !forename || !surname) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hash, forename, surname },
      select: { id: true, email: true, forename: true, surname: true },
    });

  const token = await signAuthToken({ sub: user.id, email: user.email });
  const sessionLong = await issueSessionToken(user.id, { ip: req.headers.get('x-forwarded-for'), userAgent: req.headers.get('user-agent') });
  const res = NextResponse.json({ ok: true, user });
  res.headers.append("Set-Cookie", buildSessionCookie(token));
  res.headers.append("Set-Cookie", buildRefreshCookie(sessionLong.raw, 60 * 60 * 24 * 7));
    return res;
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Server error" }, { status: 500 });
  }
}
