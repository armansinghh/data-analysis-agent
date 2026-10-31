"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuUpload, LuFileSpreadsheet, LuTriangleAlert } from "react-icons/lu";
import TopBar from "@/components/TopBar";

export default function Home() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function upload(file: File | undefined) {
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
    <>
      <TopBar />
      <main className="flex flex-1 items-center justify-center overflow-y-auto px-4">
        <div className="w-full max-w-lg">
          <h1 className="text-xl font-semibold tracking-tight">
            Drop a CSV, ask it things
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Attendance, marks, survey data. Nothing leaves your laptop.
          </p>

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              upload(e.dataTransfer.files[0]);
            }}
            className={`mt-6 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed bg-surface px-5 py-8 transition-colors hover:bg-elevated ${
              dragging ? "border-accent" : "border-subtle"
            }`}
          >
            {uploading ? (
              <LuFileSpreadsheet className="h-4.5 w-4.5 text-accent" />
            ) : (
              <LuUpload className="h-4.5 w-4.5 text-secondary" />
            )}
            <span className="font-mono text-xs text-secondary">
              {uploading ? "Reading file..." : "Drop a .csv here or click to browse"}
            </span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              disabled={uploading}
              onChange={(e) => upload(e.target.files?.[0])}
            />
          </label>

          {error && (
            <p className="mt-3 flex items-center gap-2 text-sm text-flagged">
              <LuTriangleAlert className="h-4 w-4" />
              {error}
            </p>
          )}
        </div>
      </main>
    </>
  );
}