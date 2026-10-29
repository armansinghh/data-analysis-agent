"use client";

import { Suspense, useState } from "react";
import { useParams } from "next/navigation";

type Message = { role: "user" | "assistant"; text: string };

function Chat() {
  const { file_id } = useParams<{ file_id: string }>();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Upload done. Ask me anything about your data.",
    },
  ]);
  const [input, setInput] = useState("");

  async function handleSend() {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");

    const res = await fetch(
      `http://localhost:8000/query/${file_id}?question=${encodeURIComponent(input)}`,
      { method: "POST" },
    );
    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: JSON.stringify(data) },
    ]);
  }

  return (
    <main>
      <h1>Chat for file: {file_id}</h1>
      {messages.map((m, i) => (
        <p key={i}>
          <b>{m.role}:</b> {m.text}
        </p>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </main>
  );
}
``;

export default function ChatPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Chat />
    </Suspense>
  );
}
