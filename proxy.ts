import { NextResponse, type NextRequest } from "next/server";
import { getAdminAuth, isAdminEmail } from "@/lib/firebase-admin";

function redirectUnauthorized(request: NextRequest, requiresLogin: boolean) {
  return NextResponse.redirect(new URL(requiresLogin ? "/login" : "/learn", request.url));
}

export async function proxy(request: NextRequest) {
  const adminAuth = getAdminAuth();
  const sessionCookie = request.cookies.get("firebase-session")?.value;
  const requiresLogin = ["/learn/code-review", "/learn/dsa", "/learn/system-design", "/learn/backend-engineering", "/library"]
    .some((path) => request.nextUrl.pathname.startsWith(path));

  if (adminAuth && sessionCookie) {
    try {
      const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
      if (requiresLogin || isAdminEmail(decodedToken.email)) {
        return NextResponse.next();
      }
    } catch {
      return redirectUnauthorized(request, requiresLogin);
    }
  }

  return redirectUnauthorized(request, requiresLogin);
}

export const config = {
  matcher: [
    "/learn/language/:path*",
    "/learn/japanese-n5/:path*",
    "/learn/japanese-n4/:path*",
    "/learn/japanese-n3/:path*",
    "/learn/duolingo/:path*",
    "/learn/survival-phrases/:path*",
    "/learn/japanese-interview/:path*",
    "/learn/english-meaning/:path*",
    "/learn/tongue-twister/:path*",
    "/learn/speak-like-pro/:path*",
    "/learn/loksewa/:path*",
    "/learn/personal-development/:path*",
    "/learn/focus-goals/:path*",
    "/learn/discipline/:path*",
    "/learn/focus-music/:path*",
    "/learn/exercise/:path*",
    "/learn/motivation/:path*",
    "/learn/devotion/:path*",
    "/learn/code-review/:path*",
    "/learn/dsa/:path*",
    "/learn/system-design/:path*",
    "/learn/backend-engineering/:path*",
    "/library/:path*",
  ],
};
