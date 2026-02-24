"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!url) {
      setError("URL is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:5000/api/url/audit",
        { url },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      localStorage.setItem("auditResult", JSON.stringify(res.data));
      window.location.href = "/urltest/result";

    } catch (err: any) {
      console.error(err);
      setError("Backend error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>NIST Web Audit</h1>

      <input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: 400, padding: 8 }}
      />

      <br /><br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Scanning..." : "Run Audit"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}