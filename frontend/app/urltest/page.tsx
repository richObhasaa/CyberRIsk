"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <h1 style={{ margin: 0 }}>NIST Web Audit</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <span style={{ fontSize: 14, color: "#64748b" }}>{userEmail}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Logout
          </button>
        </div>
      </div>

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