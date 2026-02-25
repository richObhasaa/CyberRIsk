"use client";

import { useRequireAuth } from "./lib/useRequireAuth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useRequireAuth();

  return (
    <html lang="en">
      <body style={{ background: "#111", color: "white" }}>
        {loading ? "Checking authentication..." : children}
      </body>
    </html>
  );
}