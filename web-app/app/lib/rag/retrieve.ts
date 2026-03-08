import { db } from "@/app/lib/db";

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
    LIMIT 3
    `,
    [embedding]
  );

  // 🕵️ 加上这行探照灯代码，在终端里看清真面目！
  console.log("🔍 数据库返回的首个项目:", {
    id: result.rows[0]?.id,
    title: result.rows[0]?.title,
  });

  return result.rows;
}
