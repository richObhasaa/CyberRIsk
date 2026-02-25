import { WizardData, AssetItem } from "./RiskWizard";
import { useState } from "react";

export default function StepAssets({
  data,
  updateData,
}: {
  data: WizardData;
  updateData: (patch: Partial<WizardData>) => void;
}) {
  const [assetName, setAssetName] = useState("");
  const [assetOwner, setAssetOwner] = useState("");
  const [assetLocation, setAssetLocation] = useState("");
  const [assetType, setAssetType] = useState("Application");
  const [ciaValue, setCiaValue] =
    useState<"Low" | "Medium" | "High">("Medium");

  const addAsset = () => {
    if (!assetName) return;

    const newAsset: AssetItem = {
      name: assetName,
      owner: assetOwner || "Unknown",
      location: assetLocation || "Unknown",
      type: assetType,
      ciaValue,
    };

    updateData({
      assets: [...data.assets, newAsset],
    });

    setAssetName("");
  };

  const removeAsset = (index: number) => {
    const copy = [...data.assets];
    copy.splice(index, 1);
    updateData({ assets: copy });
  };

  return (
    <div className="space-y-4">
      <input
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2"
        placeholder="Asset Name"
        value={assetName}
        onChange={(e) => setAssetName(e.target.value)}
      />

      <input
  placeholder="Owner (e.g., IT Department)"
  value={assetOwner}
  onChange={(e) => setAssetOwner(e.target.value)}
  className="input"
/>

<input
  placeholder="Location (e.g., Cloud Server)"
  value={assetLocation}
  onChange={(e) => setAssetLocation(e.target.value)}
  className="input"
/>

      <div className="flex gap-3">
        <select
          className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2"
          value={assetType}
          onChange={(e) => setAssetType(e.target.value)}
        >
          <option>Application</option>
          <option>Server</option>
          <option>Data</option>
        </select>

        <select
          className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2"
          value={ciaValue}
          onChange={(e) => setCiaValue(e.target.value as any)}
        >
          <option value="Low">CIA Low</option>
          <option value="Medium">CIA Medium</option>
          <option value="High">CIA High</option>
        </select>
      </div>

      <div className="text-sm text-gray-400">
        Assets registered: {data.assets.length}
      </div>

      <button
        type="button"
        onClick={addAsset}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold"
      >
        + Add Asset
      </button>

      {/* LIST */}
      <div className="space-y-2">
        {data.assets.map((a, i) => (
          <div
            key={i}
            className="flex justify-between items-center rounded-xl border border-gray-800 bg-gray-900 px-4 py-3"
          >
            <span>
              {a.name} — {a.ciaValue}
            </span>
            <button
              onClick={() => removeAsset(i)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}