import { AIChat } from "@/components/AIChat";
import { db } from "@/app/lib/db";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";

// Fetch data server-side
async function getProject(id: string) {
  if (!id || id === "undefined" || isNaN(Number(id))) {
    return null;
  }
  try{
    const result = await db.query(
      "SELECT id, architect, title, year, location, area, gallery, description, embedding FROM projects WHERE id=$1",
      [id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
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
    <div className="p-6 max-w-[1600px] mx-auto w-full h-[calc(100vh-73px)]">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 h-full">
        {/* Left Column: Project Details */}
        <div className="lg:col-span-7 h-full overflow-hidden">
          <ProjectDetail project={project} />
        </div>
        {/* Right Column: AI Chat */}
        <div className="lg:col-span-3 h-full overflow-hidden">
          <AIChat projectId={id} />
        </div>
      </div>
    </div>
  );
}
