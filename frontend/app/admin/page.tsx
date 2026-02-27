"use client";

import { useNavbar } from "../context/NavbarContext";
import { useEffect, useState } from "react";
import StatsSection from "../layouts/StatsSection";
import ListLayout from "../layouts/ListLayout";
import { getDemoStats, getDemoUsers } from "../lib/demoAPI";
import { getEmail } from "../lib/auth";

export default function AdminMainPage() {

    const { setMode } = useNavbar();

    const [stats, setStats] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMode("hidden");
        return () => setMode(null);
    }, []);

    useEffect(() => {
        async function load() {
            try {
                const [statsRes, usersRes] = await Promise.all([
                    getDemoStats(),
                    getDemoUsers()
                ]);

                setStats([
                    {
                        label: "Users",
                        value: statsRes.total_users || 0,
                        description: "Total registered users",
                    },
                    {
                        label: "Organizations",
                        value: statsRes.total_organizations || 0,
                        description: "Registered organizations",
                    },
                    {
                        label: "Assessments",
                        value: statsRes.total_assessments || 0,
                        description: "Total assessments created",
                    },
                    {
                        label: "Auditors",
                        value: statsRes.total_auditors || 0,
                        description: "Active auditors",
                    },
                ]);

                const formattedHistory = (usersRes || []).map((u: any) => ({
                    title: u.email || "Unknown User",
                    description: `Role: ${u.user_metadata?.role || "user"} • ${u.confirmed_at ? "Verified" : "Unverified"}`,
                }));

                setHistory(formattedHistory);

            } catch (err) {
                console.error("Admin load error:", err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center h-screen bg-black text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-8 pt-10 h-max bg-black text-white font-bold overflow-y-auto">

            <div className="relative flex flex-col justify-center px-25">
                <p className="text-4xl font-bold">
                    Hello {getEmail() || "Admin"}
                </p>
                <p className="text-[#B19EEF] font-bold uppercase tracking-widest text-xs mt-2">
                    System overview & governance panel
                </p>
            </div>

            <div className="px-25">
                <StatsSection stats={stats} />
            </div>

            <div className="px-25 pb-20">
                <ListLayout
                    items={history}
                    title="Registered Users"
                    subtitle="All users in the system"
                />
            </div>
        </div>
    );
}