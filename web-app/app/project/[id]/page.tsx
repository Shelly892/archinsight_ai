"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useState, use } from "react";
import Image from "next/image";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [project, setProject] = useState<any>(null);
  const { id } = use(params); //读取 Promise 的值. params是一个promise对象. 等同于await params. 但client component 不能写 await 在组件顶层，所以 React 提供：
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input }, { body: { projectId: id } });
    setInput("");
  };

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then(setProject);
  }, [id]);

  const { messages, sendMessage } = useChat({
    api: "/api/chat",
    body: {
      projectId: id,
    },
  });
  //调用POST /api/chat 发送这样一个数据结构
  // {
  //   "messages": [
  //     { "role": "user", "content": "hello" }
  //   ],
  //   "projectId": "123"
  // }

  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">{project.title}</h1>

      <p className="mt-2">
        {project.architect} — {project.year}
      </p>

      <p className="mt-4">{project.description}</p>
      <Image
        src={project.gallery[0]}
        alt="Project Image"
        width={500}
        height={500}
      />

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Ask AI about this project</h2>

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
            placeholder="Ask about the design..."
          />

          <button className="bg-black text-white px-4">Send</button>
        </form>
      </div>
    </div>
  );
}
