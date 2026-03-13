// import { streamText, convertToModelMessages } from "ai";
// import { createOpenAI } from "@ai-sdk/openai";
// import { buildProjectContext } from "@/app/lib/rag/context";

// const openai = createOpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   baseURL: process.env.OPENAI_API_BASE,
// });

// export async function POST(req: Request) {
//   const payload = await req.json();
//   const { messages, projectId, ...rest } = payload;
//   console.log("RAG Debug -> full payload:", payload);
//   console.log("RAG Debug -> projectId received:", projectId, typeof projectId);

//   let context = "";
//   if (projectId) {
//     context = await buildProjectContext(projectId);
//     console.log("RAG Debug -> generated context length:", context.length);
//   }

//   const result = await streamText({
//     model: openai.chat("anthropic/claude-3.5-sonnet"), //注意加.chat, 因为openRouter的api是chat
//     messages: await convertToModelMessages(messages), //promise转成数组messages[]， UI messages转成ModelMessages
//     system: `
// You are an expert architecture assistant.

// Use the following project information to answer:

// ${context}
// `,
//   });
//   return result.toUIMessageStreamResponse(); //又转成UI messages
// }
