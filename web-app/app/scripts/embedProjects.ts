/*  此文件没有用上，只保留作为概念的理解，embedding的生成和存储*/

// import { db } from "../lib/db";
// import { generateEmbedding } from "../lib/rag/embeddings";

// async function embedProjects() {
//   const result = await db.query(
//     "SELECT id, description FROM projects WHERE embedding IS NULL"
//   );

//   for (const project of result.rows) {
//     console.log("Embedding:", project.id);
//     const embedding = await generateEmbedding(project.description);
//     await db.query("UPDATE projects SET embedding=$1 WHERE id=$2", [
//       JSON.stringify(embedding), //要把embedding转换成json字符串
//       // embedding 是 JS 数组，而数据库需要字符串格式。
//       project.id,
//     ]);
//   }
// }

// embedProjects()
//   .then(() => console.log("Done"))
//   .catch((e) => console.error(e));
