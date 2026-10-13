import { NextResponse, type NextRequest } from "next/server";
import { createSession, isAdminEmail, isSessionConfigured, readSession, sessionCookieName, verifyFirebaseIdToken } from "@/lib/server-auth";

export const runtime = "nodejs";

const sessionDurationMs = 1000 * 60 * 60 * 24 * 5;

function getSessionCookie(value: string, maxAge: number) {
  return {
    name: sessionCookieName,
    value,
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function GET(request: NextRequest) {
  if (!isSessionConfigured()) {
    return NextResponse.json({ isAuthenticated: false, isAdmin: false }, { status: 503 });
  }

  const session = readSession(request.cookies.get(sessionCookieName)?.value);
  if (!session) {
    return NextResponse.json({ isAuthenticated: false, isAdmin: false });
  }

  return NextResponse.json({ isAuthenticated: true, isAdmin: isAdminEmail(session.email) });
}

export async function POST(request: NextRequest) {
  if (!isSessionConfigured()) {
    return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
  }

  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  try {
    const { idToken } = await request.json();
    if (typeof idToken !== "string") {
      return NextResponse.json({ error: "Missing authentication token." }, { status: 400 });
    }

    const account = await verifyFirebaseIdToken(idToken);
    if (!account?.email || !account.localId) {
      return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
    }

    const expiresAt = Date.now() + sessionDurationMs;
    const response = NextResponse.json({ isAdmin: isAdminEmail(account.email) });
    response.cookies.set(getSessionCookie(createSession(account.email, account.localId, expiresAt), sessionDurationMs / 1000));
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to create a secure session." }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getSessionCookie("", 0));
  return response;
}
