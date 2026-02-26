"use client";

import { useRequireAuth } from "../lib/useRequireAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { loading } = useRequireAuth();

    if (loading) return null;

    return <>{children}</>;
}