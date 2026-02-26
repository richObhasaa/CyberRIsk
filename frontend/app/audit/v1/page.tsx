"use client";

import { useState, useEffect } from "react";
import ContentSection from "../../layouts/ContentSection";
import { RangeInput, SelectInput, TextInput, BigTextInput, EmailInput } from "../../components/formComponents";
import {
    getMyOrganizations,
    createOrganization,
    getQuestions,
    createAssessment,
    submitSubcategory,
} from "../../lib/api";

export default function FormPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        companyName: "",
        companyEmail: "",
        test: 0,
    });

    // const [organizations, setOrganizations] = useState<any[]>([]);
    // const [selectedOrg, setSelectedOrg] = useState<any>(null);
    // const [assessmentId, setAssessmentId] = useState<string | null>(null);

    // useEffect(() => {
    //     async function load() {
    //         const res = await getMyOrganizations();
    //         setOrganizations(res?.organizations || []);
    //     }
    //     load();
    // }, []);

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
                <form action="" method="post" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col w-full max-w-7xl mx-auto py-10 gap-5 md:gap-15 border-b-2 border-white/10">
                        <div className="flex justify-center text-center">
                            <p className="text-2xl font-bold">User Requirements</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 sm:px-12 lg:px-24">
                            <TextInput
                                label="User's Full Name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                            />
                            <EmailInput
                                label="User's Email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                            />
                            <TextInput
                                label="Company / Organization Name"
                                placeholder="Enter your company / organization name"
                                value={formData.companyName}
                                onChange={(value) => setFormData(prev => ({ ...prev, companyName: value }))}
                            />
                            <EmailInput
                                label="Compant / Organization Email"
                                placeholder="Enter your company / organization name"
                                value={formData.companyEmail}
                                onChange={(value) => setFormData(prev => ({ ...prev, companyEmail: value }))}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col w-full max-w-7xl mx-auto py-10 gap-5 md:gap-15 border-b-2 border-white/10">
                        <div className="flex justify-center text-center">
                            <p className="text-2xl font-bold">User Requirements</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 sm:px-12 lg:px-24">
                            <RangeInput
                                label="Test Range Input"
                                value={formData.test}
                                onChange={(value) => setFormData(prev => ({ ...prev, test: value }))}
                                min={1}
                                max={5}
                                labels={["None", "Low", "Medium", "High", "Critical"]}
                            />

                        </div>
                    </div>
                    <div className="flex justify-center px-6 sm:px-12 lg:px-24">
                        <button className="mt-10 w-full max-w-[300px] bg-white border border-transparent 
                        hover:border-white/50 hover:bg-transparent text-black hover:text-white 
                        font-bold py-3 rounded-2xl transition-all duration-300 
                        shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer">Submit</button>
                    </div>
                </form>
            </div>
        </>
    );
}
