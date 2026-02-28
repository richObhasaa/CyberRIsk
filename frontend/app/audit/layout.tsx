import ProtectedRoute from "../components/ProtectedRoute";
import { useRequireAuth } from "../lib/useRequireAuth";

export default function AuditLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    );
}