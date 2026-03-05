"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function ChatPage() {
  const { messages, sendMessage } = useChat({ api: "/api/chat" });
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Architecture AI Chat</h1>

      <div className="space-y-4 mb-4">
        {messages.map((m) => (
          <div key={m.id}>
            <strong>{m.role}</strong>:{" "}
            {m.parts.map((p, i) =>
              p.type === "text" ? <span key={i}>{p.text}</span> : null
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Ask about architecture..."
        />

        <button className="bg-black text-white px-4 py-2">Send</button>
      </form>
    </div>
  );
}
