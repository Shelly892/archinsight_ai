import { db } from "@/app/lib/db";

export async function searchProjects(embedding: number[]) {
  const result = await db.query(
    `
    SELECT *,
    embedding <-> $1 AS distance
    FROM projects
    ORDER BY distance
    LIMIT 3
    `,
    [embedding]
  );

  return result.rows;
}
