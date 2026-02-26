"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getAccessToken, getEmail } from "../lib/auth";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRequireAuth } from "../lib/useRequireAuth";
import ContentSection from "../layouts/ContentSection";
import { TextInput } from "../components/formComponents";
import LoggedInAsBar from "../components/LoggedInAsBar";

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const { loading: isLoading } = useRequireAuth();

  const [data, setData] = useState({
    url: "",
  })

  useEffect(() => {
    const email = getEmail();
    if (email) setUserEmail(email);
  }, []);

  const handleSubmit = async () => {
    if (!data.url) { setError("URL is required"); return; }
    try {
      setLoading(true);
      setError("");
      const token = getAccessToken();
      if (!token) throw new Error("Not authenticated");
      const res = await axios.post(
        "http://localhost:4000/api/url/audit",
        { url: data.url },
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

  if (isLoading) return null;

  return (
    <ProtectedRoute>
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center fade-in">

        <ContentSection
          title="URL Checker"
          subtitle="Check your website security"
          children={
            <>
              <TextInput
                label="Enter your URL Here"
                placeholder="https://example.com"
                value={data.url}
                onChange={(value) => setData({ ...data, url: value })}
                className="min-w-[300px] py-2"
              />
              <button onClick={handleSubmit} disabled={loading} className="mt-5 w-full bg-white hover:bg-gray-200 text-black font-bold py-3 text-sm rounded-xl 
              transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] mt-3 active:scale-95 disabled:opacity-50">
                {loading ? "Scanning..." : "Run Audit"}
              </button>
            </>
          }
        />

        {error && <p className="text-white mt-5">{error}</p>}

        <div className="hidden md:block absolute pointer-events-none inset-x-0 bottom-0 h-100 bg-gradient-to-t from-[#B19EEF]/50 to-transparent" />
        <div className="hidden md:block absolute pointer-events-none inset-y-0 left-0 w-100 bg-gradient-to-r from-black to-transparent" />
        <div className="hidden md:block absolute pointer-events-none inset-y-0 right-0 w-100 bg-gradient-to-l from-black to-transparent" />
      </div>
      <LoggedInAsBar userEmail={userEmail} />
    </ProtectedRoute>

  );
}