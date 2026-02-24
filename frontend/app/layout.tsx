"use client";

import { useRequireAuth } from "./lib/useRequireAuth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useRequireAuth();

  if (loading) {
    return (
      <html lang="en">
        <body style={{ background: "#111", color: "white" }}>
          Checking authentication...
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}