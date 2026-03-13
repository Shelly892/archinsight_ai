"use client";

import { useChat, UIMessage } from "@ai-sdk/react";
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
  onProjectsUpdate?: (projects: Project[]) => void;
}

export function AIChat({ projectId, onProjectsUpdate }: AIChatProps) {
  const availableAgents: AgentType[] = projectId
    ? ["project", "case-study"]
    : ["search"];

  const [currentAgent, setCurrentAgent] = useState<AgentType>(
    projectId ? "project" : "search"
  );
  const [input, setInput] = useState("");

  const storageKey = projectId
    ? `archinsight_chat_${projectId}`
    : `archinsight_chat_search`;

  // Provide an initial loading state constraint to prevent hydration mismatch
  // between server SSR (empty localstorage) and client mounting (has localstorage)
  const [isMounted, setIsMounted] = useState(false);
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);

  const { messages, sendMessage, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/chat/${currentAgent}`,
    }),
  });

  useEffect(() => {
    // Client-side hydration only
    const savedChat = localStorage.getItem(storageKey);
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        } else {
          setMessages([]);
        }
      } catch (e) {
        console.error("Failed to parse saved chat history", e);
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
    setLoadedStorageKey(storageKey);
    setIsMounted(true);
  }, [storageKey, setMessages]);

  // Sync back to localstorage whenever messages update
  useEffect(() => {
    // 🚨 Only save if the currently loaded storage key matches the current storageKey prop
    // This prevents writing Project A's messages into Project B's cache when navigating
    if (isMounted && loadedStorageKey === storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, isMounted, storageKey, loadedStorageKey]);

  // 🎯 修复 1：倒序扫描，防止多步调用时被纯文本覆盖
  useEffect(() => {
    if (!onProjectsUpdate || messages.length === 0) return;

    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (!m.parts) continue;

      // 只要名字里带 search_projects 就抓取
      const toolPart = m.parts.find(
        (p: any) =>
          p.type === "tool-search_projects" || p.toolName === "search_projects"
      );

      if (toolPart) {
        const pObj = toolPart as any;
        const projects = pObj.output;
        if (projects && projects.length > 0) {
          onProjectsUpdate(projects);
          break; // 找到了就立刻抛出，并停止扫描
        }
      }
    }
  }, [messages, onProjectsUpdate]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    let finalInput = input;

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
        if (finalInput.trim().length === 0) return;
      }
    }

    const payloadBody: Record<string, string> = {};
    if (projectId) payloadBody.projectId = projectId;

    sendMessage({ text: finalInput }, { body: payloadBody });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* 头部栏保持不变 */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">
          AI Architecture Assistant
        </h2>

        <div className="flex items-center gap-3">
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

          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to clear this chat history?"
                )
              ) {
                setMessages([]);
                localStorage.removeItem(storageKey);
              }
            }}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Clear Chat History"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px]">
        {/* Render loading state if not fully mounted to prevent hydration errors */}
        {!isMounted ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg
              className="animate-spin h-5 w-5 mr-2"
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
            Loading chat history...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 text-sm">
            <p>Start chatting with the AI Assistant.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${m.role === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-800"}`}
              >
                {/* 🎯 修复 2：全兼容渲染逻辑 */}
                {m.parts?.map((p: any, i: number) => {
                  // 1. 渲染纯文本
                  if (p.type === "text") {
                    return (
                      <div
                        key={`text-${i}`}
                        className="whitespace-pre-wrap mb-2"
                      >
                        {p.text}
                      </div>
                    );
                  }

                  // 2. 渲染工具卡片 (宽松判断)
                  const isSearchTool =
                    p.type === "tool-search_projects" ||
                    p.toolName === "search_projects";

                  if (isSearchTool) {
                    // 兼容各种奇葩的 Vercel 字段命名
                    const projects = p.result || p.output;
                    const state = p.state || (projects ? "result" : "call");

                    // 状态 A：拿到数据了
                    if (projects) {
                      if (projects.length === 0) {
                        return (
                          <div
                            key={`empty-${i}`}
                            className="text-gray-500 text-sm mt-2 italic"
                          >
                            未找到相关建筑项目。
                          </div>
                        );
                      }
                      return (
                        <div
                          key={`card-${i}`}
                          className="mt-2 mb-3 p-3 bg-white border border-gray-200 rounded-md shadow-sm"
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
                                  className="p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors border-b last:border-0 border-gray-100"
                                  onClick={() =>
                                    window.open(`/project/${proj.id}`, "_blank")
                                  }
                                >
                                  <div className="font-semibold text-gray-900 text-sm">
                                    {proj.title}
                                  </div>
                                  <div className="text-gray-500 text-xs mt-1">
                                    {proj.architect} • {proj.year}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    }

                    // 状态 B：加载中
                    if (state === "call" || state === "input-streaming") {
                      return (
                        <div
                          key={`load-${i}`}
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
