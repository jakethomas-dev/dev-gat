import { SignJWT, jwtVerify, JWTPayload as JoseJWTPayload } from "jose";
import { serialize, parse } from "cookie";

const alg = "HS256";
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");

// Extend the generic jose payload with fixed properties we rely on.
// Keep index signature compatibility so SignJWT accepts it.
export interface AppJWTPayload extends JoseJWTPayload {
  sub: string; // user id
  email: string;
  [key: string]: any; // allow additional claims (required for structural compatibility)
}

const COOKIE_NAME = "app_session";
const REFRESH_COOKIE_NAME = "app_refresh";

export async function signAuthToken(payload: AppJWTPayload, expires = process.env.JWT_EXPIRES || "15m") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(secret);
}

export async function verifyAuthToken(token: string): Promise<AppJWTPayload> {
  const { payload } = await jwtVerify(token, secret, { algorithms: [alg] });
  return payload as AppJWTPayload;
}

export function buildSessionCookie(token: string) {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15, // 15m
  });
}

export function clearSessionCookie() {
  return serialize(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function buildRefreshCookie(token: string, maxAgeSeconds: number) {
  return serialize(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export function clearRefreshCookie() {
  return serialize(REFRESH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function readTokenFromRequest(req: Request): string | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const parsed = parse(cookie);
  return parsed[COOKIE_NAME] || null;
}

export function readRefreshTokenFromRequest(req: Request): string | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const parsed = parse(cookie);
  return parsed[REFRESH_COOKIE_NAME] || null;
}
