import Image from "next/image";

export default function ProjectList({ projects }: { projects: any[] }) {
  return (
    <div className="space-y-6 overflow-y-auto pr-4 custom-scrollbar">
      <h1 className="text-3xl font-bold mb-6">All Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white"
          >
            {project.gallery && project.gallery.length > 0 ? (
              <div className="relative w-full h-48">
                <Image
                  src={project.gallery[0]}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}

            <div className="p-4 flex flex-col flex-1">
              <h2
                className="text-lg font-bold mb-1 truncate"
                title={project.title}
              >
                {project.title}
              </h2>
              <div className="text-sm text-gray-600 mb-3 space-y-1">
                <div className="truncate" title={project.architect}>
                  <span className="font-medium text-gray-700">Architect:</span>{" "}
                  {project.architect}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Year:</span>{" "}
                  {project.year}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Area:</span>{" "}
                  {project.area || "N/A"}
                </div>
              </div>

              <div className="mt-auto pt-2 border-t border-gray-100">
                <a
                  href={`/project/${project.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center group"
                >
                  View Details
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
