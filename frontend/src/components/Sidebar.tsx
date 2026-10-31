import Link from "next/link";
import {
  LuPlus,
  LuCpu,
  LuFileSpreadsheet,
  LuMessageSquare,
} from "react-icons/lu";
import type { ReactNode } from "react";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-2 pt-5">
      <h2 className="px-2 pb-1 text-xs font-medium text-muted">{title}</h2>
      {children}
    </section>
  );
}

function Placeholder({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-2 py-2 text-sm text-muted">
      {icon}
      {text}
    </div>
  );
}

export default function Sidebar({ open }: { open: boolean }) {
  return (
    <aside
      inert={!open}
      className={`shrink-0 overflow-hidden bg-surface transition-[width] duration-200 ${
        open ? "w-64 border-r border-subtle" : "w-0"
      }`}
    >
      {/* fixed inner width so content doesn't squish while the outer width animates */}
      <div className="flex h-full w-64 flex-col">
        <nav className="px-2 pt-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-secondary transition-colors hover:bg-elevated hover:text-primary"
          >
            <LuPlus className="h-4.5 w-4.5" />
            New analysis
          </Link>
        </nav>

        <div className="flex-1 overflow-y-auto">
          <Section title="Datasets">
            <Placeholder
              icon={<LuFileSpreadsheet className="h-4 w-4" />}
              text="No datasets yet"
            />
          </Section>

          <Section title="Recent chats">
            <Placeholder
              icon={<LuMessageSquare className="h-4 w-4" />}
              text="No chats yet"
            />
          </Section>
        </div>

        <div className="flex items-center gap-2 border-t border-subtle px-4 py-3 font-mono text-xs text-secondary">
          <LuCpu className="h-4 w-4" />
          Runs locally
        </div>
      </div>
    </aside>
  );
}
