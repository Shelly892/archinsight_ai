import Image from "next/image";
import Link from "next/link";

export default function ProjectDetail({ project }: { project: any }) {
  return (
    <div className="space-y-6 overflow-y-auto pr-4 custom-scrollbar h-full">
      <div>
        <Link
          href="/project"
          className="inline-flex items-center ml-2 text-sm font-medium text-gray-500 hover:text-black transition-colors mb-4 group"
        >
          <svg
            className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Projects
        </Link>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          {project.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex flex-col">
            <span className="text-gray-400 uppercase text-xs font-bold tracking-wider">
              Architect
            </span>
            <span className="font-medium text-gray-900">
              {project.architect}
            </span>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-gray-400 uppercase text-xs font-bold tracking-wider">
              Year
            </span>
            <span className="font-medium text-gray-900">{project.year}</span>
          </div>
          {/* <div className="w-px bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-gray-400 uppercase text-xs font-bold tracking-wider">
              Location
            </span>
            <span className="font-medium text-gray-900">
              {project.location || "N/A"}
            </span>
          </div> */}
          <div className="w-px bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-gray-400 uppercase text-xs font-bold tracking-wider">
              Area
            </span>
            <span className="font-medium text-gray-900">
              {project.area || "N/A"}
            </span>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-gray-400 uppercase text-xs font-bold tracking-wider">
              Original Link
            </span>
            <span className="font-medium text-blue-600 hover:underline break-all">
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                {project.url}
              </a>
            </span>
          </div>
        </div>
      </div>

      <div className="prose prose-gray max-w-none space-y-4">
        {(project.description || "")
          .replace(
            /^\+\s*\d+\s*(?:Text description provided by the architects\.)?/gi,
            ""
          )
          .replace(/Text description provided by the architects\./gi, "")
          .split("\n")
          .map((p: string) => p.trim())
          .filter((p: string) => p !== "")
          .map((paragraph: string, index: number) => (
            <p key={index} className="text-gray-700 leading-relaxed text-lg">
              {paragraph}
            </p>
          ))}
      </div>

      {project.gallery && project.gallery.length > 0 && (
        <div className="space-y-6">
          {project.gallery.slice(0, 5).map((imgUrl: string, idx: number) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden shadow-lg border border-gray-100"
            >
              <Image
                src={imgUrl || "/placeholder.svg"}
                alt={`${project.title} - Image ${idx + 1}`}
                width={800}
                height={600}
                quality={100}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
