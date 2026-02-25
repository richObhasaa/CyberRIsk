"use client";

import { useEffect, useState } from "react";
import {
  getMyOrganizations,
  createOrganization,
  getQuestions,
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
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [riskProfile, setRiskProfile] = useState({
    operational_likelihood: 3,
    operational_impact: 3,
    financial_likelihood: 3,
    financial_impact: 3,
    compliance_likelihood: 3,
    compliance_impact: 3,
    reputation_likelihood: 3,
    reputation_impact: 3,
    strategic_likelihood: 3,
    strategic_impact: 3,
  });

  /* LOAD ORGANIZATIONS */
  useEffect(() => {
    async function load() {
      const res = await getMyOrganizations();
      setOrganizations(res.organizations || []);
    }
    load();
  }, []);

  /* LOAD QUESTIONS */
  useEffect(() => {
    if (step !== 4 || !role) return;

    async function load() {
      setLoading(true);
      const res = await getQuestions(role);
      setQuestions(res.questions || []);
      setLoading(false);
    }

    load();
  }, [step, role]);

  /* ROUTING STEP */
  if (step === 1)
    return <RoleStep setRole={setRole} setStep={setStep} />;

  if (step === 2)
    return (
      <OrganizationStep
        organizations={organizations}
        setSelectedOrg={setSelectedOrg}
        setStep={setStep}
        role={role}
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
        selectedOrg={selectedOrg}
        riskProfile={riskProfile}
        submitSubcategory={submitSubcategory}
      />
    );

  return null;
}