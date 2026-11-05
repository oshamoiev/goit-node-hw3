import { describe, expect, it } from "vitest";
import { CreateAnnouncementSchema } from "../../src/validators/announcement.validator.ts";

const validBody = {
  title: "Used bicycle",
  description: "Well maintained city bike, lightly used.",
  price: 150,
  category: "sale",
};

describe("CreateAnnouncementSchema", () => {
  it("accepts a valid body", () => {
    const result = CreateAnnouncementSchema.safeParse(validBody);

    expect(result.success).toBe(true);
  });

  it("coerces a numeric string price to a number", () => {
    const result = CreateAnnouncementSchema.safeParse({ ...validBody, price: "99.5" });

    expect(result.success).toBe(true);
    expect(result.data?.price).toBe(99.5);
  });

  it("accepts the minimum title length of 5 characters", () => {
    const result = CreateAnnouncementSchema.safeParse({ ...validBody, title: "12345" });

    expect(result.success).toBe(true);
  });

  it("accepts the maximum title length of 50 characters", () => {
    const result = CreateAnnouncementSchema.safeParse({ ...validBody, title: "a".repeat(50) });

    expect(result.success).toBe(true);
  });

  it("rejects a title shorter than 5 characters", () => {
    const result = CreateAnnouncementSchema.safeParse({ ...validBody, title: "1234" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["title"]);
  });

  it("rejects a title longer than 50 characters", () => {
    const result = CreateAnnouncementSchema.safeParse({ ...validBody, title: "a".repeat(51) });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["title"]);
  });

  it("rejects a description shorter than 10 characters", () => {
    const result = CreateAnnouncementSchema.safeParse({ ...validBody, description: "too short" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["description"]);
  });

  it("accepts the minimum price of 0.01", () => {
    const result = CreateAnnouncementSchema.safeParse({ ...validBody, price: 0.01 });

    expect(result.success).toBe(true);
  });

  it("rejects a price below 0.01", () => {
    const result = CreateAnnouncementSchema.safeParse({ ...validBody, price: 0 });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["price"]);
  });

  it("rejects a non-numeric price", () => {
    const result = CreateAnnouncementSchema.safeParse({ ...validBody, price: "free" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["price"]);
  });

  it("rejects an unknown category", () => {
    const result = CreateAnnouncementSchema.safeParse({ ...validBody, category: "rent" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["category"]);
  });

  it("rejects a body with missing required fields", () => {
    const result = CreateAnnouncementSchema.safeParse({ title: "Used bicycle" });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual([
      "description",
      "price",
      "category",
    ]);
  });
});
