"use client";

import { useEffect, useState } from "react";
import {
  getMyOrganizations,
  createOrganization,
  getQuestions,
  createAssessment,
  submitSubcategory,
  getCategories,
} from "../lib/api";

import RoleStep from "./components/RoleStep";
import OrganizationStep from "./components/OrganizationStep";
import RiskProfileStep from "./components/RiskProfileStep";
import QuestionsStep from "./components/QuestionsStep";
import AssetStep from "./components/AssetStep";

export default function AssessmentPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"IT" | "NON_IT" | null>(null);

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState({ start: "", end: "" });
  const [orgMeta, setOrgMeta] = useState({ business_sector: "", employee_range: "" });

  const [riskProfile, setRiskProfile] = useState({
    operational_likelihood: 3,
    operational_impact: 3,
  });

  const [categories, setCategories] = useState<any[]>([]);

  /* LOAD ORGANIZATIONS */
  useEffect(() => {
    async function load() {
      try {
        const res = await getMyOrganizations();
        setOrganizations(res?.organizations || []);
      } catch (err: any) {
        if (err.message === "No active session" || err.message === "Session expired") {
          window.location.href = "/auth";
        } else {
          console.error("Failed to load organizations:", err);
        }
      }
    }
    load();
  }, []);

  /* LOAD QUESTIONS — ONLY WHEN ENTERING STEP 5 */
  useEffect(() => {
    if (step !== 5 || !role) return;

    setLoading(true);

    async function load() {
      try {
        console.log("[ASSESSMENT] Fetching questions for role:", role);
        const [qRes, catRes] = await Promise.all([
          getQuestions(role!),
          role === "IT" ? getCategories() : Promise.resolve({ categories: [] }),
        ]);
        console.log("[ASSESSMENT] Questions count:", qRes?.questions?.length || 0);
        setQuestions(qRes?.questions || []);
        setCategories(catRes?.categories || []);
      } catch (err: any) {
        console.error("[ASSESSMENT] Failed to load questions:", err);
        setQuestions([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [step, role]);



  /* HANDLE ORG SELECT */
  async function handleOrganizationSelect(item: any) {
    const org = item?.organizations || item?.organization || item;

    if (!org?.id) return;
    if (!role) return alert("Role not selected.");

    if (!period.start || !period.end)
      return alert("Period start and end required.");

    try {
      const res = await createAssessment({
        organization_id: org.id,
        assessment_type: role,
        period_start: period.start,
        period_end: period.end,
      });

      if (!res?.assessment?.id)
        return alert("Failed to create assessment.");

      setSelectedOrg(org);
      setAssessmentId(res.assessment.id);
      setStep(3); // GO TO ASSET FIRST
    } catch (err: any) {
      alert(err.message || "Failed to create assessment.");
    }
  }

  /* STEP NAVIGATION HELPERS */

  function nextStep() {
    setStep((prev) => prev + 1);
  }

  function prevStep() {
    setStep((prev) => (prev > 1 ? prev - 1 : 1));
  }

  /* ROUTING */

  if (step === 1)
    return (
      <RoleStep
        setRole={setRole}
        setStep={setStep}
      />
    );

if (step === 2)
  return (
    <OrganizationStep
      organizations={organizations}
      onSelect={handleOrganizationSelect}
      createOrganization={createOrganization}
      period={period}
      setPeriod={setPeriod}
      orgMeta={orgMeta}
      setOrgMeta={setOrgMeta}
    />
  );

  if (step === 3)
    return (
      <AssetStep
        assessmentId={assessmentId}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    );

  if (step === 4)
    return (
      <RiskProfileStep
        selectedOrg={selectedOrg}
        riskProfile={riskProfile}
        setRiskProfile={setRiskProfile}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    );

  if (step === 5)
    return (
      <QuestionsStep
        questions={questions}
        loading={loading}
        riskProfile={riskProfile}
        submitSubcategory={submitSubcategory}
        assessmentId={assessmentId}
        prevStep={prevStep}
        role={role}
        categories={categories}
      />
    );

   return (
    <div className="h-max w-full flex flex-col overflow-hidden text-white">

      {/* HERO */}
      <div className="relative h-[50vh] w-full flex items-center justify-center fade-in">

        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-wide">
            NIST CSF Assessment
          </h1>

          <p className="mt-4 text-white/70">
            Cybersecurity Risk Evaluation Framework
          </p>

          <div className="mt-6">
            <span className="px-4 py-2 border border-[#B19EEF] rounded-full text-sm tracking-wider">
              Step {step} of 5
            </span>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="hidden md:block absolute pointer-events-none inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#B19EEF] to-transparent" />

        {/* Left fade */}
        <div className="hidden md:block absolute pointer-events-none inset-y-0 left-0 w-60 bg-gradient-to-r from-black to-transparent" />

        {/* Right fade */}
        <div className="hidden md:block absolute pointer-events-none inset-y-0 right-0 w-60 bg-gradient-to-l from-black to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="fade-in flex flex-col w-full max-w-7xl mx-auto px-8 md:px-20 py-16">

        <div className="bg-black/30 border border-white/10 rounded-2xl p-10 backdrop-blur-sm">
          {StepComponent}
        </div>

      </div>

    </div>
  );
}
