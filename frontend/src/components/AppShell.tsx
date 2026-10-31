"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";

const ToggleCtx = createContext<() => void>(() => {});
export const useToggleSidebar = () => useContext(ToggleCtx);

export default function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <ToggleCtx.Provider value={() => setOpen((o) => !o)}>
      <div className="flex h-screen bg-canvas text-primary">
        <Sidebar open={open} />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </ToggleCtx.Provider>
  );
}