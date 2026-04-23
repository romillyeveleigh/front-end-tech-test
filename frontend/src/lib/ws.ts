"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface WSFrame {
  token?: string;
  done?: boolean;
  error?: string;
}

function wsUrl(): string {
  return (
    process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws/assistant"
  );
}

export function useAssistantStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(wsUrl());
    socketRef.current = ws;

    ws.addEventListener("open", () => setConnected(true));
    ws.addEventListener("close", () => setConnected(false));
    ws.addEventListener("error", () => setConnected(false));

    ws.addEventListener("message", (event) => {
      let frame: WSFrame;
      try {
        frame = JSON.parse(event.data as string) as WSFrame;
      } catch {
        return;
      }
      if (frame.error) return;
      if (frame.token) {
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const last = prev[prev.length - 1];
          if (last.role !== "assistant") return prev;
          return [
            ...prev.slice(0, -1),
            { ...last, content: last.content + frame.token },
          ];
        });
      }
    });

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, []);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    const placeholder: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, userMsg, placeholder]);
    ws.send(JSON.stringify({ message: trimmed }));
  }, []);

  return { messages, send, connected };
}
