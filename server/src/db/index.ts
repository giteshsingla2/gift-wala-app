import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import * as schema from "./schema";

// One pool per server process (kept across dev hot reloads).
const globalForDb = globalThis as unknown as { pool?: mysql.Pool };

const pool =
  globalForDb.pool ??
  mysql.createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 10,
    timezone: "Z",
    dateStrings: ["DATE"],
  });

if (!globalForDb.pool) {
  // Store and read every timestamp in UTC, whatever the MySQL server's own time zone is.
  pool.pool.on("connection", (conn) => conn.query("SET time_zone = '+00:00'"));
}
if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export const db = drizzle(pool, { schema, mode: "default" });
export { schema };
