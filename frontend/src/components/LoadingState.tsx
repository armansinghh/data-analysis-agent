"use client";

import { useEffect, useState } from "react";

const DELAYS = Array.from({ length: 9 }, (_, i) => {
  const r = Math.floor(i / 3);
  const c = i % 3;
  return (c + Math.abs(r - 1)) * 90;
});

function useElapsed() {
  const [ds, setDs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDs((d) => d + 1), 100);
    return () => clearInterval(t);
  }, []);
  const total = ds / 10;
  if (total < 60) return `${total.toFixed(1)}s`;
  return `${Math.floor(total / 60)}m ${(total % 60).toFixed(1)}s`;
}

export default function LoadingState({
  label,
  surfer = false,
  videoSrc = "https://95dnc2a95qgwt9ff.public.blob.vercel-storage.com/subway-surfers-min.mp4",
}: {
  label?: string;
  surfer?: boolean;
  videoSrc?: string;
}) {
  const elapsed = useElapsed();
  const [videoOk, setVideoOk] = useState(true);
  const text = label ?? (surfer ? "Executing" : "Thinking");

  return (
    <div role="status" className="flex w-fit flex-col items-start">
      <div className="flex items-center gap-2.5">
        <span aria-hidden className="grid shrink-0 grid-cols-[repeat(3,4px)] gap-[1.5px]">
          {DELAYS.map((delay, i) => (
            <span
              key={i}
              className="pixel size-1 rounded-full bg-primary opacity-15"
              style={{ animation: `pixel-on 650ms ease-in-out ${delay}ms infinite` }}
            />
          ))}
        </span>
        <span className="shimmer-text text-[13px] font-medium">{text}</span>
        <span className="font-mono text-xs tabular-nums text-muted">{elapsed}</span>
      </div>

      {surfer && (
        <div
          className="mt-2 aspect-video w-56 overflow-hidden rounded-lg border border-subtle bg-surface"
          style={{ animation: "pop-in 200ms ease-out both" }}
        >
          {videoOk ? (
            <video
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoOk(false)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-3 text-center font-mono text-[10px] text-muted">
              Video not found in /public
            </div>
          )}
        </div>
      )}
    </div>
  );
}