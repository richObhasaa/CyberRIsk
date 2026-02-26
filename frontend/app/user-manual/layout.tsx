"use client";

import ManualSidebar from "./components/Sidebar";

export default function UserManualLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top spacing (kalau ada navbar global) */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        <div className="flex gap-10">
          {/* Sidebar */}
          <ManualSidebar />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}