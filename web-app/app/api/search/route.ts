import { db } from "@/app/lib/db";
import { generateEmbedding } from "@/app/lib/embeddings";

export async function POST(req: Request) {
  const { query } = await req.json();
  const embedding = await generateEmbedding(query);
  const result = await db.query(
    `
    SELECT 
    id, title, architect, year, location,description, embedding <-> $1 AS distance
    FROM projects
    ORDER BY distance ASC
    LIMIT 5
    `,
    [JSON.stringify(embedding)]
  );

  return Response.json(result.rows);
}

//embedding <-> query_embedding  是pgvector 相似度搜索
