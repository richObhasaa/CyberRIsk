"use client";

import { useState } from "react";
import { Container, Button, Input } from "./UI";
import { addAsset } from "../../lib/api";

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
      alert("Error adding asset");
    }
  }

  return (
    <Container>
      <h2>Step 3 — Assets</h2>

      <Input
        placeholder="Asset Name"
        value={form.asset_name}
        onChange={(e: any) =>
          setForm({ ...form, asset_name: e.target.value })
        }
      />

      <Input
        placeholder="Owner"
        value={form.owner}
        onChange={(e: any) =>
          setForm({ ...form, owner: e.target.value })
        }
      />

      <Input
        placeholder="Location"
        value={form.location}
        onChange={(e: any) =>
          setForm({ ...form, location: e.target.value })
        }
      />

      <div style={{ marginBottom: 15 }}>
        <label>Asset Type</label>
        <select
          style={{ width: "100%", padding: 10 }}
          value={form.asset_type}
          onChange={(e) =>
            setForm({ ...form, asset_type: e.target.value })
          }
        >
          <option>Application</option>
          <option>Server</option>
          <option>Database</option>
          <option>Network</option>
          <option>Endpoint</option>
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>CIA Level</label>
        <select
          style={{ width: "100%", padding: 10 }}
          value={form.cia_level}
          onChange={(e) =>
            setForm({ ...form, cia_level: e.target.value })
          }
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <Button onClick={handleAddAsset}>
        + Add Asset
      </Button>

      <p style={{ marginTop: 15 }}>
        Assets registered: {assets.length}
      </p>

      <Button
        onClick={nextStep}
        style={{ marginTop: 20 }}
      >
        Continue
      </Button>
    </Container>
  );
}