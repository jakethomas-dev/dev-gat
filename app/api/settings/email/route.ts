import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readTokenFromRequest, verifyAuthToken } from "@/lib/auth/jwt";

async function getUser(req: Request) {
  const token = readTokenFromRequest(req);
  if (!token) return null;
  try {
    const payload = await verifyAuthToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    return user;
  } catch {
    return null;
  }
}

export async function PATCH(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { email } = body;
  if (!email || typeof email !== 'string' || !email.includes('@')) return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists && exists.id !== user.id) return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
  const updated = await prisma.user.update({ where: { id: user.id }, data: { email }, select: { id: true, email: true, forename: true, surname: true } });
  return NextResponse.json({ ok: true, user: updated });
}
