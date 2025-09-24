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

export async function GET(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const apps = await prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(apps);
}

export async function POST(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { applicationName, siteLocation, applicationType, proposal } = await req.json();
  const record = await prisma.application.create({
    data: { applicationName, siteLocation, applicationType, proposal, userId },
  });
  return NextResponse.json(record);
}
