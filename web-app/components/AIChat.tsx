"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect } from "react";

type AgentType = "project" | "search" | "case-study";
interface Project {
  id: string;
  title: string;
  architect: string;
  year: number;
  location?: string;
  area?: string;
  gallery?: string[];
  description: string;
  embedding: number[];
}

interface AIChatProps {
  projectId?: string;
  onProjectsUpdate?: (projects: Project[]) => void; //callback props pattern
}
//通常以 on 开头，代表这是一个事件监听器。数据更新回调

export function AIChat({ projectId, onProjectsUpdate }: AIChatProps) {
  const availableAgents: AgentType[] = projectId
    ? ["project", "case-study"]
    : ["search"];

  const [currentAgent, setCurrentAgent] = useState<AgentType>(
    projectId ? "project" : "search"
  );
  const [input, setInput] = useState("");

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/chat/${currentAgent}`,
    }),
  });

  // Automatically update the main project list if a search tool returned results
  useEffect(() => {
    if (!onProjectsUpdate) return;

    // Look for tool invocations via the 'parts' array in the latest messages (Vercel AI SDK v6 standard)
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.parts) {
      const toolPart = lastMessage.parts.find(
        (p: any) =>
          p.type === "tool-invocation" &&
          (p as any).toolInvocation?.toolName === "search_projects" &&
          "result" in ((p as any).toolInvocation || {})
      );

      if (
        toolPart &&
        toolPart.type === "tool-invocation" &&
        (toolPart as any).toolInvocation?.result
      ) {
        onProjectsUpdate((toolPart as any).toolInvocation.result as any[]);
      }
    }
  }, [messages, onProjectsUpdate]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    let finalInput = input;

    // Detect @ trigger to switch agents
    if (input.startsWith("@")) {
      const parts = input.split(" ");
      const trigger = parts[0].toLowerCase();

      let newAgent: AgentType | null = null;
      if (trigger === "@project" && availableAgents.includes("project"))
        newAgent = "project";
      else if (trigger === "@search" && availableAgents.includes("search"))
        newAgent = "search";
      else if (trigger === "@case" && availableAgents.includes("case-study"))
        newAgent = "case-study";

      if (newAgent) {
        setCurrentAgent(newAgent);
        finalInput = parts.slice(1).join(" ");
        setInput("");

        if (finalInput.trim().length === 0) {
          return; // prevent empty submission
        }
      }
    }

    const payloadBody: Record<string, string> = {};
    if (projectId) {
      payloadBody.projectId = projectId;
    }

    sendMessage({ text: finalInput }, { body: payloadBody });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">
          AI Architecture Assistant
        </h2>
        <div className="flex gap-2 text-xs">
          {availableAgents.includes("project") && (
            <span
              className={`px-2 py-1 rounded ${currentAgent === "project" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"}`}
            >
              @project
            </span>
          )}
          {availableAgents.includes("search") && (
            <span
              className={`px-2 py-1 rounded ${currentAgent === "search" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
            >
              @search
            </span>
          )}
          {availableAgents.includes("case-study") && (
            <span
              className={`px-2 py-1 rounded ${currentAgent === "case-study" ? "bg-purple-100 text-purple-700" : "bg-gray-200 text-gray-600"}`}
            >
              @case
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 text-sm">
            <p>Start chatting with the AI Assistant.</p>
            <p className="mt-2">
              Type{" "}
              {availableAgents.map((agent, index) => (
                <span key={agent}>
                  {index > 0 &&
                    (index === availableAgents.length - 1 ? ", or " : ", ")}
                  <code className="bg-gray-100 px-1 rounded text-gray-600">
                    @{agent === "case-study" ? "case" : agent}
                  </code>
                </span>
              ))}{" "}
              to switch agents.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  m.role === "user"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {m.parts.map((p, i) => {
                  // 1. 渲染普通文本
                  if (p.type === "text") {
                    return (
                      <span key={i} className="whitespace-pre-wrap">
                        {p.text}
                      </span>
                    );
                  }

                  // 2. 渲染工具调用 (Tool Invocation)
                  if (p.type === "tool-invocation") {
                    const invocation = (p as any).toolInvocation;

                    // 2a. 工具状态：已返回结果
                    if (
                      invocation.toolName === "search_projects" &&
                      invocation.state === "result"
                    ) {
                      const projects = invocation.result;

                      // 如果没有找到项目
                      if (!projects || projects.length === 0) {
                        return (
                          <div
                            key={i}
                            className="text-gray-500 text-sm mt-2 italic"
                          >
                            未找到相关建筑项目。
                          </div>
                        );
                      }

                      // 如果找到了项目，渲染迷你卡片
                      return (
                        <div
                          key={i}
                          className="mt-3 p-3 bg-white border border-gray-200 rounded-md shadow-sm"
                        >
                          <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                            🔍 数据库检索结果 ({projects.length})
                          </p>
                          <div className="space-y-2">
                            {projects
                              .slice(0, 3)
                              .map((proj: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex flex-col text-sm border-b last:border-0 pb-2 last:pb-0 border-gray-100"
                                >
                                  <span className="font-semibold text-black">
                                    {proj.title}
                                  </span>
                                  <span className="text-gray-500 text-xs">
                                    {proj.architect}{" "}
                                    {proj.location ? `· ${proj.location}` : ""}
                                  </span>
                                </div>
                              ))}
                            {projects.length > 3 && (
                              <p className="text-xs text-blue-500 cursor-pointer pt-1">
                                + 查看其它 {projects.length - 3} 个项目
                                (见外部列表)
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    }

                    // 2b. 工具状态：正在调用中 (Loading 动画)
                    else if (
                      invocation.toolName === "search_projects" &&
                      invocation.state === "call"
                    ) {
                      return (
                        <div
                          key={i}
                          className="text-gray-400 text-sm mt-2 animate-pulse flex items-center gap-2"
                        >
                          <svg
                            className="animate-spin h-4 w-4 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          正在向量数据库中检索图纸...
                        </div>
                      );
                    }
                  }

                  // 如果都不是，则不渲染任何东西
                  return null;
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Ask a question or type @..."
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-black text-white px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
