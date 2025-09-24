import crypto from "crypto";
import { prisma } from "@/lib/db";

// Issue a new session token (long-lived) returning raw token plus DB record metadata
export async function issueSessionToken(userId: string, opts: { ttlMinutes?: number; ip?: string | null; userAgent?: string | null } = {}) {
  const { ttlMinutes = 60 * 24 * 7, ip, userAgent } = opts; // default 7 days
  const raw = crypto.randomBytes(48).toString("base64url");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
  const record = await prisma.session.create({
    data: { userId, tokenHash: hash, expiresAt, ip: ip || undefined, userAgent: userAgent || undefined, lastUsedAt: new Date() },
    select: { id: true, expiresAt: true }
  });
  return { raw, ...record };
}

export async function rotateSessionToken(rawToken: string, context: { ip?: string | null; userAgent?: string | null } = {}) {
  const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const existing = await prisma.session.findFirst({ where: { tokenHash: hash, revokedAt: null } });
  if (!existing) return null;
  if (existing.expiresAt < new Date()) return null;
  const newIssued = await issueSessionToken(existing.userId, { ip: context.ip || null, userAgent: context.userAgent || null });
  await prisma.session.update({ where: { id: existing.id }, data: { revokedAt: new Date(), replacedById: newIssued.id, lastUsedAt: new Date() } });
  return newIssued;
}

export async function revokeSessionToken(rawToken: string) {
  const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
  await prisma.session.updateMany({ where: { tokenHash: hash, revokedAt: null }, data: { revokedAt: new Date() } });
}
