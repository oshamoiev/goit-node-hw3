import "dotenv/config";
import { z } from "zod";

const env = z
  .object({
    DATABASE_URL: z.string().min(1),
    ACCESS_TOKEN_SECRET: z.string().min(1),
    REFRESH_TOKEN_SECRET: z.string().min(1),
  })
  .parse(process.env);

export const config = {
  databaseUrl: env.DATABASE_URL,
  accessTokenSecret: env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: env.REFRESH_TOKEN_SECRET,
};
