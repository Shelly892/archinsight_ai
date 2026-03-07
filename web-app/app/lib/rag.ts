import { findSimilarProjects } from "./rag/retrieve";
import { db } from "./db";

export async function buildProjectContext(projectId: string) {
  const project = await db.query("SELECT * FROM projects WHERE id=$1", [
    projectId,
  ]);

  const p = project.rows[0];

  const similar = await findSimilarProjects(p.embedding);

  return `
Project:
${p.title}

Architect:
${p.architect}

Year:
${p.year}

Description:
${p.description}

Similar projects:
${similar.map((s) => s.title).join(", ")}
`;
}
