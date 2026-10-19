import { describe, expect, it } from "vitest";
import { authModeHref, safeReturnPath } from "@/lib/auth-redirect";

describe("safeReturnPath", () => {
  it("returns a local requested path", () => {
    expect(safeReturnPath("?next=%2Ftools%2Ftodo%3Fview%3Dtoday")).toBe("/tools/todo?view=today");
  });

  it("falls back to learning for missing or unsafe paths", () => {
    expect(safeReturnPath("")).toBe("/learn");
    expect(safeReturnPath("?next=https%3A%2F%2Fevil.example")).toBe("/learn");
    expect(safeReturnPath("?next=%2F%2Fevil.example")).toBe("/learn");
  });
});

describe("authModeHref", () => {
  it("keeps a protected return path when switching forms", () => {
    expect(authModeHref("register", "/tools/todo")).toBe("/register?next=%2Ftools%2Ftodo");
  });

  it("keeps normal navigation clean", () => {
    expect(authModeHref("login", "/learn")).toBe("/login");
  });
});
