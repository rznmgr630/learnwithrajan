import { NextResponse, type NextRequest } from "next/server";

function redirectUnauthorized(request: NextRequest, requiresLogin: boolean) {
  return NextResponse.redirect(new URL(requiresLogin ? "/login" : "/learn", request.url));
}

async function getSessionStatus(request: NextRequest) {
  try {
    const response = await fetch(new URL("/api/auth/session", request.url), {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
    });

    if (!response.ok) return { isAuthenticated: false, isAdmin: false };
    return await response.json() as { isAuthenticated: boolean; isAdmin: boolean };
  } catch {
    return { isAuthenticated: false, isAdmin: false };
  }
}

export async function proxy(request: NextRequest) {
  const requiresLogin = ["/learn/code-review", "/learn/dsa", "/learn/system-design", "/learn/backend-engineering", "/library"]
    .some((path) => request.nextUrl.pathname.startsWith(path));
  const session = await getSessionStatus(request);

  if ((requiresLogin && session.isAuthenticated) || (!requiresLogin && session.isAdmin)) {
    return NextResponse.next();
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
