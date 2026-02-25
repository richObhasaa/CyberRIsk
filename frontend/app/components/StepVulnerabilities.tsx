import { WizardData } from "./RiskWizard";

const GROUPS = [
  {
    title: "Injection",
    items: [
      { value: "sql_injection", label: "SQL Injection" },
    ],
  },
  {
    title: "Cross-Site Attacks",
    items: [
      { value: "xss", label: "Cross-Site Scripting (XSS)" },
      { value: "csrf", label: "CSRF" },
    ],
  },
  {
    title: "Authentication",
    items: [
      { value: "weak_password", label: "Weak Password Policy" },
    ],
  },
  {
    title: "Software / Server",
    items: [
      { value: "outdated_server", label: "Outdated Server" },
    ],
  },
];

export default function StepVulnerabilities({
  data,
  updateData,
}: {
  data: WizardData;
  updateData: (patch: Partial<WizardData>) => void;
}) {
  const toggleVuln = (value: string) => {
  const current = data.vulnerabilities ?? [];

  const updated = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];

  updateData({ vulnerabilities: updated });
};

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        Select detected or suspected vulnerabilities
      </h3>

      <p className="text-xs text-gray-500">
  Select all vulnerabilities that are detected or suspected on the selected assets.
</p>

      {GROUPS.map((group) => (
        <div key={group.title} className="space-y-2">
          <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            {group.title}
          </div>

          {group.items.map((opt) => (
            <label
              key={opt.value}
              className="flex gap-3 items-center rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={data.vulnerabilities?.includes(opt.value) ?? false}
                onChange={() => toggleVuln(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}