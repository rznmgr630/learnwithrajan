export function safeReturnPath(search: string) {
  const next = new URLSearchParams(search).get("next");
  return next?.startsWith("/") && !next.startsWith("//") ? next : "/learn";
}

export function authModeHref(mode: "login" | "register", returnPath: string) {
  return returnPath === "/learn" ? `/${mode}` : `/${mode}?next=${encodeURIComponent(returnPath)}`;
}
