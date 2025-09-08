import type { Pool } from "mysql2/promise";

let pool: Pool | null = null;

export async function getMySqlPool() {
  if (!process.env.MYSQL_HOST || !process.env.MYSQL_DATABASE || !process.env.MYSQL_USER) return null;
  if (pool) return pool;
  const mysql = await import("mysql2/promise");
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD ?? undefined,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
    namedPlaceholders: true,
    timezone: "+00:00",
  });
  await ensureSchema(pool);
  return pool;
}

async function ensureSchema(p: Pool) {
  await p.query(`CREATE TABLE IF NOT EXISTS todos (
    id VARCHAR(36) PRIMARY KEY,
    title TEXT NOT NULL,
    completed TINYINT(1) NOT NULL DEFAULT 0,
    date DATETIME NULL,
    priority ENUM('low','medium','high') NOT NULL DEFAULT 'low',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
  ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
}
