import { describe, expect, it } from "vitest";
import { comparePassword, hashPassword } from "../../src/services/password.service.ts";

describe("hashPassword", () => {
  it("returns a bcrypt hash that is not the plain password", async () => {
    const hash = await hashPassword("secret123");

    expect(hash).not.toBe("secret123");
    expect(hash).toMatch(/^\$2[aby]\$10\$/);
  });

  it("returns a different hash for the same password each time", async () => {
    const first = await hashPassword("secret123");
    const second = await hashPassword("secret123");

    expect(first).not.toBe(second);
  });
});

describe("comparePassword", () => {
  it("returns true when the password matches the hash", async () => {
    const hash = await hashPassword("secret123");

    expect(await comparePassword("secret123", hash)).toBe(true);
  });

  it("returns false when the password does not match the hash", async () => {
    const hash = await hashPassword("secret123");

    expect(await comparePassword("wrong-password", hash)).toBe(false);
  });
});
