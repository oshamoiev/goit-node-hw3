import { describe, expect, it } from "vitest";

describe("Vitest environment", () => {
  it("uses test DATABASE_URL", () => {
    expect(process.env.DATABASE_URL).toContain("billboard_test");
  });
});
