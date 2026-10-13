import { NextResponse, type NextRequest } from "next/server";
import { getAdminAuth, isAdminEmail } from "@/lib/firebase-admin";

const sessionCookieName = "firebase-session";
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
  const adminAuth = getAdminAuth();
  const sessionCookie = request.cookies.get(sessionCookieName)?.value;

  if (!adminAuth || !sessionCookie) {
    return NextResponse.json({ isAdmin: false });
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return NextResponse.json({ isAdmin: isAdminEmail(decodedToken.email) });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}

export async function POST(request: NextRequest) {
  const adminAuth = getAdminAuth();
  if (!adminAuth) {
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

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    if (Date.now() / 1000 - decodedToken.auth_time > 60 * 5) {
      return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
    }

    const signedSessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: sessionDurationMs });
    const response = NextResponse.json({ isAdmin: isAdminEmail(decodedToken.email) });
    response.cookies.set(getSessionCookie(signedSessionCookie, sessionDurationMs / 1000));
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to create a session." }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getSessionCookie("", 0));
  return response;
}
