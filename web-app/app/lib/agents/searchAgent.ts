import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { searchProjects } from "../rag/retrieve";

export async function searchAgent(messages: any, embedding: number[]) {
  const context = await searchProjects(embedding);

  return streamText({
    model: openai.chat("openai/gpt-4o"),

    system: `
    You are an architecture search assistant.
    Recommend relevant projects.
    `,

    messages,
  });
}
