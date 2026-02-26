"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../lib/auth";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        logout();
        router.push("/auth");
    }, [router]);

    return (
        <div style={{ padding: 40 }}>
            <h1>Logging out...</h1>
        </div>
    );
}