"use client";

import { useEffect, useState } from "react";
import {
  getMyOrganizations,
  createOrganization,
  getQuestions,
  createAssessment,
  submitSubcategory,
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
  const [loading, setLoading] = useState(false);

  const [period, setPeriod] = useState({ start: "", end: "" });
  const [orgMeta, setOrgMeta] = useState({ business_sector: "", employee_range: "" });

  const [riskProfile, setRiskProfile] = useState({
    operational_likelihood: 3,
    operational_impact: 3,
  });

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

    async function load() {
      setLoading(true);
      const res = await getQuestions(role);
      setQuestions(res?.questions || []);
      setLoading(false);
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

  if (step === 4 && role === "IT")
    return (
      <RiskProfileStep
        selectedOrg={selectedOrg}
        riskProfile={riskProfile}
        setRiskProfile={setRiskProfile}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    );

  if (step === 4 && role === "NON_IT") {
    setStep(5);
    return null;
  }

  if (step === 5)
    return (
      <QuestionsStep
        questions={questions}
        loading={loading}
        riskProfile={riskProfile}
        submitSubcategory={submitSubcategory}
        assessmentId={assessmentId}
        prevStep={prevStep}
      />
    );

  return null;
}