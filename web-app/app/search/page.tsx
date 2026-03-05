"use client";

import { useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  async function search() {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    console.log(data);
    setResults(data);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Architecture Search</h1>

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Search architecture..."
        />

        <button onClick={search} className="bg-black text-white px-4">
          Search
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {results.map((r) => (
          <Link key={r.id} href={`/project/${r.id}`}>
            <div className="border p-4 hover:bg-gray-50">
              <h2 className="font-bold text-lg">{r.title}</h2>

              <p className="text-sm text-gray-500">
                {r.architect} — {r.year}
              </p>

              <p className="mt-2 text-sm">{r.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
