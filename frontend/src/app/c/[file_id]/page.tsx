"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";

function Chat() {
  const { file_id } = useParams<{ file_id: string }>();
  return <h1>Chat for file: {file_id}</h1>;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Chat />
    </Suspense>
  );
}