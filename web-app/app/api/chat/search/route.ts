import { streamText, convertToModelMessages } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
// Adjust this to your actual file storing `searchProjects` or `searchAgent` once fully built out
// For now, setting up the basic streaming logic.

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
});

export async function POST(req: Request) {
  const payload = await req.json();
  const { messages } = payload;

  // Example placeholder for vector search integration
  // const lastMessage = messages[messages.length - 1];
  // const embedding = await getEmbedding(lastMessage.content);
  // const context = await searchProjects(embedding);

  const result = await streamText({
    model: openai.chat("openai/gpt-4o"),
    messages: await convertToModelMessages(messages),
    system: `
You are an expert architecture search assistant acting as the "Search Agent".
Your primary function is to recommend architecture projects based on search queries, concepts, or styles.
When functional, you will be provided with retrieved project contexts to inform your recommendations.
`,
  });

  return result.toUIMessageStreamResponse();
}
