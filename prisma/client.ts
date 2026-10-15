import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";
import { config } from "../src/config.ts";

const adapter = new PrismaPg({
  connectionString: config.databaseUrl,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
