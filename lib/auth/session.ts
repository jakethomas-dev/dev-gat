import crypto from "crypto";
import { prisma } from "@/lib/db";

// Create a random token and store a hash in DB
export async function issueRefreshToken(userId: string, ttlMinutes = 60 * 24 * 7) { // 7 days
  const raw = crypto.randomBytes(48).toString("base64url");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
  const record = await prisma.refreshToken.create({
    data: { userId, tokenHash: hash, expiresAt },
    select: { id: true, expiresAt: true }
  });
  return { raw, ...record };
}

export async function rotateRefreshToken(rawToken: string) {
  const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const existing = await prisma.refreshToken.findFirst({ where: { tokenHash: hash, revokedAt: null } });
  if (!existing) return null;
  if (existing.expiresAt < new Date()) return null;
  // revoke & replace
  const newIssued = await issueRefreshToken(existing.userId);
  await prisma.refreshToken.update({ where: { id: existing.id }, data: { revokedAt: new Date(), replacedById: newIssued.id } });
  return newIssued;
}

export async function revokeRefreshToken(rawToken: string) {
  const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
  await prisma.refreshToken.updateMany({ where: { tokenHash: hash, revokedAt: null }, data: { revokedAt: new Date() } });
}
