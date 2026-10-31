"use client";

import Link from "next/link";
import {
  LuChevronRight,
  LuShare,
  LuFileSpreadsheet,
  LuPanelLeft,
} from "react-icons/lu";
import { useToggleSidebar } from "./AppShell";

type Props = { filename?: string; rows?: number; columns?: number };

export default function TopBar({ filename, rows, columns }: Props) {
  const toggleSidebar = useToggleSidebar();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-subtle bg-canvas px-4">
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="rounded-md p-1.5 text-secondary transition-colors hover:bg-elevated hover:text-primary"
        >
          <LuPanelLeft className="h-4.5 w-4.5" />
        </button>
        <Link
          href="/"
          className="text-secondary transition-colors hover:text-primary"
        >
          Data Analysis Agent
        </Link>
        {filename && (
          <>
            <LuChevronRight className="h-4 w-4 text-muted" />
            <div className="flex items-center gap-2 font-mono text-xs">
              <LuFileSpreadsheet className="h-4 w-4 text-secondary" />
              <span>{filename}</span>
              {rows && columns && (
                <span className="text-muted">
                  • {rows} rows × {columns} cols
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => {
          /* TODO */
        }}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-secondary transition-colors hover:bg-elevated hover:text-primary"
      >
        <LuShare className="h-4 w-4" />
        Share
      </button>
    </header>
  );
}
