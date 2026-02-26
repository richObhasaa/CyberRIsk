"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getAccessToken, logout } from "../lib/auth";
import ProtectedRoute from "../components/ProtectedRoute";
import { useNavbar } from "../context/NavbarContext";

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const { setMode } = useNavbar();

  useEffect(() => {
    setMode("short");
    return () => setMode(null);
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) { router.replace("/auth"); return; }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.email) setUserEmail(payload.email);
    } catch {
      router.replace("/auth");
    }
  }, [router]);

  const handleSubmit = async () => {
    if (!url) { setError("URL is required"); return; }
    try {
      setLoading(true);
      setError("");
      const token = getAccessToken();
      if (!token) throw new Error("Not authenticated");
      const res = await axios.post(
        "http://localhost:4000/api/url/audit",
        { url },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("auditResult", JSON.stringify(res.data));
      window.location.href = "/check-url/result";
    } catch (err: any) {
      setError("Backend error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="mt-20">
        <span>{userEmail}</span>
        <button onClick={() => { window.location.href = '/logout' }}>Logout</button>
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Scanning..." : "Run Audit"}
        </button>
        {error && <p>{error}</p>}
      </div>
    </ProtectedRoute>

  );
}