"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "./lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = getAccessToken();

      if (token) {
        router.push("/urltest");
      } else {
        router.push("/auth");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: 18,
        color: "#64748b",
      }}
    >
      Loading...
    </div>
  );
}