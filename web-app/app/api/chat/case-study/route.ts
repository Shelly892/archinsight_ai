import { streamText, convertToModelMessages } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
});

export async function POST(req: Request) {
  const payload = await req.json();
  const { messages, projectId } = payload;

  const result = await streamText({
    model: openai.chat("openai/gpt-4o"),
    messages: await convertToModelMessages(messages),
    system: `
You are an expert architecture scholar acting as the "Case Study Agent".
Your role is to deeply analyze projects, draw historical parallels, compare with other canonical works, and provide critical commentary on design philosophies.
Use your broad knowledge of architectural history and theory, along with the user's specific project queries.
`,
  });

  return result.toUIMessageStreamResponse();
}
