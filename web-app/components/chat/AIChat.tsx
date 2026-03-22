"use client";

import { useState, useEffect } from "react";
import { AgentType, AIChatProps, MessagePart } from "./types";
import { usePersistentChat } from "./usePersistentChat";
import { MessagePartRenderer } from "./MessageParts";
import { SpinnerIcon } from "./SpinnerIcon";
import { AgentSwitcher } from "./AgentSwitcher";

export function AIChat({ projectId, onProjectsUpdate }: AIChatProps) {
  const availableAgents: AgentType[] = projectId
    ? ["project", "case"]
    : ["search"];

  const [currentAgent, setCurrentAgent] = useState<AgentType>(
    projectId ? "project" : "search"
  );
  const [input, setInput] = useState("");

  const storageKey = projectId
    ? `archinsight_chat_${projectId}`
    : `archinsight_chat_search`;

  const { messages, sendMessage, setMessages, isMounted, clearChat } =
    usePersistentChat({
      storageKey,
      agentApi: `/api/chat/${currentAgent}`,
    });

  // reverse scan to find the last tool-search_projects
  useEffect(() => {
    if (!onProjectsUpdate || messages.length === 0) return;

    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (!m.parts) continue;

      const toolPart = m.parts.find(
        (p: any) =>
          p.type === "tool-search_projects" || p.toolName === "search_projects"
      );

      if (toolPart) {
        const pObj = toolPart as any;
        const projects = pObj.output;
        if (projects && projects.length > 0) {
          onProjectsUpdate(projects);
          break;
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
      else if (trigger === "@case" && availableAgents.includes("case"))
        newAgent = "case";

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
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">
          AI Architecture Assistant
        </h2>

        <div className="flex items-center gap-3">
          <AgentSwitcher
            availableAgents={availableAgents}
            currentAgent={currentAgent}
            onChange={setCurrentAgent}
          />

          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to clear this chat history?"
                )
              ) {
                clearChat();
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
            <SpinnerIcon className="h-5 w-5 mr-2" />
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
                {m.parts?.map((part, i) => (
                  <MessagePartRenderer
                    key={i}
                    part={part as MessagePart}
                    index={i}
                  />
                ))}
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
