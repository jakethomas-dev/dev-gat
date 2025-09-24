import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
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
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { currentPassword, newPassword, confirmPassword } = body;
  if (!currentPassword || !newPassword || !confirmPassword) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  if (newPassword !== confirmPassword) return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });
  if (newPassword.length < 8) return NextResponse.json({ message: 'Password too short' }, { status: 400 });
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return NextResponse.json({ message: 'Invalid current password' }, { status: 401 });
  const hash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hash } });
  return NextResponse.json({ ok: true });
}
