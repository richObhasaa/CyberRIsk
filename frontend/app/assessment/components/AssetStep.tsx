"use client";

import { useState } from "react";
import { Container, Button } from "./UI";
import { addAsset } from "../../lib/api";
import { TextInput, SelectInput } from "@/app/components/formComponents";

export default function AssetStep({
  assessmentId,
  nextStep,
  prevStep,
}: any) {
  const [assets, setAssets] = useState<any[]>([]);

  const [form, setForm] = useState({
    asset_name: "",
    owner: "",
    location: "",
    asset_type: "Application",
    cia_level: "Medium",
  });

  async function handleAddAsset() {
    if (!assessmentId) {
      alert("Assessment not found");
      return;
    }

    if (!form.asset_name) {
      alert("Asset name required");
      return;
    }

    try {
      const res = await addAsset({
        assessment_id: assessmentId,
        ...form,
      });

      if (res?.success) {
        setAssets([...assets, res.asset]);
        setForm({
          asset_name: "",
          owner: "",
          location: "",
          asset_type: "Application",
          cia_level: "Medium",
        });
      }
    } catch (err) {
      alert("Error adding asset" + err);
    }
  }

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white">Step 3 — Assets</h2>


        <TextInput
          label="Asset Name"
          placeholder="e.g. Web Application"
          value={form.asset_name}
          onChange={(value) => setForm({ ...form, asset_name: value })}
        />

        <TextInput
          label="Owner"
          placeholder="e.g. IT Department"
          value={form.owner}
          onChange={(value) => setForm({ ...form, owner: value })}
        />

        <TextInput
          label="Location"
          placeholder="e.g. On-premise / Cloud"
          value={form.location}
          onChange={(value) => setForm({ ...form, location: value })}
        />

        <SelectInput
          label="Asset Type"
          value={form.asset_type}
          onChange={(value) => setForm({ ...form, asset_type: value })}
          options={[
            { label: "Select Asset Type", value: "" },
            { label: "Application", value: "Application" },
            { label: "Server", value: "Server" },
            { label: "Database", value: "Database" },
            { label: "Network", value: "Network" },
            { label: "Endpoint", value: "Endpoint" },
          ]}
        />

        <SelectInput
          label="CIA Level"
          value={form.cia_level}
          onChange={(value) => setForm({ ...form, cia_level: value })}
          options={[
            { label: "Low", value: "Low" },
            { label: "Medium", value: "Medium" },
            { label: "High", value: "High" },
          ]}
        />

        <Button onClick={handleAddAsset}>+ Add Asset</Button>

        {assets.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {assets.map((asset, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-[#B19EEF]/20 text-[#B19EEF] border border-[#B19EEF]/30 rounded-lg px-2 py-0.5 text-xs font-bold">
                    {asset.asset_type}
                  </span>
                  <span className="text-sm text-white font-medium">{asset.asset_name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{asset.owner}</span>
                  <span>{asset.location}</span>
                  <span className="text-[#B19EEF]">{asset.cia_level}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-400 mt-4">
          Assets registered: <span className="text-white font-semibold">{assets.length}</span>
        </p>

        <div className="flex gap-3 mt-4">
          {prevStep && <Button onClick={prevStep}>← Back</Button>}
          <Button onClick={nextStep}>Continue →</Button>
        </div>
      </div>
    </Container>
  );
}