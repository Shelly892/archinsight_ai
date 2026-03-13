import { streamText, convertToModelMessages } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { buildProjectContext } from "@/app/lib/rag/retrieve";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const payload = await req.json();
  const { messages, projectId } = payload;

  let context = "";
  if (projectId) {
    context = await buildProjectContext(projectId);
  }

  const result = await streamText({
    model: openrouter("openai/gpt-4o"),
    messages: await convertToModelMessages(messages),
    system: `
You are an expert architecture assistant acting as the "Project Agent".
Your primary focus is to analyze and answer questions specifically about the provided project context or details.

Use the following project information to answer:
${context}
`,
  });

  return result.toUIMessageStreamResponse();
}
