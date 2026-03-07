import { db } from "@/app/lib/db";

export async function retrieveProjectContext(projectId: string) {
  const res = await db.query(
    `
    SELECT content
    FROM project_chunks
    WHERE project_id = $1
    LIMIT 20
    `,
    [projectId]
  );

  return res.rows.map((r) => r.content).join("\n");
}
