"use client";

import { useEffect, useState } from "react";
export default function ProjectPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-bold mb-2">{project.title}</h2>
            <p className="text-gray-600 mb-2">
              {project.architect} • {project.year}
            </p>
            <p className="text-sm line-clamp-3 mb-4">{project.description}</p>
            <a
              href={`/project/${project.id}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View Details →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
