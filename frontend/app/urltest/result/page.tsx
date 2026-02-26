"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout, getAccessToken } from "../../lib/auth";
import ResultUI from "./resultUi";
import { decodeEmail } from "../../lib/resultUtilsweb";
import { exportAuditPDF } from "@/app/lib/pdf";

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("auditResult");
    if (stored) {
      setData(JSON.parse(stored));
    }

    const token = getAccessToken();
    setEmail(decodeEmail(token));
  }, []);

  if (!data) {
    return <div style={{ padding: 40 }}>No audit data found.</div>;
  }

  return (
    <ResultUI
      data={data}
      email={email}
      onBack={() => router.push("/urltest")}
      onLogout={() => {
        logout();
        router.push("/auth");
      }}
    />
  );
}