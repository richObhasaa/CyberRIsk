import { WizardData } from "./RiskWizard";

export default function StepOrganization({
  data,
  updateData,
}: {
  data: WizardData;
  updateData: (patch: Partial<WizardData>) => void;
}) {
  return (
    <div className="space-y-4">
      <input
        placeholder="Organization Name"
        value={data.organizationName}
        onChange={(e) =>
          updateData({ organizationName: e.target.value })
        }
      />

      <input
        placeholder="Business Sector"
        value={data.sector}
        onChange={(e) => updateData({ sector: e.target.value })}
      />

      {/* ✅ employee RANGE (upgrade penting) */}
      <select
        value={data.employeeRange ?? ""}
        onChange={(e) =>
          updateData({ employeeRange:  e.target.value as WizardData["employeeRange"], })
        }
      >
        <option value="">Select Employee Size</option>
        <option value="1-50">1–50</option>
        <option value="51-200">51–200</option>
        <option value="201-1000">201–1000</option>
        <option value="1000+">1000+</option>
      </select>

      <select
  value={data.systemType}
  onChange={(e) =>
    updateData({
      systemType: e.target.value,
    })
  }
>
        <option value="">System Type</option>
        <option value="Web Application">Web</option>
        <option value="Mobile">Mobile</option>
        <option value="Internal Network">Internal</option>
        <option value="Cloud">Cloud</option>
      </select>
    </div>
  );
}