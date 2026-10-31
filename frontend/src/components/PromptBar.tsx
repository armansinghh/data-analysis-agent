"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { LuArrowUp } from "react-icons/lu";

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export default function PromptBar({
  onSend,
  disabled = false,
  placeholder = "Ask about your data...",
}: Props) {
  const [draft, setDraft] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const canSend = draft.trim().length > 0 && !disabled;

  // grow with content, up to about 5 lines
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    el.style.overflowY = el.scrollHeight > 120 ? "auto" : "hidden";
  }, [draft]);

  function send() {
    if (!canSend) return;
    onSend(draft.trim());
    setDraft("");
  }

  return (
    <div className="flex items-end gap-1.5 rounded-[14px] border border-subtle bg-surface p-1.5 transition-colors focus-within:border-muted">
      <textarea
        ref={ref}
        rows={1}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            send();
          }
        }}
        placeholder={placeholder}
        aria-label="Question"
        className="min-h-7 flex-1 resize-none bg-transparent px-2 py-1.25 text-[13px] leading-4.5 outline-none placeholder:text-muted"
      />
      <button
        type="button"
        aria-label="Send"
        disabled={!canSend}
        onClick={send}
        className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-canvas transition-[background-color,color,transform] duration-200 enabled:active:scale-95 disabled:bg-subtle disabled:text-muted"
      >
        <LuArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}