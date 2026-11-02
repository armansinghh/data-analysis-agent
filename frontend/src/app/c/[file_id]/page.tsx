"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import TopBar from "@/components/TopBar";
import PromptBar from "@/components/PromptBar";
import LoadingState from "@/components/LoadingState";
import StreamingText from "@/components/StreamingText";

type Message = { role: "user" | "assistant"; text: string; chart?: string };

function Chat() {
  const { file_id } = useParams<{ file_id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(question: string) {
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/query/${file_id}?question=${encodeURIComponent(question)}`,
        { method: "POST" }
      );
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer ?? data.detail ?? "Something went wrong.",
          chart: data.chart,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Can't reach the backend. Is it running?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TopBar filename={file_id.slice(0, 8)} />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-6 px-0 py-6">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] rounded-lg bg-elevated px-4 py-2 text-sm">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={i}>
                <StreamingText text={m.text} />
                {m.chart && (
                  <img
                    src={`data:image/png;base64,${m.chart}`}
                    alt="chart"
                    className="mt-4 rounded-lg border border-subtle bg-surface p-4"
                  />
                )}
              </div>
            )
          )}
          {loading && <LoadingState surfer />}
          <div ref={endRef} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pb-6">
        <PromptBar onSend={handleSend} disabled={loading} />
      </div>
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Chat />
    </Suspense>
  );
}