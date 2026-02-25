"use client";

import { WizardData } from "./RiskWizard";

export default function StepAuditChecklist({
  data,
  updateData,
}: {
  data: WizardData;
  updateData: (patch: Partial<WizardData>) => void;
}) {
  // ✅ EMPTY STATE (professional)
  if (!data.auditChecklist?.length) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-center">
        <p className="text-gray-300 font-medium">
          Audit checklist will appear after risk assessment.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Please proceed to the Review step and run the assessment.
        </p>
      </div>
    );
  }

  // ✅ SAFE UPDATE (NO EXTRA FIELDS)
  const updateItem = (id: string, patch: any) => {
    const updated = data.auditChecklist!.map((item) =>
      item.id === id ? { ...item, ...patch } : item
    );

    updateData({ auditChecklist: updated });
  };

  // ✅ UPLOAD
  const uploadEvidence = async (id: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        "http://localhost:4000/api/upload/evidence",
        {
          method: "POST",
          body: formData,
        }
      );

      const json = await res.json();

      updateItem(id, { evidence: json.url });
    } catch (err) {
      console.error("Evidence upload failed:", err);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Audit Checklist</h3>

     {data.auditChecklist?.map((item) => (
  <div
    key={item.id}
    className="border rounded p-4 space-y-2"
  >
    {/* CONTROL TEXT */}
    <div className="font-medium">{item.control}</div>

    {/* STATUS SELECT */}
    <select
      value={item.status}
      onChange={(e) =>
  updateItem(item.id, { status: e.target.value })
}
      className="bg-slate-800 border rounded px-2 py-1 text-sm"
    >
      <option>Compliant</option>
      <option>Partial</option>
      <option>Non-Compliant</option>
      <option>Not Applicable</option>
    </select>

    {/* 🔥 EVIDENCE UPLOAD — TAMBAH INI */}
    <input
  type="file"
  accept=".png,.jpg,.jpeg,.pdf"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) uploadEvidence(item.id, file);
  }}
  className="text-xs"
/>

<div className="text-[11px] text-gray-500">
  Upload evidence (screenshot, policy, config export)
</div>

    {/* OPTIONAL — tampilkan nama file */}
    {item.evidence && (
      <div className="text-xs text-emerald-400">
        Evidence: {item.evidence}
      </div>
    )}
  </div>
))}
    </div>
  );
}