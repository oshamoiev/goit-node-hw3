import "dotenv/config";
import { execSync } from "node:child_process";

const testDbUrl = process.env.TEST_DATABASE_URL;

if (!testDbUrl) {
  console.error("TEST_DATABASE_URL is not set in .env");
  process.exit(1);
}

const testDbName = new URL(testDbUrl).pathname.slice(1);

if (!testDbName.endsWith("_test")) {
  console.error(
    `TEST_DATABASE_URL must point to a database whose name ends with _test, got "${testDbName}"`,
  );
  process.exit(1);
}

execSync("npx prisma migrate deploy", {
  env: { ...process.env, DATABASE_URL: testDbUrl },
  stdio: "inherit",
});
