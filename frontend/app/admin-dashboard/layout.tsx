"use client";

import ChatbotInterface from "../components/ChatbotInterface";
import ProtectedRoute from "../components/ProtectedRoute";
import { useNavbar } from "../context/NavbarContext";
import { useEffect } from "react";

function AdminLayout({ children }: { children: React.ReactNode }) {

    const { setMode } = useNavbar();

    useEffect(() => {
        setMode("short");
        return () => setMode(null);
    }, []);

    return (
        <>
            <div className="h-screen w-full flex flex-row overflow-hidden text-white font-bold">
                <div className="w-1/5 h-full bg-black border border-white/[0.2] bg-white/[0.05] rounded-r-2xl py-4 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                    <div className="flex flex-col gap-5 p-10">
                        <div className="flex flex-row items-center gap-2">
                            <img src="/vercel.svg" alt="Logo" className="w-7 h-auto" />
                            <span className="text-xl font-bold">CyberRIsk</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <a href="/admin-dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Dashboard
                            </a>
                            <a href="/admin-dashboard/users" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Users
                            </a>
                            <a href="/admin-dashboard/forms" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Forms
                            </a>
                            <a href="/admin/questions" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Questions
                            </a>
                            <a href="/admin/answers" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Answers
                            </a>
                            <a href="/logout" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Logout
                            </a>
                        </div>
                    </div>
                </div>
                <div className="w-4/5 flex flex-col gap-5 h-full bg-black border border-white/[0.2] bg-white/[0.05] rounded-l-2xl overflow-y-auto">
                    {children}
                </div>
            </div>
            <ChatbotInterface />
        </>
    );
}

export default function AdminPage({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <AdminLayout>
                {children}
            </AdminLayout>
        </ProtectedRoute>
    );
}