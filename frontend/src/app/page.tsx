"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuUpload, LuFileSpreadsheet, LuCpu } from "react-icons/lu";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  async function handleUpload() {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    router.push(`/c/${data.file_id}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0A0A0C] px-4 text-[#F4F4F6]">
      <div className="flex items-center gap-2 font-mono text-xs text-[#9494A0]">
        <LuCpu className="h-4 w-4" />
        <span>Running Locally</span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">
        Data Analysis Agent
      </h1>
      <p className="-mt-3 text-sm text-[#9494A0]">
        Upload a CSV and ask questions in plain English.
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
          setFile(e.dataTransfer.files[0] ?? null);
        }}
        className={`flex w-full max-w-md cursor-pointer flex-col items-center gap-3 rounded-lg border border-dashed bg-[#121216] px-6 py-10 text-center transition-colors hover:bg-[#1A1A20] ${
          dragging ? "border-[#6366F1]" : "border-[#26262E]"
        }`}
      >
        {file ? (
          <LuFileSpreadsheet className="h-5 w-5 text-[#6366F1]" />
        ) : (
          <LuUpload className="h-5 w-5 text-[#9494A0]" />
        )}
        <span className="font-mono text-xs text-[#9494A0]">
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
        className="rounded-md bg-[#6366F1] px-5 py-2 text-sm font-medium text-white disabled:bg-[#1A1A20] disabled:text-[#5E5E6A]"
      >
        {uploading ? "Uploading..." : "Analyze"}
      </button>
    </main>
  );
}