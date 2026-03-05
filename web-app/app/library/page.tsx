"use client";

import { useEffect, useState } from "react";

export default function LibraryPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/library")
      .then((res) => res.json())
      .then(setProjects);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Project Library</h1>

      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p.id} className="border p-4">
            <h2 className="font-bold">{p.title}</h2>

            <p className="text-sm text-gray-500">{p.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
