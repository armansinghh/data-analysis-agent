"use client";

import { useEffect, useState } from "react";

const WORD_MS = 40;

export default function StreamingText({ text }: { text: string }) {
  const words = text.split(" ");
  const [count, setCount] = useState(0);
  const done = count >= words.length;

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setCount((c) => c + 1), WORD_MS);
    return () => clearTimeout(t);
  }, [count, done]);

  return (
    <p className="text-sm leading-relaxed text-primary">
      {words.slice(0, count).map((w, i) => (
        <span key={i} className="word-in">
          {w}{" "}
        </span>
      ))}
      {!done && <span className="caret" />}
    </p>
  );
}