import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "./db";
const COOKIE = "zsc_session";
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET);
export async function login(email: string, password: string) {
  const admin = await db.admin.findUnique({ where: { email: email.toLowerCase() } });
  // Compare against a dummy hash when no admin exists to keep timing similar
  const hash = admin?.password ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidu";
  const ok = await bcrypt.compare(password, hash);
  if (!admin || !ok) return false;
  const token = await new SignJWT({ sub: admin.id }).setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h").sign(key());
  cookies().set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  return true;
}
export function logout() { cookies().delete(COOKIE); }
export async function getAdminId() {
  const t = cookies().get(COOKIE)?.value;
  if (!t) return null;
  try { return (await jwtVerify(t, key())).payload.sub ?? null; } catch { return null; }
}
