import { streamText, convertToModelMessages } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { buildProjectContext } from "@/app/lib/rag";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
});

export async function POST(req: Request) {
  const payload = await req.json();
  const { messages, projectId } = payload;

  let context = "";
  if (projectId) {
    context = await buildProjectContext(projectId);
  }

  const result = await streamText({
    model: openai.chat("openai/gpt-4o"),
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
