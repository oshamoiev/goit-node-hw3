import { defineConfig } from "vitest/config";
import "dotenv/config";

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: process.env.TEST_DATABASE_URL,
    },
    setupFiles: ["./tests/setup.ts"],
    fileParallelism: false,
  },
});
