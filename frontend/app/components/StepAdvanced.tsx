import { WizardData } from "./RiskWizard";

export default function StepAdvanced({
  data,
  updateData,
}: {
  data: WizardData;
  updateData: (patch: Partial<WizardData>) => void;
}) {
  const updateRisk = (field: string, value: number) => {
    updateData({
      risks: {
        ...data.risks,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">
        Advanced Risk Overrides (Technical Users)
      </h3>

      <div>
        <label>Control Effectiveness (%)</label>
        <input
          type="number"
          min={0}
          max={100}
          value={data.risks.controlEffectiveness ?? 0}
          onChange={(e) =>
            updateRisk("controlEffectiveness", Number(e.target.value))
          }
        />
      </div>

      <p className="text-sm text-gray-500">
        Leave default to let the system automatically calculate risk.
      </p>
    </div>
  );
}