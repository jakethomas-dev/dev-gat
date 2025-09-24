import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readTokenFromRequest, verifyAuthToken } from "@/lib/auth/jwt";

async function getUserId(req: Request) {
  const token = readTokenFromRequest(req);
  if (!token) return null;
  try {
    const payload = await verifyAuthToken(token);
    return payload.sub as string;
  } catch {
    return null;
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId(_req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = params.id;
  try {
    const existing = await prisma.application.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 });
    await prisma.application.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Server error" }, { status: 500 });
  }
}
