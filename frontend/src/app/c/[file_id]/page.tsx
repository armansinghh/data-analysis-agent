"use client";

import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import { LuCpu, LuFileSpreadsheet, LuArrowUp } from "react-icons/lu";

type Message = { role: "user" | "assistant"; text: string };

function Chat() {
  const { file_id } = useParams<{ file_id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  async function handleSend() {
    if (!input.trim()) return;
    const question = input;
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");

    const res = await fetch(
      `http://localhost:8000/query/${file_id}?question=${encodeURIComponent(question)}`,
      { method: "POST" }
    );
    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: JSON.stringify(data) },
    ]);
  }

  return (
    <div className="flex h-screen flex-col bg-[#0A0A0C] text-[#F4F4F6]">
      {/* top telemetry bar */}
      <header className="flex h-12 items-center justify-between border-b border-[#26262E] px-4">
        <div className="flex items-center gap-2 font-mono text-xs text-[#9494A0]">
          <LuFileSpreadsheet className="h-4 w-4" />
          <span>{file_id.slice(0, 8)}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-[#9494A0]">
          <LuCpu className="h-4 w-4" />
          <span>...js placeholder for now</span>
        </div>
      </header>

      {/* msgs */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] rounded-lg bg-[#1A1A20] px-4 py-2 text-sm">
                  {m.text}
                </div>
              </div>
            ) : (
              <div
                key={i}
                className="rounded-lg border border-[#26262E] bg-[#121216] p-5 text-sm leading-relaxed"
              >
                {m.text}
              </div>
            )
          )}
        </div>
      </div>

      {/* input bar */}
      <div className="mx-auto w-full max-w-2xl px-4 pb-6">
        <div className="flex items-center gap-2 rounded-lg border border-[#26262E] bg-[#1A1A20] px-3 py-2 focus-within:border-[#6366F1]">
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#5E5E6A]"
            placeholder="Ask about your data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="rounded-md bg-[#6366F1] p-1.5 text-white"
          >
            <LuArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Chat />
    </Suspense>
  );
}