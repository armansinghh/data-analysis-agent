"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LuUpload,
  LuFileSpreadsheet,
  LuCpu,
  LuArrowUpRight,
  LuTriangleAlert,
} from "react-icons/lu";

const SAMPLES = ["Attendance", "Marks", "Event survey"];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail ?? "Upload failed.");
        return;
      }
      router.push(`/c/${data.file_id}`);
    } catch {
      setError("Can't reach the backend. Is it running?");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-primary">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="flex items-center gap-2 rounded-md border border-verified/25 bg-verified/10 px-2.5 py-1 font-mono text-xs text-secondary">
          <span className="h-1.5 w-1.5 rounded-full bg-verified" />
          <LuCpu className="h-4 w-4" />
          Local Engine Active • 0B Egress
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Data Analysis Agent
          </h1>
          <p className="text-sm text-secondary">
            Upload a CSV and ask questions in plain English.
          </p>
        </div>

        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            setFile(e.dataTransfer.files[0] ?? null);
          }}
          className={`flex w-full cursor-pointer flex-col items-center gap-3 rounded-lg border border-dashed bg-surface px-6 py-10 text-center transition-colors hover:bg-elevated ${
            dragging ? "border-accent" : "border-subtle"
          }`}
        >
          {file ? (
            <LuFileSpreadsheet className="h-[18px] w-[18px] text-accent" />
          ) : (
            <LuUpload className="h-[18px] w-[18px] text-secondary" />
          )}
          <span className="font-mono text-xs text-secondary">
            {file ? file.name : "Drop a .csv here or click to browse"}
          </span>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full rounded-md bg-accent px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:bg-elevated disabled:text-muted disabled:hover:opacity-100"
        >
          {uploading ? "Uploading..." : "Analyze"}
        </button>

        {error && (
          <p className="flex items-center gap-2 text-sm text-flagged">
            <LuTriangleAlert className="h-4 w-4" />
            {error}
          </p>
        )}

        {/* quick-start pills: placeholders until we have sample CSVs */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {SAMPLES.map((name) => (
            <button
              key={name}
              disabled
              className="flex items-center gap-1.5 rounded-md border border-subtle bg-surface px-3 py-1.5 text-xs text-secondary transition-colors hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-60"
            >
              {name}
              <LuArrowUpRight className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}