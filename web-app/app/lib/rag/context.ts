import { searchProjects } from "./retrieve";
import { db } from "../db";

export async function buildProjectContext(projectId: string) {
  const project = await db.query("SELECT * FROM projects WHERE id=$1", [
    projectId,
  ]);

  const p = project.rows[0];

  return `
Project:
${p.title}

Architect:
${p.architect}

Year:
${p.year}

Location:
${p.location}

Area:
${p.area}

Description:
${p.description}
`;
}
