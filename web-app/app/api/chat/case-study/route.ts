// import { streamText, convertToModelMessages } from "ai";
// import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// const openrouter = createOpenRouter({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: Request) {
//   const payload = await req.json();
//   const { messages, projectId } = payload;

//   const result = await streamText({
//     model: openrouter("openai/gpt-4o"),
//     messages: await convertToModelMessages(messages),
//     system: `
// You are an expert architecture scholar acting as the "Case Study Agent".
// Your role is to deeply analyze projects, draw historical parallels, compare with other canonical works, and provide critical commentary on design philosophies.
// Use your broad knowledge of architectural history and theory, along with the user's specific project queries.
// `,
//   });

//   return result.toUIMessageStreamResponse();
// }
