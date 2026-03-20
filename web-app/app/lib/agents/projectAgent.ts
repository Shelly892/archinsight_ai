import { streamText, convertToModelMessages, stepCountIs, tool } from "ai";
import { openai } from "@/app/lib/openai";
import { buildProjectContext } from "@/app/lib/rag/context";
import { z } from "zod";

export async function projectAgent(messages: any[], projectId: string) {
  let context = "";
  if (projectId) {
    context = await buildProjectContext(projectId);
  }

  return streamText({
    model: openai.chat("anthropic/claude-3.5-sonnet"),
    messages: await convertToModelMessages(messages),
    system: `
      You are an expert architecture assistant. 
      You have access to a LOCAL CONTEXT (database) and a WEB SEARCH tool.
      
      LOCAL CONTEXT:
      ${context}  
      
      INSTRUCTIONS:
      1. Always check the LOCAL CONTEXT first to answer questions about the project.
      2. If the user asks for broader information (e.g., "What are the local building codes in this city?" or "Latest news about this architect"), use the 'web_search' tool.
      3. Combine both sources to provide a comprehensive, professional response.
`,
    stopWhen: stepCountIs(5),
    tools: {
      web_search: tool({
        description:
          "Search the web for up-to-date information, local codes, or architect news.",
        parameters: z.object({
          query: z
            .string()
            .describe("The search query to look up on the internet"),
        }),
        // @ts-ignore
        execute: async ({ query }) => {
          try {
            console.log(` Web Search: ${query}`);
            const response = await fetch("https://api.tavily.com/search", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                api_key: process.env.TAVILY_API_KEY,
                query: query,
                search_depth: "basic",
                max_results: 5,
              }),
            });
            const data = await response.json();
            return data.results.map((r: any) => ({
              title: r.title,
              url: r.url,
              snippet: r.content,
            }));
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
