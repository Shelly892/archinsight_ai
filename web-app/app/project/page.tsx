import { AIChat } from "@/components/AIChat";
import ProjectList from "@/components/ProjectList";
import { db } from "@/app/lib/db";

async function getProjects() {
  const res = await db.query("SELECT * FROM projects");
  return res.rows;
}

export default async function Page() {
  const projects = await getProjects();
  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left Column: Project List */}
        <ProjectList projects={projects} />

        {/* Right Column: AI Chat */}
        <div className="h-[calc(100vh-3rem)] sticky top-6">
          <AIChat />
        </div>
      </div>
    </div>
  );
}
