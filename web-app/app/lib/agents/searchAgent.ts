import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { searchProjects } from "../rag/retrieve";
import { generateEmbedding } from "../embeddings";
import { z } from "zod";

export async function searchAgent(messages: any) {
  // We use the most recent user message for the search query embedding
  const lastUserMessage = messages.filter((m: any) => m.role === "user").pop();
  const queryText = lastUserMessage?.content || messages[0].content;

  return streamText({
    model: openai.chat("openai/gpt-4o"),

    system: `
    You are an expert architecture search assistant. 
    Your primary function is to recommend architecture projects based on user search queries.
    You MUST call the \`search_projects\` tool to query the database and retrieve information, even if the user just casually mentions a style or building type.
    Once you receive the tool results, summarize them politely to the user, highlighting key features like the architect, year, and location.
    `,

    messages,
    tools: {
      search_projects: tool({
        description:
          "Search the architectural database for projects matching the user query. Always use this to get recommendations.",
        parameters: z.object({
          query: z
            .string()
            .describe(
              "The user's architecture-related search query or concept"
            ),
        }),
        // @ts-ignore
        execute: async ({ query }: { query: string }) => {
          // Use the actual user's prompt (queryText) instead of the AI's generated query for the best embedding match
          const embedding = await generateEmbedding(queryText);
          const projects = await searchProjects(embedding);
          return projects; // Passed to the client as toolInvocation.result
        },
      }),
    },
  });
}
