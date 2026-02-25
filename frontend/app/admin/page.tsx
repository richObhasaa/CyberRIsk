"use client";

import { useNavbar } from "@/app/context/NavbarContext";
import { useEffect } from "react";
import StatsSection from "../layouts/StatsSection";
import ListLayout from "../layouts/ListLayout";

export default function AdminMainPage() {

    const { setMode } = useNavbar();

    useEffect(() => {
        setMode("hidden");
        return () => setMode(null);
    }, []);

    return (
        <>
            <div className="w-full flex flex-col gap-5 pt-10 h-max bg-black border border-transparent text-white font-bold overflow-y-auto">
                <div className="relative flex flex-col justify-center px-25">
                    <p className="text-4xl text-white font-bold align-center">Hello xxx</p>
                    <p className="text-[#B19EEF] font-bold uppercase tracking-widest text-xs fade-in mt-1">Welcome to your admin dashboard</p>
                </div>
                <StatsSection stats={[
                    { label: "Users", value: "100", description: "Total users" },
                    { label: "Forms", value: "100", description: "Total forms" },
                    { label: "Questions", value: "100", description: "Total questions" },
                    { label: "Answers", value: "100", description: "Total answers" },
                ]} />
                <ListLayout items={[
                    { title: "User 1", description: "User 1 description" },
                    { title: "User 2", description: "User 2 description" },
                    { title: "User 3", description: "User 3 description" },
                    { title: "User 4", description: "User 4 description" },
                    { title: "User 5", description: "User 5 description" },
                ]} title="History" subtitle="View the submitted reports here" />
            </div>
        </>
    );
}