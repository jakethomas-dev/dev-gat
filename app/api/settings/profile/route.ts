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
  const { forename, surname } = body;
  if (!forename?.trim() || !surname?.trim()) return NextResponse.json({ message: "Invalid name" }, { status: 400 });
  const updated = await prisma.user.update({ where: { id: user.id }, data: { forename: forename.trim(), surname: surname.trim(), firstLogin: false }, select: { id: true, email: true, forename: true, surname: true } });
  await prisma.auditLog.create({ data: { userId: user.id, action: 'user.update_name', metadata: { forename: updated.forename, surname: updated.surname } } });
  return NextResponse.json({ ok: true, user: updated });
}
