import { Pool } from "pg"; //Pool 是PostgreSQL connection pool

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});
