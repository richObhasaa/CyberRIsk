"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "./supabaseClient";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      const isAuthPage = pathname.startsWith("/auth");

      if (!data.session && !isAuthPage) {
        router.replace("/auth");
      }

      if (data.session && isAuthPage) {
        router.replace("/");
      }

      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  return { loading };
}