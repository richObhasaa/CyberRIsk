"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("result");
    if (data) setResult(JSON.parse(data));
  }, []);

  if (!result) return <div>No Data</div>;

  return (
    <div>
      <h2>Score: {result.score}</h2>
      <ul>
        {result.findings.map((f, i) => (
          <li key={i}>
            {f.type} - {f.function} ({f.category})
          </li>
        ))}
      </ul>
    </div>
  );
}