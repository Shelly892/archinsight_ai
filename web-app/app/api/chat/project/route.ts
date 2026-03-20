import { projectAgent } from "@/app/lib/agents/projectAgent";

export async function POST(req: Request) {
  const payload = await req.json();
  const { messages, projectId } = payload;
  // console.log("payload is:", payload);
  // console.log(JSON.stringify(payload.messages));
  const result = await projectAgent(messages, projectId);

  return result.toUIMessageStreamResponse();
}
