import { afterAll, beforeEach } from "vitest";
import prisma from "../prisma/client.ts";
import { cleanDatabase } from "./helpers/db.ts";

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});
