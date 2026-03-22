export type AgentType = "project" | "search" | "case";
export interface Project {
  id: string;
  title: string;
  architect: string;
  year: number;
  location?: string;
  area?: string;
  gallery?: string[];
  description: string;
  embedding: number[];
}
export interface SearchProject {
  id: string;
  title: string;
  architect: string;
  year: number;
  location?: string;
  area?: string;
}
export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface AIChatProps {
  projectId?: string;
  onProjectsUpdate?: (projects: Project[]) => void;
}
export type MessagePart = TextPart | SearchProjectsPart | WebSearchPart;

export type PartState =
  | "call"
  | "input-streaming"
  | "output-streaming"
  | "done";

export interface TextPart {
  type: "text";
  text: string;
}

export interface SearchProjectsPart {
  type: "tool-search_projects";
  output: SearchProject[] | null;
  state: PartState;
}

export interface WebSearchPart {
  type: "tool-web_search";
  output: WebSearchResult[] | null;
  state: PartState;
}
