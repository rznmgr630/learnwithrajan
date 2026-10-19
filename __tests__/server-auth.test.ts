import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createSession, isAdminEmail, readSession } from "@/lib/server-auth";

const originalEnvironment = {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  SESSION_SECRET: process.env.SESSION_SECRET,
};

beforeEach(() => {
  process.env.ADMIN_EMAIL = "admin@example.com";
  process.env.SESSION_SECRET = "test-session-secret";
});

afterEach(() => {
  process.env.ADMIN_EMAIL = originalEnvironment.ADMIN_EMAIL;
  process.env.SESSION_SECRET = originalEnvironment.SESSION_SECRET;
});

describe("server sessions", () => {
  it("reads a signed, unexpired session", () => {
    const session = createSession("member@example.com", "user-1", Date.now() + 60_000);

    expect(readSession(session)).toMatchObject({ email: "member@example.com", uid: "user-1" });
  });

  it("rejects a modified session", () => {
    const session = createSession("member@example.com", "user-1", Date.now() + 60_000);

    expect(readSession(`${session}modified`)).toBeNull();
  });

  it("matches admin email without case sensitivity", () => {
    expect(isAdminEmail("ADMIN@example.com")).toBe(true);
    expect(isAdminEmail("member@example.com")).toBe(false);
  });
});
