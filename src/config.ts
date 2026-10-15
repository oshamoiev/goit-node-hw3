import "dotenv/config";
import { z } from "zod";

const env = z
  .object({
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(1),
  })
  .parse(process.env);

export const config = {
  databaseUrl: env.DATABASE_URL,
  jwtSecret: env.JWT_SECRET,
};
