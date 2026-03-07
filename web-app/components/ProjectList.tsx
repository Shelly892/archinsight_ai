import Image from "next/image";
import ProjectCard from "./ProjectCard";

export default function ProjectList({ projects }: { projects: any[] }) {
  return (
    <div className="space-y-6 overflow-y-auto pr-4 custom-scrollbar h-full">
      <h1 className="text-3xl font-bold mb-6">All Projects</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
