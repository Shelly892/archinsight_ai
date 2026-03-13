import { stepCountIs, streamText, tool } from "ai";
import { openai } from "../openai";
import { searchProjects } from "../rag/retrieve";
import { generateEmbedding } from "../rag/embeddings";
import { z } from "zod";

export async function searchAgent(messages: any) {
  return streamText({
    model: openai.chat("anthropic/claude-3.5-sonnet"),
    // model: openai.chat("openai/gpt-4o"),
    system: `
    You are an expert architecture search assistant. 
    Your primary function is to recommend architecture projects based on user search queries.
    You MUST call the \`search_projects\` tool to query the database and retrieve information.
    Once you receive the tool results, summarize them politely to the user.
    `,
    stopWhen: stepCountIs(5),
    messages,
    tools: {
      search_projects: tool({
        description:
          "Search the architectural database for projects matching the user query. Always use this to get recommendations.",
        parameters: z.object({
          query: z.string().describe("The user's search query"),
        }),

        // @ts-ignore
        execute: async ({ query }: { query: string }) => {
          try {
            console.log(`\n[Tool] 1. start to process query: "${query}"`);

            const embedding = await generateEmbedding(query);
            console.log(
              "[Tool] 2. embedding generated, length:",
              embedding.length
            );

            const projects = await searchProjects(embedding);
            console.log(
              "[Tool] 3. database retrieval success, found projects:",
              projects.length
            );

            return projects;
          } catch (error) {
            console.error("\n [Tool] error! execution failed:", error);

            return {
              error: "Database or embedding failure.",
              details: String(error),
            };
          }
        },
      }),
    },
  });
}
