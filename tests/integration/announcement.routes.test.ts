import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../app.ts";
import prisma from "../../prisma/client.ts";

const createAnnouncement = async (title: string) => {
  const user = await prisma.user.create({
    data: {
      username: `user_${title}`,
      email: `${title}@example.com`,
      password: "hashed",
      name: "Test User",
    },
  });

  return prisma.announcement.create({
    data: {
      title,
      description: "Some description for the test",
      price: 10.5,
      category: "sale",
      userId: user.id,
    },
  });
};

describe("GET /announcements", () => {
  it("returns an empty list when there are no announcements", async () => {
    const response = await request(app).get("/announcements");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [],
      pagination: { total: 0, page: 1, totalPages: 0, perPage: 10 },
    });
  });

  it("returns announcements with pagination when the list is not empty", async () => {
    await createAnnouncement("First announcement");
    await createAnnouncement("Second announcement");

    const response = await request(app).get("/announcements");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0]).toMatchObject({
      price: 10.5,
      category: "sale",
      user: { name: "Test User" },
    });
    expect(response.body.pagination).toEqual({ total: 2, page: 1, totalPages: 1, perPage: 10 });
  });
});

describe("GET /announcements/:id", () => {
  it("returns 404 when the announcement does not exist", async () => {
    const announcement = await createAnnouncement("Deleted announcement");
    await prisma.announcement.delete({ where: { id: announcement.id } });

    const response = await request(app).get(`/announcements/${announcement.id}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Announcement not found" });
  });

  it("returns the announcement when it exists", async () => {
    const announcement = await createAnnouncement("Existing announcement");

    const response = await request(app).get(`/announcements/${announcement.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: announcement.id,
      title: "Existing announcement",
      description: "Some description for the test",
      price: 10.5,
      category: "sale",
      user: { name: "Test User" },
    });
  });
});
