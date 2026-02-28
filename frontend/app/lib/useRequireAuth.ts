"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAccessToken } from "./auth";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    const isAuthPage = pathname.startsWith("/auth");

    if (!token && !isAuthPage) {
      router.replace("/auth");
      // Don't setLoading(false) — keep blocking until navigation completes
      return;
    }

    if (token && isAuthPage) {
      router.replace("/");
      return;
    }

    // Only unblock rendering when we're certain: authenticated + correct page
    setLoading(false);
  }, [pathname]);

  return { loading };
}