import { db } from "../db";

export async function searchProjects(embedding: number[]) {
  const result = await db.query(
    `
    SELECT 
      id, 
      title, 
      architect, 
      year, 
      location, 
      area, 
      gallery, 
      description,
      url,
      embedding <-> $1 AS distance
    FROM projects
    ORDER BY distance
    LIMIT 6
    `,
    // Wrap the embedding array in JSON.stringify so pgvector can parse it correctly
    [JSON.stringify(embedding)]
  );

  console.log("🔍 First result from DB:", {
    id: result.rows[0]?.id,
    title: result.rows[0]?.title,
  });

  return result.rows;
}
