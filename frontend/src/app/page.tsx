"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  async function handleUpload() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    router.push(`/c/${data.file_id}`);
    // console.log(data);
  }

  return (
    <main>
      <h1>Data Analysis Agent</h1>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>
      {file && <p>Selected: {file.name}</p>}
    </main>
  );
}
