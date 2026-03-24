import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

interface UsePersistentChatOptions {
  storageKey: string;
  agentApi: string;
}

export function usePersistentChat({
  storageKey,
  agentApi,
}: UsePersistentChatOptions) {
  const [isMounted, setIsMounted] = useState(false);
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);

  const { messages, sendMessage, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: agentApi }),
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem(storageKey);
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        if (Array.isArray(parsed) && parsed.length > 0) {
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

  // Sync back to localStorage whenever messages update
  useEffect(() => {
    if (isMounted && loadedStorageKey === storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, isMounted, storageKey, loadedStorageKey]);

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(storageKey);
  };

  const uniqueMessages = [
    ...new Map(messages.map((m) => [m.id, m])).values(),
  ];

  return { messages: uniqueMessages, sendMessage, setMessages, isMounted, clearChat };
}
