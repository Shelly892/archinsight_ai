import { convertToModelMessages, UIMessage } from "ai";
import { searchAgent } from "@/app/lib/agents/searchAgent";

export async function POST(req: Request) {
  const {messages}:{messages:UIMessage[]} = await req.json();
  

  // Utilize the actual searchAgent function which has the tools defined
  const result = await searchAgent(await convertToModelMessages(messages));

  return result.toUIMessageStreamResponse();
}
