import { AIChat } from "@/components/AIChat";
import { db } from "@/app/lib/db";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";

// Fetch data server-side
async function getProject(id: string) {
  const result = await db.query(
    "SELECT id, architect, title, year, location, area, gallery, description, embedding FROM projects WHERE id=$1",
    [id]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left Column: Project Details */}
        <ProjectDetail project={project} />
        {/* Right Column: AI Chat */}
        <div className="h-[calc(100vh-3rem)] sticky top-6">
          <AIChat projectId={id} />
        </div>
      </div>
    </div>
  );
}
