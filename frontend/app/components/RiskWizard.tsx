"use client";

import { useState } from "react";
import StepOrganization from "./StepOrganization";
import StepAssets from "./StepAssets";
import StepVulnerabilities from "./StepVulnerabilities";
import StepAdvanced from "./StepAdvanced";
import StepReview from "./StepReview";
import StepAuditChecklist from "./StepAuditChecklist";

export type AssetItem = {
  name: string;
  owner: string;
  location: string;
  type: string;
  ciaValue: "Low" | "Medium" | "High";
};

export type ControlStatus =
  | "Compliant"
  | "Partial"
  | "Non-Compliant"
  | "Not Applicable";

export type ChecklistItem = {
  id: string;
  control: string;
  status: ControlStatus;
  evidence?: string;
};

export type WizardData = {
  organizationName: string;
  sector: string;
  employeeRange?: "1-50" | "51-200" | "201-1000" | "1000+";
  systemType: string;

  assets: AssetItem[];
  vulnerabilities: string[];
  risks: any;

  auditChecklist?: ChecklistItem[];
};

export default function RiskWizard({
  mode = "technical",
}: {
  mode?: "technical" | "basic";
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const [data, setData] = useState<WizardData>({
    organizationName: "",
    sector: "",
    employeeRange: undefined,
    systemType: "",
    assets: [],
    vulnerabilities: [],
    risks: {},
    auditChecklist: [],
  });

  const steps =
    mode === "technical"
      ? [
          "Organization",
          "Assets",
          "Vulnerabilities",
          "Advanced",
          "Audit",
          "Review",
        ]
      : ["Organization", "Assets", "Vulnerabilities", "Audit", "Review"];

  const next = () =>
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const updateData = (patch: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </p>
          <h1 className="text-2xl font-bold text-white">
            {steps[currentStep]}
          </h1>
        </div>

        {/* STEP CONTENT */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
          {currentStep === 0 && (
            <StepOrganization data={data} updateData={updateData} />
          )}

          {currentStep === 1 && (
            <StepAssets data={data} updateData={updateData} />
          )}

          {currentStep === 2 && (
            <StepVulnerabilities data={data} updateData={updateData} />
          )}

          {steps[currentStep] === "Advanced" && (
            <StepAdvanced data={data} updateData={updateData} />
          )}

          {steps[currentStep] === "Audit" && (
            <StepAuditChecklist data={data} updateData={updateData} />
          )}

          {steps[currentStep] === "Review" && (
            <StepReview data={data} updateData={updateData} />
          )}
        </div>

        {/* NAVIGATION */}
        <div className="flex justify-between mt-8">
          <button
            onClick={back}
            disabled={currentStep === 0}
            className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 disabled:opacity-40"
          >
            Back
          </button>

          <button
            onClick={next}
            disabled={
              currentStep === 0 &&
              (!data.organizationName || !data.sector)
            }
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-40"
          >
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}