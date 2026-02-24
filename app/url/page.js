"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");

  const handleSubmit = async () => {
    const res = await axios.post("http://localhost:5000/api/audit", { url });
    localStorage.setItem("result", JSON.stringify(res.data));
    window.location.href = "/dashboard";
  };

  return (
    <div>
      <h1>NIST URL Audit</h1>
      <input value={url} onChange={e => setUrl(e.target.value)} />
      <button onClick={handleSubmit}>Run Audit</button>
    </div>
  );
}