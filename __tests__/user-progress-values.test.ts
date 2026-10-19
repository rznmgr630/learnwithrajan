import { describe, expect, it } from "vitest";
import { nextProgressValues } from "@/lib/user-progress-values";

describe("nextProgressValues", () => {
  it("adds a newly completed lesson without mutating current progress", () => {
    const current = new Set(["day-1"]);
    const result = nextProgressValues(current, "day-2");

    expect(result.wasCompleted).toBe(false);
    expect([...result.values]).toEqual(["day-1", "day-2"]);
    expect([...current]).toEqual(["day-1"]);
  });

  it("removes a completed lesson", () => {
    const result = nextProgressValues(new Set(["day-1", "day-2"]), "day-1");

    expect(result.wasCompleted).toBe(true);
    expect([...result.values]).toEqual(["day-2"]);
  });
});
