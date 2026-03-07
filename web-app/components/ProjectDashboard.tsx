"use client";

import { useState } from "react";
import ProjectList from "@/components/ProjectList";
import { AIChat } from "@/components/AIChat";

export default function ProjectDashboard({
  initialProjects,
}: {
  initialProjects: any[];
}) {
  const [projects, setProjects] = useState(initialProjects);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 h-full">
      {/* Left Column: Project List */}
      <div className="lg:col-span-7 h-full overflow-hidden">
        <ProjectList projects={projects} />
      </div>

      {/* Right Column: AI Chat */}
      <div className="lg:col-span-3 h-full overflow-hidden">
        <AIChat onProjectsUpdate={setProjects} />
      </div>
    </div>
  );
}
