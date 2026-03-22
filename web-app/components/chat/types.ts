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
