"use client";

import { useState } from "react";
import ContentSection from "../layouts/ContentSection";
import { RangeInput, SelectInput, TextInput, BigTextInput } from "../components/formComponents";

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
                            title="Security Audit Report Form"
                            subtitle="Upload your security audit report to get AI-powered insights."
                        />
                    </div>
                    {/* Bottom fade */}
                    <div className="hidden md:block absolute pointer-events-none inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#B19EEF] to-transparent" />
                    {/* Left fade */}
                    <div className="hidden md:block absolute pointer-events-none inset-y-0 left-0 w-60 bg-gradient-to-r from-black to-transparent" />
                    {/* Right fade */}
                    <div className="hidden md:block absolute pointer-events-none inset-y-0 right-0 w-60 bg-gradient-to-l from-black to-transparent" />
                </div>
                <div className="flex flex-col w-full max-w-7xl mx-auto py-10">
                    <form action="" method="post" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 px-6 sm:px-12 lg:px-24">
                            <TextInput
                                label="Full Name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                            />
                            <TextInput
                                label="Email Address"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                            />
                            <TextInput
                                label="Company / Organization"
                                placeholder="Enter your company name"
                                value={formData.company}
                                onChange={(value) => setFormData(prev => ({ ...prev, company: value }))}
                            />
                            <RangeInput
                                label="Risk Appetite"
                                value={formData.riskLevel}
                                onChange={(value) => setFormData(prev => ({ ...prev, riskLevel: value }))}
                            />
                            <BigTextInput
                                label="Security Audit Report"
                                placeholder="Upload your security audit report"
                                value={formData.report}
                                onChange={(value) => setFormData(prev => ({ ...prev, report: value }))}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
