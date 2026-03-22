import Link from "next/link";
import { ResultCard } from "./ResultCard";
import { LoadingIndicator } from "./LoadingIndicator";
import { SearchProject, WebSearchResult } from "./types";

// ---- Text ----
export function TextPart({ text }: { text: string }) {
  return <div className="whitespace-pre-wrap mb-2">{text}</div>;
}

// ---- Database search result ----
export function SearchProjectsPart({ part }: { part: any }) {
  const projects: SearchProject[] = part.output;
  const state: string = part.state;

  if (projects) {
    return (
      <ResultCard
        title="🔍 Database search results"
        items={projects}
        renderItem={(proj, idx) => (
          <Link
            key={idx}
            href={`/project/${proj.id}`}
            className="block p-2 hover:bg-gray-50 rounded transition-colors border-b last:border-0 border-gray-100"
          >
            <div className="font-semibold text-gray-900 text-sm">
              {proj.title}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {proj.architect} • {proj.year}
            </div>
          </Link>
        )}
        emptyMessage="No projects found."
      />
    );
  }

  if (state === "call" || state === "input-streaming") {
    return <LoadingIndicator text="Searching in vector database..." />;
  }

  return null;
}

// ---- Web search result ----
export function WebSearchPart({ part }: { part: any }) {
  const results: WebSearchResult[] = part.output;
  const state: string = part.state;

  if (results) {
    return (
      <ResultCard
        title="🌐 Web Search Results"
        items={results}
        renderItem={(res, idx) => (
          <div
            key={idx}
            className="p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors border-b last:border-0 border-gray-100"
            onClick={() => window.open(res.url, "_blank")}
          >
            <div className="font-semibold text-gray-900 text-sm">
              {res.title}
            </div>
            <div className="text-gray-500 text-xs mt-1 line-clamp-2">
              {res.snippet}
            </div>
          </div>
        )}
        emptyMessage="No web search results found."
      />
    );
  }

  if (state === "call" || state === "input-streaming") {
    return <LoadingIndicator text="Searching the web..." />;
  }

  return null;
}

// ---- Router: decides which part component to render ----
export function MessagePart({ part, index }: { part: any; index: number }) {
  switch (part.type) {
    case "text":
      return <TextPart key={`text-${index}`} text={part.text} />;
    case "tool-search_projects":
      return <SearchProjectsPart key={`search-${index}`} part={part} />;
    case "tool-web_search":
      return <WebSearchPart key={`web-${index}`} part={part} />;
    default:
      return null;
  }
}
