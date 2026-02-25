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

export default function AssessmentPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"IT" | "NON_IT" | null>(null);

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [riskProfile, setRiskProfile] = useState({
    operational_likelihood: 3,
    operational_impact: 3,
  });

  /* LOAD ORGANIZATIONS */
  useEffect(() => {
    async function load() {
      const res = await getMyOrganizations();
      setOrganizations(res?.organizations || []);
    }
    load();
  }, []);

  /* LOAD QUESTIONS */
  useEffect(() => {
    if (step !== 4 || !role) return;

    async function load() {
      setLoading(true);
      const res = await getQuestions(role);
      setQuestions(res?.questions || []);
      setLoading(false);
    }

    load();
  }, [step, role]);

  /* HANDLE ORGANIZATION SELECT */
  async function handleOrganizationSelect(item: any) {
    // Supabase join format safety
    const org =
      item?.organizations ||
      item?.organization ||
      item;

    if (!org?.id) {
      console.error("Invalid organization object:", item);
      return;
    }

    if (!role) {
  alert("Role not selected.");
  return;
}

    setSelectedOrg(org);

    const res = await createAssessment({
      organization_id: org.id,
      assessment_type: role,
    });

    if (!res?.assessment?.id) {
      alert("Failed to create assessment.");
      return;
    }

    setAssessmentId(res.assessment.id);

    if (role === "IT") {
      setStep(3);
    } else {
      setStep(4);
    }
  }

  /* ROUTING */

  if (step === 1)
    return <RoleStep setRole={setRole} setStep={setStep} />;

  if (step === 2)
    return (
      <OrganizationStep
        organizations={organizations}
        onSelect={handleOrganizationSelect}
        createOrganization={createOrganization}
      />
    );

  if (step === 3 && role === "IT")
    return (
      <RiskProfileStep
        selectedOrg={selectedOrg}
        riskProfile={riskProfile}
        setRiskProfile={setRiskProfile}
        setStep={setStep}
      />
    );

  if (step === 4)
    return (
      <QuestionsStep
        questions={questions}
        loading={loading}
        riskProfile={riskProfile}
        submitSubcategory={submitSubcategory}
        assessmentId={assessmentId}
      />
    );

  return null;
}