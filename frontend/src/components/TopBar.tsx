import Link from "next/link";
import {
  LuChevronRight,
  LuShare,
  LuFileSpreadsheet,
  LuPanelLeft,
} from "react-icons/lu";

type Props = {
  filename: string;
  rows?: number;
  columns?: number;
  onToggleSidebar: () => void;
};

export default function TopBar({
  filename,
  rows,
  columns,
  onToggleSidebar,
}: Props) {
  return (
    <header className="flex h-12 items-center justify-between border-b border-subtle bg-canvas px-4">
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="rounded-md p-1.5 text-secondary transition-colors hover:bg-elevated hover:text-primary"
        >
          <LuPanelLeft className="h-[18px] w-[18px]" />
        </button>
        <Link
          href="/"
          className="text-secondary transition-colors hover:text-primary"
        >
          Data Analysis Agent
        </Link>
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
      </div>

      <div className="flex items-center gap-2 font-mono text-xs text-secondary">
        <LuShare className="h-4 w-4" />
        Share
      </div>
    </header>
  );
}
