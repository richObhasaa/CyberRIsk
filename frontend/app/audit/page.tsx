"use client";

import { useState } from "react";
import ContentSection from "../layouts/ContentSection";
import TooltipButton from "../components/TooltipButton";

export default function FormPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        riskLevel: 45,
        report: ""
    });

    return (
        <>
            <div className="h-max w-full flex flex-col overflow-hidden">
                <div className="relative h-[50vh] w-full text-white fade-in flex items-center justify-center">
                    <div className="mt-15">
                        <ContentSection
                            title="Security Audit Report"
                            subtitle="Report your security compliance"
                            children={
                                <p className="px-4 py-3 bg-transparent rounded-full border border-[#B19EEF] text-white text-sm tracking-wider">Using NIST CSF Framework</p>
                            }
                        />
                    </div>
                </div>
                <div className="fade-in flex flex-col w-full max-w-7xl px-20 mx-auto pt-0 pb-5 gap-10">
                    <p className="text-center text-2xl font-bold">Choose the report type</p>
                    <div className="flex flex-row gap-10 justify-center">
                        <TooltipButton
                            href="/audit/v1"
                            label="IT/Technical Users"
                            title="IT / Technical Users"
                            description="For system administrators, developers, and IT staff who manage infrastructure and technical operations."
                        />
                        <TooltipButton
                            href="/audit/v2"
                            label="Non-Technical Users"
                            title="Non-Technical Users"
                            description="For general staff and business users with no technical background who use day-to-day applications."
                        />
                    </div>
                </div>
                {/* Bottom fade */}
                <div className="hidden md:block absolute pointer-events-none inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[#B19EEF] to-transparent" />
                {/* Left fade */}
                <div className="hidden md:block absolute pointer-events-none inset-y-0 left-0 w-80 bg-gradient-to-r from-black to-transparent" />
                {/* Right fade */}
                <div className="hidden md:block absolute pointer-events-none inset-y-0 right-0 w-80 bg-gradient-to-l from-black to-transparent" />
            </div>
        </>
    );
}
