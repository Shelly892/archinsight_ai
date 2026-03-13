import { stepCountIs, streamText, tool } from "ai"; // 删除了 stepCountIs
import { createOpenAI } from "@ai-sdk/openai";
import { searchProjects } from "../rag/retrieve";
import { generateEmbedding } from "../embeddings";
import { z } from "zod";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
});

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
          // 🛡️ 给整个执行过程穿上防弹衣！
          try {
            console.log(`\n[Tool] 1. 开始处理 AI 提取的搜索词: "${query}"`);

            const embedding = await generateEmbedding(query);
            console.log("[Tool] 2. 向量生成成功！维度长度:", embedding.length);

            const projects = await searchProjects(embedding);
            console.log(
              "[Tool] 3. 🎯 成功执行数据库检索！找到项目:",
              projects.length,
              "个"
            );

            return projects;
          } catch (error) {
            // 🚨 核心抓瞎点！如果有错误，立刻在终端里大声喊出来！
            console.error("\n❌ [Tool] 致命错误！执行检索时崩溃了:", error);

            // 优雅地告诉 AI 发生了什么事，防止 AI 懵逼
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
