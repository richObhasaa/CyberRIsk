"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.push("/urltest");
      } else {
        router.push("/auth");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      fontSize: 18,
      color: "#64748b",
    }}>
      Loading...
    </div>
  );
}
