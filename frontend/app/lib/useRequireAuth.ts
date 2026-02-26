"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAccessToken } from "./auth";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getAccessToken();

      const isAuthPage =
        pathname.startsWith("/auth");

      // Tidak login dan bukan di auth page → paksa ke /auth
      if (!token && !isAuthPage) {
        router.replace("/auth");
        return;
      }

      // Sudah login tapi masih di auth page → redirect ke home
      if (token && isAuthPage) {
        router.replace("/");
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  return { loading };
}