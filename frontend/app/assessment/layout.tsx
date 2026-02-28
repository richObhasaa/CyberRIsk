import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AssessmentLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    );
}