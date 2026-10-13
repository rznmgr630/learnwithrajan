import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const sessionCookieName = "learn-session";

type Session = {
  email: string;
  expiresAt: number;
  uid: string;
};

type FirebaseAccount = {
  email?: string;
  localId?: string;
};

function sessionSecret() {
  return process.env.SESSION_SECRET;
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()!).update(value).digest("base64url");
}

export function isSessionConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.ADMIN_EMAIL && sessionSecret());
}

export function isAdminEmail(email: string) {
  return email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
}

export async function verifyFirebaseIdToken(idToken: string): Promise<FirebaseAccount | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    cache: "no-store",
  });
  if (!response.ok) return null;

  const data = await response.json() as { users?: FirebaseAccount[] };
  const account = data.users?.[0];
  return account?.email && account.localId ? account : null;
}

export function createSession(email: string, uid: string, expiresAt: number) {
  const payload = Buffer.from(JSON.stringify({ email, expiresAt, uid })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSession(value: string | undefined): Session | null {
  if (!value || !sessionSecret()) return null;

  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = sign(payload);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session;
    return typeof session.email === "string" && typeof session.uid === "string" && session.expiresAt > Date.now()
      ? session
      : null;
  } catch {
    return null;
  }
}
